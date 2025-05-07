package project.backend.DTO;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FindIDDTO
{
    String name;
    String phone;
}
