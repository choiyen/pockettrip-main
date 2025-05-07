package project.backend.Controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.backend.DTO.ApplicantsDTO;
import project.backend.DTO.ResponseDTO;
import project.backend.DTO.TravelPlanDTO;
import project.backend.Entity.ApplicantsEntity;
import project.backend.Entity.TravelPlanEntity;
import project.backend.Service.AppllicantsService;
import project.backend.Service.TravelPlanService;
import reactor.core.publisher.Mono;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/apply")
public class ApplicantsController
{
    private ResponseDTO responseDTO = new ResponseDTO();


    @Value("${encrypt.key}")
    private String key;

    @Autowired
    private TravelPlanService travelPlanService;

    @Autowired
    private AppllicantsService appllicantsService;




    @PostMapping("/select/{Travelcode}")
    public ResponseEntity<?> ApplicantsSelect(@AuthenticationPrincipal String userId, @PathVariable(value = "Travelcode") String Travelcode )
    {
        try
        {


            TravelPlanEntity travelPlan = travelPlanService.TravelPlanSelect(encrypt(Travelcode, key)).block();
            if(travelPlan.getFounder().equals(userId))
            {
                if(appllicantsService.ApplicantExistance(encrypt(Travelcode, key)).block())
                {
                    Mono<ApplicantsEntity> applicants = appllicantsService.applicantsSelect(encrypt(Travelcode, key));
                    ApplicantsDTO applicantsDTO = ConvertTo(applicants).block();
                    return ResponseEntity.ok().body(responseDTO.Response("success", "전송완료", Collections.singletonList(applicantsDTO)));
                }
                else
                {
                    log.warn("The data with Travelcode {} is not present in the Applicants document", Travelcode);
                    throw new Exception("현재 신청한 여행자가 존재하지 않습니다.");
                }

            }
            else
            {
                throw new Exception("관리자 권한이 없어서 불러올 수 없습니다.");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
    //Travel에 데이터가 있을 때만 DB에서 insert 되게 설정
    @PostMapping("/insert/{Travelcode}")
    public ResponseEntity<?> ApplicantsInsert(@AuthenticationPrincipal String userId, @PathVariable(value = "Travelcode") String Travelcode)
    {
        try
        {
            if(travelPlanService.SelectTravelCode(Travelcode) == true)
            {
                Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanService.TravelPlanSelect(encrypt(Travelcode, key));
                if(travelPlanEntityMono.block().getFounder().equals(userId))
                {
                    log.warn("The data with Travelcode {} is not present in the Applicants document", Travelcode);
                    throw new RemoteException("여행을 주관하는 사람은 이미 참석하는 사람입니다.");
                }
                else
                {
                    Mono<ApplicantsEntity> applicantsEntity = appllicantsService.AppllicantsInsert(encrypt(Travelcode , key), userId);
                    Mono<ApplicantsEntity> applicantsEntityMono = appllicantsService.applicantsSelect(encrypt(Travelcode, key));
                    List<Object> list = new ArrayList<>();
                    list.add(applicantsEntityMono.block());
                    return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                }

            }
            else
            {
                log.warn("The data with Travelcode {} is not present in the travel document", Travelcode);
                throw new IllegalArgumentException("Travelcode 값이 없는데 넣는 것은 불가능");
                //The data for that travel code is not present in the travel document.
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
    @DeleteMapping("/Delete/{Travelcode}")
    public synchronized ResponseEntity<?> ApplicantsDelete(@AuthenticationPrincipal String userId, @PathVariable(value = "Travelcode") String Travelcode)
    {
        try
        {

            // AWS 암호화 정책 설정 중에 application.properties에 시크릿 키가 존재하면 안됨.
            // AWS S3 관련 코드도 다시 추가해서 commit 해야 함.



            if(appllicantsService.ApplicantExistance(encrypt(Travelcode,key)).block() == true)
            {
                System.out.println(Travelcode);
                if(travelPlanService.SelectTravelCode(encrypt(Travelcode,key)) == true)
                {
                    Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanService.TravelPlanSelect(encrypt(Travelcode, key));
                    if(travelPlanEntityMono.block().getFounder().equals(userId))
                    {
                        throw new RemoteException("여행을 주관하는 사람은 참석하지 않을 수 없습니다.");
                    }
                    else
                    {
                        Mono<ApplicantsEntity> applicantsEntityMono = appllicantsService.AppllicantsDelete(encrypt(Travelcode,key), userId);
                        if(applicantsEntityMono.block().getUserList().isEmpty())
                        {
                            List<Object> list = new ArrayList<>();
                            list.add(appllicantsService.TravelPlanAllDelete(encrypt(Travelcode, key)));
                            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                        }
                        else
                        {
                            List<Object> list = new ArrayList<>(Collections.singletonList(ConvertTo(applicantsEntityMono)));
                            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", list));
                        }

                    }
                }
                else
                {
                    log.warn("The data with Travelcode {} is not present in the Applicants document", Travelcode);
                    throw new IllegalArgumentException("Travelcode 값이 없는데 넣는 것은 불가능");
                    //The data for that travel code is not present in the travel document.
                }
            }
            else
            {
                log.warn("The data with Travelcode {} is not present in the Applicants document", Travelcode);
                throw new IllegalArgumentException("TravelCode를 가진 Applicants가 존재하지 않음");
            }

        }
        catch (Exception e)
        {
            ResponseDTO<Mono<ApplicantsDTO>> responseDTO1 = responseDTO.Response("error", e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO1);
        }
    }



    public Mono<ApplicantsEntity> ConvertTo(ApplicantsDTO Applicants)
    {
        ApplicantsEntity Applicantsed = ApplicantsEntity.builder()
                .travelCode(Applicants.getTravelcode())
                .userList(Applicants.getUserList())
                .build();

        return  Mono.just(Applicantsed);
    }
    public Mono<ApplicantsDTO> ConvertTo(Mono<ApplicantsEntity> applicants)
    {
        ApplicantsDTO applicantsDTO = ApplicantsDTO.builder()
                .travelcode(applicants.block().getTravelCode())
                .userList(applicants.block().getUserList())
                .build();

        return  Mono.just(applicantsDTO);
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

}
