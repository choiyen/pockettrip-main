package project.backend.Repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import project.backend.Entity.ExpenditureEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Repository
public interface ExpendituresRepository extends ReactiveMongoRepository<ExpenditureEntity, String>
{
    Flux<ExpenditureEntity> findAllByTravelCode(String travelCode);

    Mono<Boolean> existsByExpenditureId(String expenditureId);
    Mono<Boolean> existsByTravelCode(String travelCode);

    Mono<ExpenditureEntity> findByExpenditureId(String expenditureId);


//    boolean deleteByExpenditureId(String expenditureId);

    Mono<Void> deleteByExpenditureId(String expenditureId);
}
