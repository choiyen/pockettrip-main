package project.backend.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import project.backend.Entity.TravelPlanEntity;
import project.backend.Entity.UserEntity;
import project.backend.Repository.TravelPlanRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
public class TravelPlanService
{
    @Value("${encrypt.key}")
    private String key;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private TravelPlanRepository travelPlanRepository;

    public Mono<TravelPlanEntity> TravelPlanInsert(TravelPlanEntity travelPlan)
    {
       return travelPlanRepository.save(travelPlan);
    }

    public Mono<TravelPlanEntity> TravelPlanUpdate(TravelPlanEntity travelPlan)
    {
        TravelPlanEntity originalTravelPlan = travelPlanRepository.findByTravelCode(travelPlan.getTravelCode()).block();


        TravelPlanEntity originTravelPlan = TravelPlanEntity.builder()
                .id(originalTravelPlan.getId())
                .travelCode(travelPlan.getTravelCode())
                .isCalculate(travelPlan.isCalculate())
                .founder(travelPlan.getFounder())
                .startDate(travelPlan.getStartDate())
                .title(travelPlan.getTitle())
                .endDate(travelPlan.getEndDate())
                .participants(travelPlan.getParticipants())
                .currentCurrency(travelPlan.getCurrentCurrency())
                .expense(travelPlan.getExpense())
                .img(travelPlan.getImg())
                .location(travelPlan.getLocation())
                .build();

        return travelPlanRepository.save(originTravelPlan);
    }

    public void TravelPlanDelete(String TravelCode)
    {
       travelPlanRepository.deleteByTravelCode(TravelCode).block();
    }

    public Mono<TravelPlanEntity> TravelPlanSelect(String travelCode)
    {
        Mono<TravelPlanEntity> travelPlanEntityMono = travelPlanRepository.findByTravelCode(travelCode);
        if(travelPlanEntityMono.block() == null)
        {
            log.warn("travelPlan with Travel Code {} is not find", travelCode);
            throw new RuntimeException("해당 여행 코드를 가진 여행 기록을 찾을 수 없습니다.");
        }
        else
        {
            return travelPlanRepository.findByTravelCode(travelCode);

        }
    }

    public boolean SelectTravelCode(String travelCode) throws Exception
    {
        System.out.println(encrypt(travelCode,key));
        Boolean bool = travelPlanRepository.existsByTravelCode(encrypt(travelCode,key)).block();
        System.out.println(bool);
        return  bool;
    }

    //암호화 코드 작성
    public static String encrypt(String data, String key) throws Exception
    {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedData = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    public Flux<TravelPlanEntity> travelPlanEntityAll(String userId)
    {
        List<TravelPlanEntity> list = new ArrayList<>();
        Flux<TravelPlanEntity> travelPlanEntityFlux = travelPlanRepository.findByFounder(userId,Sort.by(Sort.Order.asc("startDate")));
        Flux<TravelPlanEntity> travelPlanEntityFlux2 = travelPlanRepository.findByParticipantsContaining(userId,Sort.by(Sort.Order.asc("startDate")));
        Flux<TravelPlanEntity> combinedFlux = Flux.concat(
                travelPlanEntityFlux,
                travelPlanEntityFlux2
        );
        return combinedFlux;
    }
    public long TravelPlanCount()
    {
        long totalCount = mongoTemplate.count(new Query(), TravelPlanEntity.class);
        return totalCount;
    }
    public List<Map> getVisitCountByRegion() {
        // 집계 파이프라인 정의
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("location").ne(null)), // region이 null이 아닌 문서만 필터링
                Aggregation.group("location") // 지역별로 그룹화
                        .count().as("visitCount"), // 각 지역의 방문 횟수 카운트
                Aggregation.sort(Sort.by(Sort.Order.desc("visitCount"))) // 방문 횟수 기준 내림차순 정렬
        );

        // 집계 실행 및 결과를 List<Map<String, Object>>로 반환
        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "TravelPlan", Map.class);

        // 결과 반환
        return results.getMappedResults();
    }
}
