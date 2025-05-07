package project.backend.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CountryDTO //환율에 따른 값 계산을 위한 DTO
{
    private String country;
    private int amount;
}
