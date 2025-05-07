package project.backend.Socket;


import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import project.backend.Security.TokenProvider;

import java.util.Map;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {

    private final TokenProvider tokenProvider;  // JWT 검증 서비스 (TokenProvider)

    // 생성자로 TokenProvider를 주입
    public HttpHandshakeInterceptor(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // 헤더에서 JWT 토큰을 추출
        String authHeader = request.getHeaders().getFirst("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // "Bearer " 이후의 JWT 토큰만 추출
            String token = authHeader.substring(7);

            try {
                // JWT 토큰 검증 및 사용자 정보 추출
                String userId = tokenProvider.validateAndGetUserId(token);

                // WebSocket 연결에 userId를 attributes에 추가
                attributes.put("userId", userId);

                return true; // 인증 성공

            } catch (Exception e) {
                // 토큰이 유효하지 않거나 검증에 실패한 경우 연결을 거부
                return false; // 인증 실패 시 연결을 거부
            }
        }

        // Authorization 헤더가 없거나 Bearer로 시작하지 않는 경우 연결을 거부
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception ex) {
        // 후처리 작업 (예: 로깅 등)
    }
}


