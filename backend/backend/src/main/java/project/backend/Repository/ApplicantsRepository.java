package project.backend.Repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import project.backend.Entity.ApplicantsEntity;
import project.backend.Entity.ExpenditureEntity;
import project.backend.Entity.TravelPlanEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ApplicantsRepository extends ReactiveMongoRepository<ApplicantsEntity, String>
{
    Mono<ApplicantsEntity> findByTravelCode(String travelCode);

    // 주어진 여행코드를 가진 여행 신청자 문서가 존재하는지 여부 확인
    Mono<Boolean> existsByTravelCode(String travelCode);

    Mono<Void> deleteByTravelCode(String travelCode);


}
