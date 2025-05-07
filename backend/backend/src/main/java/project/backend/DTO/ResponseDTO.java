package project.backend.DTO;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class ResponseDTO<T>
{
    private String resultType; //어떤 유형의 데이터인지 확인
    private String message; // error message - fail
    private List<T> data; // response data - success


    public ResponseDTO<T> Response(String result, String message, List<T> list)
    {
        ResponseDTO<T> responseDTO = ResponseDTO.<T>builder()
                .resultType(result)
                .message(message)
                .data(list) // List<T> 그대로 사용
                .build();

        return responseDTO;
    }
    public ResponseDTO<T> Response(String result, String message)
    {
        ResponseDTO<T> responseDTO = ResponseDTO.<T>builder()
                .resultType(result)
                .message(message)
                .build();
        return responseDTO;
    }
}

// HTTP Response 할 때 사용할 DTO
// 서버에서 클라이언트로 응답할 때 사용할 데이터 구조 정의
