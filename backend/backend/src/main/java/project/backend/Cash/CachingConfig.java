package project.backend.Cash;

import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizer;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;

@EnableCaching
@Configuration
public class CachingConfig
{
    @Bean
    public CacheManager cacheManager()
    {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setAllowNullValues(false);
        cacheManager.setCacheNames(List.of("email"));//회원정보를 불러오기 위한 cash
        cacheManager.setCacheNames(List.of("travelCode"));
        cacheManager.setCacheNames(List.of("Expenditure"));
        return cacheManager;
    }
}
