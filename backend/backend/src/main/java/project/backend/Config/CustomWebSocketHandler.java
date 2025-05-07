package project.backend.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CustomWebSocketHandler implements WebSocketHandler {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;  // 메시지 전송을 위한 템플릿

    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 연결 수립 시 처리할 로직 (예: 사용자 정보를 attributes에 저장)
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null)
        {
            sessions.put(session.getId(), session); // ConcurrentHashMap에 세션 정보 저장
            System.out.println("WebSocket 연결 수립됨: " + session.getId() + " - User: " + userId);
        }

    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // WebSocket 연결이 종료될 때 호출됩니다.
        String userId = (String) session.getAttributes().get("userId");  // 세션에서 userId 추출
        if (userId != null) {
            sessions.remove(session.getId());
            // 연결 종료 시 해당 사용자에게 메시지를 전송합니다.
            try {
                // 연결 종료 메시지를 해당 사용자에게 전송
                messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", "Your connection has been lost.");
                System.out.println("Connection closed for user: " + userId);
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
    }
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception
    {
        // WebSocket 통신 에러 처리 로직
        System.out.println("Error on WebSocket transport: " + exception.getMessage());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;  // 부분 메시지 처리 여부 설정
    }
}
