package project.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import project.backend.Security.TokenProvider;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer
{
    @Value("${released.URL}")
    String url;

    @Autowired
    private TokenProvider tokenProvider;


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");  // 메시지 브로커를 "/topic"으로 설정
        registry.setApplicationDestinationPrefixes("/app");  // 클라이언트에서 보내는 메시지의 엔드포인트
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://13.124.212.22","http://13.124.212.22:81", "http://localhost:3000", "http://localhost:9000")  // 특정 출처만 허용
                .withSockJS(); // SockJS 사용 설정
    }
}