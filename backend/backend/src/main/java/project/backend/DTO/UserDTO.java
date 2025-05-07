package project.backend.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDTO
{

    private String email;
    private String password;
    private String name;
    private String profile;
    private String phone;
    private String token;
}
