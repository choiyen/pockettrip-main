package project.backend.Service;

import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.backend.DTO.FindIDDTO;
import project.backend.DTO.FindPWDTO;
import project.backend.Entity.UserEntity;
import project.backend.Repository.UserRepository;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Random;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Value("${encrypt.key}")
    private String key;


    @Autowired
    private MongoTemplate mongoTemplate;
    // 회원가입
    public UserEntity createUser(UserEntity userEntity)
    {
        if(userEntity == null || userEntity.getEmail() == null) {
            throw new RuntimeException("Invalid arguments");
        }

        String userid = userEntity.getEmail();

        if(userRepository.existsByEmail(userid))
        {
            log.warn("User with id {} already exists", userid);
            throw new RuntimeException("User with id " + userid + " already exists");
        }

        return userRepository.save(userEntity);
    }


    // 유저 정보 불러오기
    public UserEntity getUserInfo(String email) {
        UserEntity originalUser = userRepository.findByEmail(email);
        if(originalUser == null) {
            log.warn("User with email {} does not exist", email);
        }
        return originalUser;
    }

    // 로그인
    public UserEntity getByCredentials(String email, String password, PasswordEncoder passwordEncoder) {
        UserEntity originalUser = userRepository.findByEmail(email);
        if(originalUser != null && passwordEncoder.matches(password, originalUser.getPassword())) {
            return originalUser;
        }
        return null;
    }

    //userID가 DB에 있는지 여부 확인
    public Boolean getUserID(String userId)
    {
        Boolean bool = userRepository.existsByEmail(userId);
        return bool;
    }
    // 수정하기
    public UserEntity selectUser(String email)
    {
        return userRepository.findByEmail(email);
    }


    public UserEntity updateUser(String email, UserEntity userEntity) {

        UserEntity originalUser = userRepository.findByEmail(email);
        if(originalUser == null) {
            log.warn("User with email {} does not exist", email);
        }
        UserEntity userEntity1 = UserEntity.builder()
                .id(originalUser.getId())
                .phone(userEntity.getPhone())
                .password(originalUser.getPassword())
                .profile(userEntity.getProfile())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .build();

        UserEntity updatedUser = userRepository.save(userEntity1);

        return updatedUser;
    }

    public String getprofileByEmail(String email) {

        // Aggregation pipeline 정의
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("email").is(email)),  // 이메일 필터링
                Aggregation.project("profile")  // profile만 반환
        );

        // MongoTemplate을 사용하여 쿼리 실행
        AggregationResults<UserEntity> result = mongoTemplate.aggregate(aggregation, UserEntity.class, UserEntity.class);

        // 결과에서 profile 반환
        if (result.getMappedResults().isEmpty())
        {
            return null;  // 결과가 없으면 null 반환
        }

        return result.getMappedResults().get(0).getProfile();  // 첫 번째 사용자 profile 반환
    }

    public String getUserEmailByNameAndPhone(FindIDDTO findIDDTO) throws Exception {
        // findIDDTO가 email과 status를 포함하는 객체라면
        String name = findIDDTO.getName();  // findIDDTO에서 email 추출
        String phone = findIDDTO.getPhone();  // findIDDTO에서 status 추출

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(
                        Criteria.where("name").is(name)  // email 조건
                                .and("phone").is(phone)
                        // status 조건
                ),
                Aggregation.project("email")
                        .andExclude("_id")// profile만 반환
        );

        AggregationResults<String> results = mongoTemplate.aggregate(aggregation, UserEntity.class, String.class);

        // 결과에서 profile 반환
        if (results.getMappedResults().isEmpty())
        {
            throw new Exception("이름이나 전화번호가 틀렸습니다.");
            // 결과가 없으면 null 반환
        }

        return  results.getMappedResults().get(0);

    }
    public String changePassword(FindPWDTO findPWDTO, PasswordEncoder passwordEncoder ) throws Exception {
        String email = findPWDTO.getEmail();
        String phone = findPWDTO.getPhone();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(
                        Criteria.where("email").is(email)  // email 조건
                                .and("phone").is(phone)
                        // status 조건
                )
        );
        AggregationResults<UserEntity> results = mongoTemplate.aggregate(aggregation, UserEntity.class, UserEntity.class);

        // 결과에서 profile 반환
        if (results.getMappedResults().isEmpty())
        {
            return "Email is not find";  // 결과가 없으면 null 반환
        }
        else
        {
            int leftLimit = 48; // numeral '0'
            int rightLimit = 122; // letter 'z'
            int targetStringLength = 10;
            Random random = new Random();

            String generatedString = random.ints(leftLimit,rightLimit + 1)
                    .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                    .limit(targetStringLength)
                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                    .toString();

            UserEntity userEntity = results.getMappedResults().get(0);
            UserEntity userEntity1 = UserEntity.builder()
                    .email(userEntity.getEmail())
                    .id(userEntity.getId())
                    .name(userEntity.getName())
                    .profile(userEntity.getProfile())
                    .password(passwordEncoder.encode(generatedString))
                    .phone(userEntity.getPhone())
                    .build();
            userRepository.save(userEntity1);

            return generatedString;

        }

    }

    //암호화 코드 작성
    private static String encrypt(String data, String key) throws Exception
    {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedData = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedData);
    }


    public void deteleUserID(String userId)
    {
        userRepository.deleteByEmail(userId);
    }

}
