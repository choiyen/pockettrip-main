package project.backend.Repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import project.backend.Entity.TravelPlanEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TravelPlanRepository extends ReactiveMongoRepository<TravelPlanEntity, String>
{
    // 주어진 이메일을 가진 사용자가 존재하는지 여부 확인
    Mono<Boolean> existsByTravelCode(String travelCode);

    // 주어진 travelCode로 여행정보를 찾아 반환

    Mono<TravelPlanEntity> findByTravelCode(String travelCode);

    Flux<TravelPlanEntity> findByFounder(String Founder, Sort startDate);


    Flux<TravelPlanEntity> findByParticipantsContaining(String Participant, Sort startDate);



    Mono<Void> deleteByTravelCode(String travelCode);



    TravelPlanEntity findById(Long id);
}
