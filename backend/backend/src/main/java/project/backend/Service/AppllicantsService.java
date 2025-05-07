package project.backend.Service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.backend.Entity.ApplicantsEntity;
import project.backend.Repository.ApplicantsRepository;
import reactor.core.publisher.Mono;

import java.util.*;

@Slf4j
@Service
public class AppllicantsService
{

    @Autowired
    private ApplicantsRepository applicantsRepository;

    public Mono<ApplicantsEntity> AppllicantsInsert(String TravelCode, String userid)
    {
        if(applicantsRepository.existsByTravelCode(TravelCode).block() == true)
        {
            ApplicantsEntity applicantsEntity = applicantsRepository.findByTravelCode(TravelCode).block();
            if(applicantsEntity.getUserList().contains(userid) == true)
            {
                log.warn("Applicants with userid {} already exists", userid);
                throw new IllegalArgumentException("이미 데이터 베이스에 있는 데이터 입니다.");
            }
            else
            {
                Set<String> uplist = new HashSet<>();
                uplist.addAll(applicantsEntity.getUserList());
                uplist.add(userid);
                ApplicantsEntity applicants2 = ApplicantsEntity.builder()
                        .travelCode(TravelCode)
                        .id(applicantsEntity.getId())
                        .userList(uplist)
                        .build();
                ApplicantsEntity applicantsEntityMono = applicantsRepository.save(applicants2).block();
                return Mono.just(applicantsEntityMono);
            }
        }
        else
        {
            System.out.println("in");
            ApplicantsEntity applicants = ApplicantsEntity.builder()
                    .travelCode(TravelCode)
                    .userList(Collections.singleton(userid))
                    .build();
            // 새로운 id를 생성하여 중복 오류 방지
            Mono<ApplicantsEntity> applicantsEntityMono2 = applicantsRepository.save(applicants);
            ApplicantsEntity applicantsEntityMono = applicantsRepository.findByTravelCode(TravelCode).block();
            return Mono.just(applicantsEntityMono);
        }
    }

    //참여자 목록에 데이터가 있을 때 데이터 삭제, 데이터 삭제 실행 후 빈배열일 경우, 해당 Document 제거
    public Mono<ApplicantsEntity> AppllicantsDelete(String TravelCode, String userid)
    {
       ApplicantsEntity applicantsEntity = applicantsRepository.findByTravelCode(TravelCode).block();
        if(applicantsEntity.getUserList().contains(userid) == false)
        {
            log.warn("Applicants with userid {} Not exists", userid);
            throw new IllegalArgumentException("데이터 베이스에 없는 신청자 정보 입니다.");
        }
        else
        {
            Set allList = new HashSet<>();
            allList.addAll(applicantsEntity.getUserList());
            allList.remove(userid);
            ApplicantsEntity applicants = ApplicantsEntity.builder()
                    .userList(allList)
                    .travelCode(applicantsEntity.getTravelCode())
                    .id(applicantsEntity.getId())
                    .build();

            return applicantsRepository.save(applicants);
        }
    }


    public Mono<Boolean> ApplicantExistance(String TravelCode)
    {
        return applicantsRepository.existsByTravelCode(TravelCode);
    }

    public Void TravelPlanAllDelete(String TravelCode)
    {
       return applicantsRepository.deleteByTravelCode(TravelCode).block();
    }

    public Mono<ApplicantsEntity> applicantsSelect(String TravelCode)
    {
       return applicantsRepository.findByTravelCode(TravelCode);
    }

}
