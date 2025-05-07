package project.backend.Controller;

import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.backend.DTO.ResponseDTO;
import project.backend.DTO.TravelPlanDTO;
import project.backend.Entity.ApplicantsEntity;
import project.backend.Entity.TravelPlanEntity;
import project.backend.Entity.UserTravelsEntity;
import project.backend.Security.TokenProvider;
import project.backend.Service.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

/*
MongoDB에서는 컬렉션이 데이터가 실제로 삽입될 때 자동으로 생성됩니다.
즉, MongoRepository를 통해 데이터를 삽입하려고 시도했을 때, 컬렉션이 자동으로 생성됩니다
 */
@RestController
@RequestMapping("/plan")
public class TravelPlanController
{

    @Autowired
    private S3ImageService s3ImageService;

    @Autowired
    private TravelPlanService travelPlanService;

    @Autowired
    private UserService userService;



    @Autowired
    private AppllicantsService appllicantsService;

    @Value("${encrypt.key}")
    private String key;

    private  ResponseDTO responseDTO = new ResponseDTO<>();

    @Autowired
    private UserTravelsService userTravelsService;



    //https://innovation123.tistory.com/197
    //시작 날짜를 기준으로 데이터 정렬하여 프론트엔드로 전송
    //@Cacheable(value = "travelCode")
    @PostMapping("/find")
    public ResponseEntity<?> TravelDTO(@AuthenticationPrincipal String userId)
    {
        //find는 복호화를 시키지 않고 TravelCode를 복호화시키지 않고 보냄.
        //프론트 엔드가 복호화 함수로 그 TravelCode를 복호화시켜서 보여준다.
        try {
            Flux<TravelPlanEntity> travelPlan = travelPlanService.travelPlanEntityAll(userId);
            Flux<TravelPlanEntity> travelPlanAll = travelPlan.map(travelPlanEntity -> {
                try {

                    TravelPlanEntity travelPlan1 = ConvertToMain(decrypt(travelPlanEntity.getTravelCode(), key), travelPlanEntity);
                    return travelPlan1;
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });

            Flux<TravelPlanDTO> travelPlanAll2 = travelPlanAll.map(travelPlanEntity ->
            {
                TravelPlanDTO travelPlanDTO = ConvertTo(travelPlanEntity.getTravelCode(), travelPlanEntity, travelPlanEntity.getImg());
                List<String> list = new ArrayList<>();
                list.add(travelPlanEntity.getFounder());
                list.addAll(travelPlanEntity.getParticipants());
                List<String> profile = new ArrayList<>();
                for(int i = 0; i < list.size(); i++)
                {
                    profile.add(userService.getprofileByEmail(list.get(i)));
                }//지금 user 정보 전부가 들어가고 있음.
                TravelPlanDTO travelPlanDTO1 = ConvertTo(profile, travelPlanDTO);
                return travelPlanDTO1;
            });
            List<TravelPlanDTO> resultList = travelPlanAll2.collectList().block();
            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", resultList));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
    //정상적으로 동작 되어짐 확인
    @PostMapping("/insert")
    //@CacheEvict(value = "travelCode", allEntries = true)
    public ResponseEntity<?> TravelInsert(@AuthenticationPrincipal String userId, @RequestBody TravelPlanDTO travelPlanDTO)
    {

        try
        {
            int leftLimit = 48; // numeral '0'
            int rightLimit = 122; // letter 'z'
            int targetStringLength = 6;
            Random random = new Random();
            String generatedString;
              // 16 바이트 키 (AES-128)

            //System.out.println(travelPlanDTO);

            while (true)
            {

                generatedString = random.ints(leftLimit,rightLimit + 1)
                        .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                        .limit(targetStringLength)
                        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                        .toString();

                if(travelPlanService.SelectTravelCode(generatedString) == false)
                {
                    break;
                }
            }
            //System.out.println(userId);
            TravelPlanEntity travelPlan = ConvertTo(userId, encrypt(generatedString, key), travelPlanDTO);
            List<Object> list = new ArrayList<>();
            TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanInsert(travelPlan).block();
            list.add(Collections.singletonList(ConvertTo(generatedString, travelPlan1)));
            UserTravelsEntity userTravels = userTravelsService.insertUserTravels(userId, encrypt(generatedString, key));
            list.add(userTravels);
            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }

    }


    @PostMapping("/Delete/tour/{travelcode}")
    public ResponseEntity<?> TravelTourDelete(@AuthenticationPrincipal String userId, @PathVariable(value = "travelcode") String travelcode)
    {
        try
        {
            TravelPlanEntity travelPlan = travelPlanService.TravelPlanSelect(encrypt(travelcode, key)).block();
            if(travelPlan.getFounder().equals(userId) == true)
            {
                throw new IllegalArgumentException("주최자는 여행에서 빠질 수 없습니다. 빠지고 싶으시면 주최자를 변경 후, 시도해주세요.");
            }
            else
            {
                if(travelPlan.getParticipants().contains(userId) == true)
                {
                    Set<String> set = new HashSet<>();
                    set.addAll(travelPlan.getParticipants());
                    set.remove(userId);
                    TravelPlanEntity travelPlan1 = ConvertTo(travelPlan, set);
                    TravelPlanEntity travelPlan2 = travelPlanService.TravelPlanUpdate(travelPlan1).block();
                    UserTravelsEntity userTravelsEntity1 = userTravelsService.DeleteUserTravels(userId, encrypt(travelcode,key));
                    List<Object> list = new ArrayList<>();
                    list.add(travelPlan2);
                    if(userTravelsEntity1.getTravelList().isEmpty() == true)
                    {
                        userTravelsService.DeleteUser(userId);
                    }
                    else
                    {
                        list.add(userTravelsEntity1);
                    }
                    return ResponseEntity.ok().body(responseDTO.Response("success", "여행에 참여하지 못해 아쉬우시죠?", list));
                }
                else
                {
                    throw new IllegalArgumentException("참여자 목록에 존재하지 않은 회원입니다.");

                }
            }
        }
        catch (Exception e)
        {
            return  ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }

    }




    //유출되도 상관 없을 것 같은 데이터(기능 동작 확인)
    @PutMapping("/update/{travelcode}")
    @CacheEvict(value = "travelCode", key = "#travelcode")
    public ResponseEntity<?> TravelUpdate(@RequestPart(value = "image", required = false) MultipartFile image, @AuthenticationPrincipal String userId, @PathVariable(value = "travelcode") String travelcode, @ModelAttribute TravelPlanDTO newtravelPlanDTO)
    {
        try
        {
            if(travelPlanService.SelectTravelCode(travelcode) == true)
            {
                System.out.println(newtravelPlanDTO);

                TravelPlanEntity Oldtravelplan = travelPlanService.TravelPlanSelect(encrypt(travelcode, key)).block();
                TravelPlanEntity travelPlan = ConvertTo(Oldtravelplan, newtravelPlanDTO);
                List<Object> list = new ArrayList<>();

                //System.out.println(Oldtravelplan.getFounder());
                if(Oldtravelplan.getFounder().equals(userId))
                {
                    if (image != null && !image.isEmpty())
                    {
                        //System.out.println("before image : " + image);
                        // 이미지가 있는 경우에만 처리
                        if(Oldtravelplan.getImg() != null && Oldtravelplan.getImg().equals(newtravelPlanDTO.getImg()) == false && Oldtravelplan.getImg().contains("https://images.unsplash.com/") != true)
                        {
                            //System.out.println("affter image : " + image);
                            s3ImageService.deleteImageFromS3(Oldtravelplan.getImg());
                        }
                        String ImageUrl = s3ImageService.upload(image);
                        TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanUpdate(ConvertTo(travelPlan, ImageUrl)).block();
                        list.add(Collections.singletonList(ConvertTo(travelcode, travelPlan1, ImageUrl)));

                    }
                    else
                    {

                        TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanUpdate(travelPlan).block();
                        list.add(Collections.singletonList(ConvertTo(travelcode, travelPlan1)));
                    }
                    return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                }
                else if(Oldtravelplan.getParticipants().contains(userId) == true)
                {
                    if (image != null && !image.isEmpty())
                    {
//                        // 이미지가 있는 경우에만 처리
//                        if(Oldtravelplan.getImg().equals(newtravelPlanDTO.getImg()) == false && Oldtravelplan.getImg().contains("https://images.unsplash.com/") != true && newtravelPlanDTO.getImg() != null)
//                        {
//                            System.out.println("dfsdfdfs");
//                            s3ImageService.deleteImageFromS3(Oldtravelplan.getImg());
//                        }
                        String ImageUrl = s3ImageService.upload(image);
                        TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanUpdate(ConvertTo(travelPlan, ImageUrl)).block();
                        list.add(Collections.singletonList(ConvertTo(travelcode, travelPlan1, ImageUrl)));

                    }
                    else
                    {
                        TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanUpdate(travelPlan).block();
                        list.add(Collections.singletonList(ConvertTo(travelcode, travelPlan1)));
                    }
                    return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                }
                else
                {
                    throw new AccessDeniedException("여행 코드는 존재하나, 데이터를 수정할 권한이 없습니다.");
                }
            }
            else
            {
                throw new NoSuchElementException("여행 코드는 존재하나, 데이터를 수정할 권한이 없습니다.");
            }

        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage(), null));
        }

    }

    //travelcode에 따라 데이터 출력 확인
    @PostMapping("/select/{travelCode}")
    @Cacheable(value = "travelCode", key = "#travelCode")
    public ResponseEntity<?> TravelSelect(@PathVariable(value = "travelCode") String travelCode)
    {
        try
        {
            TravelPlanEntity travelPlan1 = travelPlanService.TravelPlanSelect(encrypt(travelCode, key)).block();
            Thread.sleep(2000);
            List<String> parts = new ArrayList<>();
            parts.addAll(travelPlan1.getParticipants());
            parts.add(travelPlan1.getFounder());
            List<String> profile = new ArrayList<>();
            for(int i = 0; i < parts.size(); i++)
            {
                profile.add(userService.getprofileByEmail(parts.get(i)));

            }//지금 user 정보 전부가 들어가고 있음.

            TravelPlanDTO travelPlanDTO1 = ConvertTo(profile, travelPlan1);
            System.out.println("object : " + travelPlanDTO1);
            List<Object> list = new ArrayList<>(Collections.singletonList(ConvertTo(travelCode, travelPlanDTO1)));
            return ResponseEntity.ok().body(responseDTO.Response("info", "데이터 전송 알림!!", list));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    //여행 신청 정보에 대해 개별 승인
    @PostMapping("/check/{travelCode}")
    @CacheEvict(value = "travelCode", key = "#travelCode")
    public ResponseEntity<?> TravelCheckindividual(@AuthenticationPrincipal String userId, @PathVariable(value = "travelCode") String travelCode, @RequestBody String Applicant )
    {
        try
        {
            System.out.println("Received Applicant: " + Applicant);

            Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanService.TravelPlanSelect(encrypt(travelCode, key));
            if (travelPlanEntityMono.block().getFounder().equals(userId))
            {
                Mono<ApplicantsEntity> applicantsEntityMono = appllicantsService.applicantsSelect(encrypt(travelCode, key));
                System.out.println("ApplicationsEntity: " + applicantsEntityMono.block().getUserList());
                List<String> userList = new ArrayList<>(applicantsEntityMono.block().getUserList());
                if(userList.contains(Applicant.trim()))
                {
                    TravelPlanEntity travelPlan = ConvertToParticipants(Applicant, travelPlanEntityMono);
                    System.out.println("travelPlan: " + travelPlan);
                    Mono<TravelPlanEntity> travelPlanEntityMono1 = travelPlanService.TravelPlanUpdate(travelPlan);
                    System.out.println("travelPlanEntityMono1: " + travelPlanEntityMono1.block());
                    UserTravelsEntity userTravels = userTravelsService.insertUserTravels(Applicant, travelCode);
                    System.out.println("userTravels: " + userTravels);
                    List<Object> list = new ArrayList<>(Collections.singletonList(travelPlanEntityMono1));
                    return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                }
                else
                {
                    throw new NoSuchElementException ("신청자 목록에 존재하지 않은 사람입니다.");
                }
            }
            else
            {
                throw new AccessDeniedException("데이터를 수정할 수 있는 총무가 아닙니다.");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }


    //여행신청자 정보에 대해 승인해주는 것 - 단체 승인
    @PostMapping("/checkAll/{travelCode}")
    public ResponseEntity<?> TravelCheckAll(@AuthenticationPrincipal String userId, @PathVariable(value = "travelCode") String travelCode) {

        try {
            Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanService.TravelPlanSelect(travelCode);
            if (travelPlanEntityMono.block().getFounder().equals(userId))
            {
                Mono<ApplicantsEntity> applicantsEntityMono = appllicantsService.applicantsSelect(travelCode);
                TravelPlanEntity travelPlan = ConvertToParticipants(applicantsEntityMono, travelPlanEntityMono);
                Mono<TravelPlanEntity> travelPlanEntityMono1 = travelPlanService.TravelPlanUpdate(travelPlan);
                appllicantsService.TravelPlanAllDelete(travelCode);//전체 승인이 완료되었으므로 데이터 삭제
                Set<String> applicants = applicantsEntityMono.block().getUserList();
                for( String applicant : applicants )
                {
                    userTravelsService.insertUserTravels(applicant, travelCode);
                }
                List<Object> list = new ArrayList<>(Collections.singletonList(travelPlanEntityMono1));
                return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
            }
            else
            {
                throw new RuntimeException("데이터를 수정할 수 있는 총무가 아닙니다.");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }


    @PostMapping("/count/All")
    public ResponseEntity<?> TravelCount()
    {
        try
        {
            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", Collections.singletonList(travelPlanService.TravelPlanCount())));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));

        }
    }
    @PostMapping("/count/location")
    public ResponseEntity<?> locationCount()
    {
        try
        {

            System.out.println(travelPlanService.getVisitCountByRegion());
            List<Map> list = travelPlanService.getVisitCountByRegion();
            // List<Map>에서 각 데이터를 수정하는 예시
            // 각 지역의 방문 횟수를 전체 방문 횟수로 나누기
            for (Map<String, Object> data : list) {
                String region = (String) data.get("_id");
                Integer visitCount = (Integer) data.get("visitCount");

                // 전체 방문 횟수로 나누기
                double visitRatio = ((double) visitCount / travelPlanService.TravelPlanCount()) * 100;
                double roundedValue = Math.round(visitRatio * 10.0) / 10.0;
                // 결과에 비율 추가
                data.put("visitRatio", roundedValue); // visitRatio 필드를 추가
            }

            // 수정된 데이터 확인
            for (Map<String, Object> data : list) {
                System.out.println(data); // 수정된 데이터를 출력
            }

            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
    //데이터베이스에서 데이터 정상 제거 확인
    @DeleteMapping("/delete/{travelCode}")
    @CacheEvict(value = "travelCode", allEntries = true)
    public ResponseEntity<?> TravelDelete(@AuthenticationPrincipal String userId, @PathVariable(value = "travelCode") String travelCode)
    {
        try
        {

            System.out.println("현재 위치 :" + travelCode);
            if(travelPlanService.SelectTravelCode(travelCode))
            {
                System.out.println("현재 위치 :" + travelCode);

                Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanService.TravelPlanSelect(encrypt(travelCode,key));
                if(travelPlanEntityMono.block().getFounder().equals(userId) || travelPlanEntityMono.block().getParticipants().contains(userId))
                {
                    travelPlanService.TravelPlanDelete(encrypt(travelCode, key));
                    if(appllicantsService.ApplicantExistance(encrypt(travelCode, key)).block() == true)
                    //mongoDB는 NoSql이라 관계에 의한 cascade 삭제를 지원하지 않아 관련 처리 진행
                    {
                        if(travelPlanEntityMono.block().getImg().contains("https://images.unsplash.com/") != true)
                        {
                            s3ImageService.deleteImageFromS3(travelPlanEntityMono.block().getImg());
                        }
                        appllicantsService.TravelPlanAllDelete(encrypt(travelCode,key));
                    }
                    List<Object> list = new ArrayList<>();
                    list.add(travelPlanEntityMono);
                    return ResponseEntity.ok().body(responseDTO.Response("info", "정상적으로 데이터 제거가 완료되었습니다.", list));
                }
                else
                {
                    throw  new RuntimeException("해당 데이터를 삭제할 권한이 없습니다.");
                }

            }
            else
            {
                throw  new RuntimeException("해당 여행 코드를 가진 데이터를 찾을 수 없습니다. 다시 확인해주세요...");
            }

        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }

    }

    private TravelPlanEntity ConvertTo(TravelPlanEntity travelPlanEntity, String ImageUrl)
    {
        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(travelPlanEntity.getTravelCode())
                .location(travelPlanEntity.getLocation())
                .startDate(travelPlanEntity.getStartDate())
                .endDate(travelPlanEntity.getEndDate())
                .expense(travelPlanEntity.getExpense())
                .founder(travelPlanEntity.getFounder())
                .title(travelPlanEntity.getTitle())
                .participants(travelPlanEntity.getParticipants())
                .isCalculate(travelPlanEntity.isCalculate())
                .img(ImageUrl)
                .currentCurrency(travelPlanEntity.getCurrentCurrency())
                .build();

        return travelPlan;
    }


    private TravelPlanEntity ConvertTo(String userid, String RandomString, TravelPlanDTO travelPlanDTO)
    {
        Set userset = new HashSet<>();
        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(RandomString)
                .location(travelPlanDTO.getLocation())
                .startDate(travelPlanDTO.getStartDate())
                .endDate(travelPlanDTO.getEndDate())
                .expense(travelPlanDTO.getExpense())
                .title(travelPlanDTO.getTitle())
                .founder(userid)
                .participants(userset)
                .img(travelPlanDTO.getImg())
                .isCalculate(travelPlanDTO.isCalculate())
                .currentCurrency(travelPlanDTO.getCurrentCurrency())
                .build();

        return travelPlan;
    }
    private TravelPlanDTO ConvertTo(String generatedString, TravelPlanEntity travelPlan1)
    {
        TravelPlanDTO travelPlanDTO = TravelPlanDTO.builder()
                .travelCode(generatedString)
                .location(travelPlan1.getLocation())
                .startDate(travelPlan1.getStartDate())
                .endDate(travelPlan1.getEndDate())
                .expense(travelPlan1.getExpense())
                .founder(travelPlan1.getFounder())
                .title(travelPlan1.getTitle())
                .participants(travelPlan1.getParticipants())
                .isCalculate(travelPlan1.isCalculate())
                .img(travelPlan1.getImg())
                .currentCurrency(travelPlan1.getCurrentCurrency())
                .build();

        return travelPlanDTO;
    }

    private TravelPlanDTO ConvertTo(String travelCode, TravelPlanDTO travelPlan)
    {
        TravelPlanDTO travelPlans = TravelPlanDTO.builder()
                .travelCode(travelCode)
                .location(travelPlan.getLocation())
                .startDate(travelPlan.getStartDate())
                .endDate(travelPlan.getEndDate())
                .expense(travelPlan.getExpense())
                .founder(travelPlan.getFounder())
                .title(travelPlan.getTitle())
                .participants(travelPlan.getParticipants())
                .isCalculate(travelPlan.isCalculate())
                .profiles(travelPlan.getProfiles())
                .img(travelPlan.getImg())
                .currentCurrency(travelPlan.getCurrentCurrency())
                .build();

        return travelPlans;
    }

    private TravelPlanDTO ConvertTo(List<String> profilelist, TravelPlanDTO travelPlanDTO)
    {
        TravelPlanDTO travelPlanDTO1 = TravelPlanDTO.builder()
                                        .travelCode(travelPlanDTO.getTravelCode())
                                        .location(travelPlanDTO.getLocation())
                                        .startDate(travelPlanDTO.getStartDate())
                                        .endDate(travelPlanDTO.getEndDate())
                                        .expense(travelPlanDTO.getExpense())
                                        .founder(travelPlanDTO.getFounder())
                                        .title(travelPlanDTO.getTitle())
                                        .participants(travelPlanDTO.getParticipants())
                                        .isCalculate(travelPlanDTO.isCalculate())
                                        .img(travelPlanDTO.getImg())
                                        .profiles(profilelist)
                                        .currentCurrency(travelPlanDTO.getCurrentCurrency())
                                        .build();

        return travelPlanDTO1;
    }

    private TravelPlanDTO ConvertTo(List<String> profilelist, TravelPlanEntity travelPlan1)
    {
        TravelPlanDTO travelPlanDTO1 = TravelPlanDTO.builder()
                .travelCode(travelPlan1.getTravelCode())
                .location(travelPlan1.getLocation())
                .startDate(travelPlan1.getStartDate())
                .endDate(travelPlan1.getEndDate())
                .expense(travelPlan1.getExpense())
                .founder(travelPlan1.getFounder())
                .title(travelPlan1.getTitle())
                .participants(travelPlan1.getParticipants())
                .isCalculate(travelPlan1.isCalculate())
                .img(travelPlan1.getImg())
                .profiles(profilelist)
                .currentCurrency(travelPlan1.getCurrentCurrency())
                .build();

        return travelPlanDTO1;
    }


    private TravelPlanEntity ConvertTo(TravelPlanEntity travelPlan, Set<String> set)
    {
        TravelPlanEntity travelPlan1 = TravelPlanEntity.builder()
                .travelCode(travelPlan.getTravelCode())
                .location(travelPlan.getLocation())
                .startDate(travelPlan.getStartDate())
                .endDate(travelPlan.getEndDate())
                .founder(travelPlan.getFounder())
                .title(travelPlan.getTitle())
                .participants(set)
                .isCalculate(travelPlan.isCalculate())
                .id(travelPlan.getId())
                .img(travelPlan.getImg())
                .currentCurrency(travelPlan.getCurrentCurrency())
                .build();

        return  travelPlan1;
    }

    private TravelPlanEntity ConvertTo(TravelPlanEntity OldEntity, TravelPlanDTO NewDTO)
    {
        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(OldEntity.getTravelCode())
                .location(NewDTO.getLocation())
                .startDate(NewDTO.getStartDate())
                .endDate(NewDTO.getEndDate())
                .expense(NewDTO.getExpense())
                .founder(OldEntity.getFounder())
                .title(NewDTO.getTitle())
                .participants(OldEntity.getParticipants())
                .isCalculate(NewDTO.isCalculate())
                .id(OldEntity.getId())
                .img(OldEntity.getImg())
                .currentCurrency(NewDTO.getCurrentCurrency())
                .build();

        return travelPlan;
    }

    private TravelPlanEntity ConvertToMain(String travelCode, TravelPlanEntity travelPlanEntity)
    {
        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(travelCode)
                .location(travelPlanEntity.getLocation())
                .startDate(travelPlanEntity.getStartDate())
                .endDate(travelPlanEntity.getEndDate())
                .expense(travelPlanEntity.getExpense())
                .founder(travelPlanEntity.getFounder())
                .participants(travelPlanEntity.getParticipants())
                .title(travelPlanEntity.getTitle())
                .img(travelPlanEntity.getImg())
                .isCalculate(travelPlanEntity.isCalculate())
                .id(travelPlanEntity.getId())
                .currentCurrency(travelPlanEntity.getCurrentCurrency())
                .build();

        return travelPlan;
    }


    private TravelPlanDTO ConvertTo(String travelCode, TravelPlanEntity travelPlanEntity, String imgUri)
    {
        TravelPlanDTO travelPlan = TravelPlanDTO.builder()
                .travelCode(travelCode)
                .location(travelPlanEntity.getLocation())
                .startDate(travelPlanEntity.getStartDate())
                .endDate(travelPlanEntity.getEndDate())
                .expense(travelPlanEntity.getExpense())
                .founder(travelPlanEntity.getFounder())
                .title(travelPlanEntity.getTitle())
                .participants(travelPlanEntity.getParticipants())
                .isCalculate(travelPlanEntity.isCalculate())
                .img(imgUri)
                .currentCurrency(travelPlanEntity.getCurrentCurrency())
                .build();

        return travelPlan;
    }

    //암호화 코드 작성
    private static String encrypt(String data, String key) throws Exception
    {
         SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
         byte[] encryptedData = cipher.doFinal(data.getBytes());
         return Base64.getEncoder().encodeToString(encryptedData);
    }

    // 복호화: 암호화된 문자열을 AES 알고리즘을 사용하여 복호화
    private static String decrypt(String encryptedData, String key) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedData = cipher.doFinal(decodedBytes);
        return new String(decryptedData);
    }

    // AES 키 생성 (16 바이트 키)
    private static String generateKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(128);  // 128비트 키 생성
        SecretKey secretKey = keyGenerator.generateKey();
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }
    private TravelPlanEntity ConvertToParticipants(Mono<ApplicantsEntity> applicantsEntity, Mono<TravelPlanEntity> travelPlanEntityMono)
    {
        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(travelPlanEntityMono.block().getTravelCode())
                .location(travelPlanEntityMono.block().getLocation())
                .startDate(travelPlanEntityMono.block().getStartDate())
                .endDate(travelPlanEntityMono.block().getEndDate())
                .expense(travelPlanEntityMono.block().getExpense())
                .founder(travelPlanEntityMono.block().getFounder())
                .participants(applicantsEntity.block().getUserList())
                .isCalculate(travelPlanEntityMono.block().isCalculate())
                .id(travelPlanEntityMono.block().getId())
                .currentCurrency(travelPlanEntityMono.block().getCurrentCurrency())
                .img(travelPlanEntityMono.block().getImg())
                .build();
        return travelPlan;
    }
    private TravelPlanEntity ConvertToParticipants(String Applicants, Mono<TravelPlanEntity> travelPlanEntityMono)
    {
        Set ApplicantsList = new HashSet<>();
        ApplicantsList.addAll(travelPlanEntityMono.block().getParticipants());
        ApplicantsList.add(Applicants);

        TravelPlanEntity travelPlan = TravelPlanEntity.builder()
                .travelCode(travelPlanEntityMono.block().getTravelCode())
                .title(travelPlanEntityMono.block().getTitle())
                .location(travelPlanEntityMono.block().getLocation())
                .startDate(travelPlanEntityMono.block().getStartDate())
                .endDate(travelPlanEntityMono.block().getEndDate())
                .expense(travelPlanEntityMono.block().getExpense())
                .founder(travelPlanEntityMono.block().getFounder())
                .participants(ApplicantsList)
                .isCalculate(travelPlanEntityMono.block().isCalculate())
                .id(travelPlanEntityMono.block().getId())
                .img(travelPlanEntityMono.block().getImg())
                .currentCurrency(travelPlanEntityMono.block().getCurrentCurrency())
                .build();
        return travelPlan;
    }
}