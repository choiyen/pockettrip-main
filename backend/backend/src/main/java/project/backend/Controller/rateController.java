package project.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import project.backend.Config.StartupRunner;
import project.backend.DTO.ResponseDTO;
import project.backend.Service.RateService;

import java.util.*;


@RestController
@RequestMapping("/rate")
@Slf4j
public class rateController {

    @Autowired
    private RateService rateService;

    private ResponseDTO responseDTO = new ResponseDTO<>();

    public List<Map<String, Object>> list = new ArrayList<>();


    @Value("${api.key}")
    private String apiKey;


    //11시에 환율은행 API가 갱신되므로, 12시에 해당 함수를 스케줄러가 자동 실행
    @Scheduled(cron = "0 0 12 * * *")
    @PostConstruct
    public void RatePost()
    {
        try
        {
            String rate = rateService.getObject();
            ObjectMapper objectMapper = new ObjectMapper();
            list = objectMapper.readValue(rate, List.class);

            for (Map<String, Object> map : list)
            {
                map.remove("deal_bas_r");
                map.remove("bkpr");
                map.remove("kftc_bkpr");
                map.remove("kftc_deal_bas_r");
                map.remove("yy_efee_r");
                map.remove("ten_dd_efee_r");
                map.remove("result");

                if(map.containsKey("cur_nm"))
                {
                    Object value = map.remove("cur_nm");
                    if(value.toString().contains("말레이지아"))
                    {
                        Object text = value.toString().replace("지", "시");
                        map.put("통화이름", text);

                    }
                    else if(value.toString().contains("유로"))
                    {
                        map.put("통화이름", "유럽연합 " + value);
                    }
                    else if(value.toString().contains("위안화"))
                    {
                        map.put("통화이름", "중국 " + value);
                    }
                    else if(value.toString().contains("덴마아크"))
                    {
                        Object text = value.toString().replace("아", "");
                        map.put("통화이름", text);
                    }
                    else
                    {
                        map.put("통화이름", value);

                    }

                }
                if (map.containsKey("cur_unit"))
                {
                    // 기존 키의 값을 가져오기
                    Object value = map.remove("cur_unit");
                    // 새로운 키와 값으로 추가
                    if(value.toString().contains("CNH"))
                    {
                        map.put("기준통화", "CNY");
                        Currency currency = Currency.getInstance("CNY");
                        //그 나라의 지역 값에 맞춰야지 정확한 값이 나타남.
                        String symbol = currency.getSymbol();
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("AED") || value.toString().contains("BHD") || value.toString().contains("KWD") || value.toString().contains("SAR"))
                    {
                        map.put("기준통화", value);
                        // UAE 로케일 (아랍어, 아랍에미리트)
                        Locale uaeLocale = new Locale("ar", "AE");
                        // UAE 로케일에 맞는 통화 기호 출력
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(uaeLocale);
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("NOK"))
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(new Locale("no", "NO"));  // 노르웨이어, 노르웨이 로케일
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("BND") || value.toString().contains("MYR"))
                    {
                        Locale bruneiLocale = new Locale("ms", "BN"); // 말레이어, 브루나이 로케일
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(bruneiLocale);
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("DKK"))
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(new Locale("da", "DK"));  // 덴마크어, 덴마크 로케일
                        map.put("통화기호", symbol);

                    }
                    else if(value.toString().contains("CHF"))
                    {
                        Locale switzerlandLocale = new Locale("de", "CH"); // 독일어, 스위스 로케일
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);

                        String symbol = currency.getSymbol(switzerlandLocale);
                        // 스위스 프랑의 경우, "F"로 출력하도록 변환
                        if ("CHF".equals(currency.getCurrencyCode()))
                        {
                            symbol = "F";  // 스위스 프랑의 기호를 "F"로 변경
                        }
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("IDR(100)"))
                    {
                        map.put("기준통화", "IDR");
                        Currency currency = Currency.getInstance("IDR");
                        String symbol = currency.getSymbol(new Locale("id", "ID"));  // 인도네시아어, 인도네시아 로케일
                        map.put("통화기호", symbol);

                    }
                    else if(value.toString().contains("SEK"))
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(new Locale("sv", "SE"));  // 스웨덴어, 스웨덴 로케일
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("THB"))
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol(new Locale("th", "TH"));  // 태국어, 태국 로케일
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("SGD"))
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol();  // 영어, 싱가포르 로케일
                        if ("SGD".equals(currency.getCurrencyCode()))
                        {
                            symbol = "S$";  // 스위스 프랑의 기호를 "F"로 변경
                        }
                        map.put("통화기호", symbol);
                    }
                    else if(value.toString().contains("JPY(100)"))
                    {
                        map.put("기준통화", "JPY");
                        Currency currency = Currency.getInstance("JPY");
                        String symbol = currency.getSymbol();
                        map.put("통화기호", symbol);
                    }
                    else
                    {
                        map.put("기준통화", value);
                        Currency currency = Currency.getInstance((String) value);
                        String symbol = currency.getSymbol();
                        map.put("통화기호", symbol);
                    }

                }
                if(map.containsKey("ttb"))
                {
                    Object value = map.remove("ttb");
                    map.put("환전구매환율", value);
                }
                if(map.containsKey("tts"))
                {
                    Object value = map.remove("tts");
                    map.put("환전판매환율", value);
                }
            }

            //한국 돈을 한국 돈으로 환전할 이유는 없음....따라서, 삭제
            Iterator<Map<String, Object>> iterator = list.iterator();

            while (iterator.hasNext())
            {
                Map<String, Object> currency = iterator.next();
                if (currency.get("통화이름").equals("한국 원")) {
                    iterator.remove(); // 해당 항목 삭제
                }
            }

            System.out.println(list);


        } catch (Exception e)
         {
            log.error("환율 등록 과정에서 오류 발생 : {}", e.getMessage(), e);
        }
    }

    @GetMapping
    public ResponseEntity<?> responseEntity()
    {
        try
        {
            return ResponseEntity.ok().body(responseDTO.Response("info", "환율 데이터 전송완료!", list));

        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }


    @PostMapping("/country")
    public  ResponseEntity<?> responseEntity(@RequestBody String country)
    {
        try
        {

            List<Map<String, Object>> result = new ArrayList<>();
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> result1 = objectMapper.readValue(country, Map.class);
            // "country" 키의 값을 가져오기
            String countrys = result1.get("country");

            for (Map<String, Object> map : list)
            {
                // 특정 키가 존재하고, 해당 키의 값이 String인 경우
                if (map.containsKey("통화이름") && map.get("통화이름") instanceof String)
                {
                    String value = (String) map.get("통화이름");

                    if (value.contains(countrys))
                    {
                        result.add(map); // 결과 리스트에 추가
                    }
                }
            }
            return ResponseEntity.ok().body(responseDTO.Response("success","여행 가계부 데이터 삽입을 위한 환율 전송", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
}

