package project.backend.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.backend.DTO.ExpendituresDTO;
import project.backend.DTO.ResponseDTO;
import project.backend.Entity.ExpenditureEntity;
import project.backend.Service.ExpenditureService;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Random;

/*
MongoDB에서는 컬렉션이 데이터가 실제로 삽입될 때 자동으로 생성됩니다.
즉, MongoRepository를 통해 데이터를 삽입하려고 시도했을 때, 컬렉션이 자동으로 생성됩니다
 */
@RestController
@RequestMapping("/expenditures")
public class ExpendituresController {

    @Autowired
    private ExpenditureService expenditureService;

    private ResponseDTO responseDTO = new ResponseDTO<>();

    @Value("${encrypt.key}")
    private String key;

    // 지출 추가
    @PostMapping("/{travelCode}")
    public ResponseEntity<?> createExpenditure(@AuthenticationPrincipal String email, @RequestBody ExpendituresDTO expendituresDTO, @PathVariable String travelCode)
    {
        try {
            int leftLimit = 48; // numeral '0'
            int rightLimit = 122; // letter 'z'
            int targetStringLength = 8;
            Random random = new Random();
            String generatedString;
            // 16 바이트 키 (AES-128)

            while (true) {
                generatedString = random.ints(leftLimit, rightLimit + 1)
                        .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                        .limit(targetStringLength)
                        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                        .toString();
                if (expenditureService.SelectExpenditureId(generatedString) == false) {
                    break;
                }
            }
            ExpenditureEntity expenditure = ExpenditureEntity.builder()
                    .travelCode(ExpenditureService.encrypt(travelCode, key))
                    .expenditureId(ExpenditureService.encrypt(generatedString,key))
                    .purpose(expendituresDTO.getPurpose())
                    .method(expendituresDTO.getMethod())
                    .isPublic(expendituresDTO.isPublic())
                    .payer(expendituresDTO.getPayer())
                    .date(expendituresDTO.getDate())
                    .KRW(expendituresDTO.getKRW())
                    .amount(expendituresDTO.getAmount())
                    .currency(expendituresDTO.getCurrency())
                    .description(expendituresDTO.getDescription())
                    .build();

            ExpenditureEntity createExpenditure = expenditureService.create(email, expenditure).block();

            ExpendituresDTO responsedDTO = ExpendituresDTO.builder()
                    .travelCode(travelCode)
                    .expenditureId(decrypt(createExpenditure.getExpenditureId(),key))
                    .purpose(createExpenditure.getPurpose())
                    .method(createExpenditure.getMethod())
                    .isPublic(createExpenditure.isPublic())
                    .payer(createExpenditure.getPayer())
                    .date(createExpenditure.getDate())
                    .KRW(createExpenditure.getKRW())
                    .amount(createExpenditure.getAmount())
                    .currency(createExpenditure.getCurrency())
                    .description(createExpenditure.getDescription())
                    .build();

            List<Object> list = new ArrayList<>();
            list.add(responsedDTO);
            evictCache(true);
            return ResponseEntity.ok().body(responseDTO.Response("success", "정상적으로 지출 추가가 완료되었습니다.", list));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    // 지출 목록
    @GetMapping("/{travelCode}")
//     @Cacheable(value = "Expenditure", key = "#travelCode")
    public ResponseEntity<?> findAllExpenditures(@AuthenticationPrincipal String email, @PathVariable String travelCode) {

        try
        {
            Boolean bool = expenditureService.SelectTravelCode(ExpenditureService.encrypt(travelCode, key));
            System.out.println("현재 상태: " + bool);
            if(bool)
            {
                List<ExpenditureEntity> expenditures = expenditureService.findAllByTravelCode(ExpenditureService.encrypt(travelCode,key)).collectList().block();
                List<ExpendituresDTO> expendituresDTOS = new ArrayList<>();
                for(ExpenditureEntity expenditure : expenditures)
                {
                    ExpendituresDTO expendituresDTO = ExpendituresDTO.builder()
                            .travelCode(decrypt(expenditure.getTravelCode(),key))
                            .expenditureId(decrypt(expenditure.getExpenditureId(),key))
                            .purpose(expenditure.getPurpose())
                            .method(expenditure.getMethod())
                            .isPublic(expenditure.isPublic())
                            .payer(expenditure.getPayer())
                            .date(expenditure.getDate())
                            .KRW(expenditure.getKRW())
                            .amount(expenditure.getAmount())
                            .currency(expenditure.getCurrency())
                            .description(expenditure.getDescription())
                            .build();
                    expendituresDTOS.add(expendituresDTO);
                }

                return ResponseEntity.ok().body(expendituresDTOS);
            }
            else
            {
                List<String> list = new ArrayList<>();
                return ResponseEntity.ok().body(list);
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));

        }
    }

    //지출수정
    @PutMapping("/{travelCode}/{expenditureId}")
    @CachePut(value = "Expenditure", key = "#travelCode")
    public ResponseEntity<?> updateExpenditure(@AuthenticationPrincipal String email, @RequestBody ExpendituresDTO expendituresDTO, @PathVariable String travelCode, @PathVariable String expenditureId) {
        try {

            System.out.println("object :" + expendituresDTO);

            ExpenditureEntity expenditure = ExpenditureEntity.builder()
                    .travelCode(ExpenditureService.encrypt(travelCode,key))
                    .expenditureId(ExpenditureService.encrypt(expenditureId,key))
                    .purpose(expendituresDTO.getPurpose())
                    .method(expendituresDTO.getMethod())
                    .isPublic(expendituresDTO.isPublic())
                    .payer(expendituresDTO.getPayer())
                    .date(expendituresDTO.getDate())
                    .KRW(expendituresDTO.getKRW())
                    .amount(expendituresDTO.getAmount())
                    .currency(expendituresDTO.getCurrency())
                    .description(expendituresDTO.getDescription())
                    .build();



            ExpenditureEntity updateExpenditure = expenditureService.updateExpenditure(email, ExpenditureService.encrypt(expenditureId,key), expenditure).block();

            ExpendituresDTO responsedDTO = ExpendituresDTO.builder()
                    .travelCode(decrypt(updateExpenditure.getTravelCode(),key))
                    .expenditureId(decrypt(updateExpenditure.getExpenditureId(),key))
                    .purpose(updateExpenditure.getPurpose())
                    .method(updateExpenditure.getMethod())
                    .isPublic(updateExpenditure.isPublic())
                    .payer(updateExpenditure.getPayer())
                    .date(updateExpenditure.getDate())
                    .KRW(updateExpenditure.getKRW())
                    .amount(updateExpenditure.getAmount())
                    .currency(updateExpenditure.getCurrency())
                    .description(updateExpenditure.getDescription())
                    .build();

            List<Object> list = new ArrayList<>();
            list.add(responsedDTO);
            return ResponseEntity.ok().body(responseDTO.Response("success", "지출 목록을 수정합니다.", list));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    @CacheEvict(value = "Expenditure", allEntries = true, condition = "#cash == true")
    public void evictCache(boolean cash)
    {
        // cash가 true일 때만 이 메소드가 호출되고 캐시가 삭제됩니다.
    }

    // 지출 삭제
    @DeleteMapping("/{travelCode}/{expenditureId}")
    public ResponseEntity<?> deleteExpenditure(@AuthenticationPrincipal String email, @PathVariable String travelCode,@PathVariable String expenditureId) {
        try
        {
            boolean bool = expenditureService.SelectExpenditureId(ExpenditureService.encrypt(expenditureId,key));

            if(bool == true)
            {
                List<ExpenditureEntity> deletedExpenditure = expenditureService.deleteExpenditure(email,  ExpenditureService.encrypt(travelCode,key), ExpenditureService.encrypt(expenditureId,key)).collectList().block();
                evictCache(bool);
                return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", deletedExpenditure));
            }
            else
            {
                throw new Exception("삭제할 Expenditure 목록이 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
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

//마지막 과제 : 카드 별, 현금 별로 데이터 뽑아오는 함수 추가

}