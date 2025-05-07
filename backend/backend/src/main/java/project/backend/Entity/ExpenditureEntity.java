package project.backend.Entity;


import com.mongodb.lang.NonNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "expenditures")
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
public class ExpenditureEntity
{
    @Id
    private String id;
    @NonNull
    private String expenditureId;
    @NonNull
    private String travelCode;
    @NonNull
    private String purpose;
    @NonNull
    private String method;
    private boolean isPublic;
    @NonNull
    private String payer;
    @NonNull
    private LocalDate date;
    @NonNull
    private int  KRW;
    private long amount;
    private String currency;
    @NonNull
    private String description;

    public static ExpenditureEntity of(String purpose, String travelCode, String method, boolean isPublic, String payer, LocalDate date, int KRW, int amount, String currency, String description) {
        return ExpenditureEntity.builder()
                .purpose(purpose)
                .travelCode(travelCode)
                .method(method)
                .isPublic(isPublic)
                .payer(payer)
                .date(date)
                .KRW(KRW)
                .amount(amount)
                .currency(currency)
                .description(description)
                .build();
    }
}
//기준 통화는 한국돈, 외국돈은 의무 입력 아님.
// 단. 외국돈 만 입력할 경우, 한국돈을 계산해서 집어넣는 기능 있어야 함.
//해당 여행에서 본인이나 단체에서 쓴 돈