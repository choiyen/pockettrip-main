package project.backend.DTO;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FindPWDTO
{
    String email;
    String phone;
}
