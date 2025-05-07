package project.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Builder
public class ExpendituresDTO {
    private String expenditureId;
    private String travelCode;
    private String purpose;
    private String method;
    private boolean isPublic;
    @JsonProperty("payer")  // JSON에서 "KRW"라는 필드를 이 자바 필드에 매핑
    private String payer;
    private LocalDate date;
    @JsonProperty("KRW")  // JSON에서 "KRW"라는 필드를 이 자바 필드에 매핑
    private int KRW;
    private long  amount;
    private String currency;
    private String description;

    @Override
    public String toString() {
        return "ExpenditureEntity{" +
                "expenditureId=" + expenditureId + // 여기에 해당 클래스의 필드들을 추가
                ", travelCode='" + travelCode +
                ", purpose=" + purpose + ", method =" + method +
                ", isPublic =" + isPublic +
                ", payer =" + payer +
                ", date =" + date +
                ", KRW =" + KRW +
                ", amount =" + amount +
                ", currency =" + currency +
                ", description =" + description +
                '}';
    }
}
