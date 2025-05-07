package project.backend.Config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Configuration
public class AppConfig {


    @Bean
    public RestTemplate restTemplate() throws NoSuchAlgorithmException, KeyStoreException {
        RestTemplate restTemplate = new RestTemplate();

        restTemplate.getMessageConverters()
                .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
        // 2. JSON 처리용 MappingJackson2HttpMessageConverter 추가
        ObjectMapper objectMapper = new ObjectMapper();
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(objectMapper);
        // 3. HTTP 메시지 컨버터에 추가
        List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();
        converters.add(jsonConverter);

        return restTemplate;  // 하나의 RestTemplate 인스턴스가 싱글톤으로 관리됨
    }
}
