package project.backend.Config;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.net.URI;
import java.net.http.HttpClient.Redirect;

@Component
public class StartupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        try
        {
            // HttpClient 객체 생성
            HttpClient client = HttpClient.newHttpClient();

            // GET 요청을 위한 HttpRequest 객체 생성
            String urlString = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=NoYRIAuzpf7UUeZXbpQtOLuDhamPWzi6&searchdate=2025-01-31&data=AP01";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(urlString))  // 제공된 URL로 요청 설정
                    .build();

            // 요청을 보내고 응답을 받음
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // 응답 코드와 응답 본문 출력
            System.out.println("Response Code: " + response.statusCode());
            System.out.println("Response Body: " + response.body());
        } catch(Exception e) {
            e.printStackTrace();
        }

    }
}