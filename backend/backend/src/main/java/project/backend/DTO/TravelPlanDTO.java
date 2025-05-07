package project.backend.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Builder
public class TravelPlanDTO
{

    private String travelCode;
    private String title;
    private String location;
    private String img;
    private LocalDate startDate;
    private LocalDate endDate;
    private int expense;
    private String founder;
    private Set<String> participants;
    private boolean isCalculate;
    private List<String> profiles;
    private Number currentCurrency = 0;

    @Override
    public String toString() {
        return "ExpenditureEntity{" +
                "travelCode=" + travelCode + // 여기에 해당 클래스의 필드들을 추가
                ", title='" + title +
                ", location=" + location + ", img =" + img +
                ", startDate =" + startDate +
                ", endDate =" + endDate +
                ", expense =" + expense +
                ", founder =" + founder +
                ", participants =" + participants +
                ", isCalculate =" + isCalculate +
                ", profiles =" + profiles +
                ", currentCurrency = " + currentCurrency +
                '}';
    }

}
//소켓으로 알림으로 보냄
