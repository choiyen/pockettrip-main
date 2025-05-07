package project.backend.Entity;

import com.mongodb.lang.NonNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "users")
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserEntity
{
    @Id
    private String id;
    @NonNull
    private String email;
    private String profile;

    @NonNull
    private String password;
    @NonNull
    private String name;
    private String phone;
}
//email이랑 phone은 아이디랑 비밀번호 찾기 용도, 둘 중 하나는 의무로 받아야 함.