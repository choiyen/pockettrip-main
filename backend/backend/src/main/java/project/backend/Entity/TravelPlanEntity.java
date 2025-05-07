package project.backend.Entity;

import com.mongodb.lang.NonNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


@Document(collection = "TravelPlan")
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelPlanEntity
{
    @Id
    private String id;

    @NonNull
    @Indexed(unique = true)
    private String travelCode;
    @NonNull
    private String location;
    @NonNull
    private String title;
    private String img;
    @NonNull
    private LocalDate startDate;
    private LocalDate endDate;
    private int expense;
    @NonNull
    private String founder;//총무
    private Set<String> participants;//여행에서 데이터를 수정, 삭제할 권한

    @NonNull
    private boolean isCalculate;
    private Number currentCurrency;
}
//끝날짜는 그냥 홀연히 통장 잔고만 정해놓고 떠나는 경우도 있을 것 같아서 Null 가능
// 정해진 예산을 정해놓지 않고 갈 수도 있으니까 Null.
//단. participants의 경우엔 DTO에서 직접적으로 보여져야 하는 부분.