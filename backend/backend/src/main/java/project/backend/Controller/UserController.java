package project.backend.Controller;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.backend.DTO.*;
import project.backend.Entity.UserEntity;
import project.backend.Entity.UserTravelsEntity;
import project.backend.Security.TokenProvider;
import project.backend.Service.S3ImageService;
import project.backend.Service.UserService;
import project.backend.Service.UserTravelsService;

import javax.naming.AuthenticationException;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, String> codeStorage = new HashMap<>(); // 전화번호와 인증 코드 저장
    private final Map<String, Long> expiryStorage = new HashMap<>(); // 코드 만료 시간 저장

    @Autowired
    private S3ImageService s3ImageService;

    @Autowired
    private TokenProvider tokenProvider;

    private ResponseDTO responseDTO = new ResponseDTO<>();
    @Autowired
    private UserTravelsService userTravelsService;



    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> registeredUser(@RequestBody UserDTO userDTO){
        try
        {
            Boolean userBool = userService.getUserID(userDTO.getEmail());

            if(userBool == true)
            {
                throw new RuntimeException("아이디 중복!! 회원가입을 다시 시도해주세요.");
            }
            else
            {
                UserEntity user = UserEntity.builder()
                        .name(userDTO.getName())
                        .email(userDTO.getEmail())
                        .password(passwordEncoder.encode(userDTO.getPassword()))
                        .profile(userDTO.getProfile())
                        .phone(userDTO.getPhone())
                        .build();

                UserEntity registerUser = userService.createUser(user);
                if(registerUser != null)
                {
                    UserTravelsEntity userTravels = UserTravelsEntity.builder()
                            .email(userDTO.getEmail())
                            .travelList(new ArrayList<String>())
                            .build();
                    UserTravelsEntity registerUserTravels = userTravelsService.createUserTravels(userTravels);

                    if(registerUserTravels != null)
                    {
                        UserTravelsDTO responsedUserTravelsDTO = UserTravelsDTO.builder()
                                .email(registerUserTravels.getEmail())
                                .travelList(registerUserTravels.getTravelList())
                                .build();

                        List<Object> list = new ArrayList<>();
                        list.add(userDTO);
                        list.add(responsedUserTravelsDTO);
                        return ResponseEntity.ok().body(responseDTO.Response("success", "우리 앱을 이용해주셔서 감사합니다. 여러분의 기입을 환영합니다.", list));

                    }
                    else
                    {
                        userService.deteleUserID(registerUser.getEmail());// user 여행 목록이 저장되지 않았으므로 user 목록 삭제
                        throw new Exception("해당 user의 여행 목록 생성 실패");
                    }
                }
                else
                {
                    throw new Exception("user 정보가 저장되지 않습니다.");
                }

            }



        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }


    @GetMapping("/userprofile")
    public ResponseEntity<?> UserProfile(@AuthenticationPrincipal String email) {
        try
        {
            if (email == null)
            {
                return ResponseEntity.badRequest().body(responseDTO.Response("error", "인증된 이메일이 없습니다."));
            }
            UserEntity user = userService.getUserInfo(email);
            if (user == null)
            {
                return ResponseEntity.badRequest().body(responseDTO.Response("error", "해당 이메일의 유저를 찾을 수 없습니다."));
            }

            List<Object> list = new ArrayList<>();
            list.add(user);
            return ResponseEntity.ok().body(responseDTO.Response("success", "오늘도 저희 서비스에 방문해주셔서 감사드려요!!!", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO){
        try{
            UserEntity user = userService.getByCredentials(userDTO.getEmail(), userDTO.getPassword(), passwordEncoder);
            if(user != null)
            {
                String token = tokenProvider.createToken(user);
                UserDTO responseUserDTO = UserDTO.builder()
                        .name(user.getName())
                        .email(user.getEmail())
                        .password(user.getPassword())
                        .phone(user.getPhone())
                        .token(token)
                        .build();
                List<Object> list = new ArrayList<>();
                list.add(responseUserDTO);
                return ResponseEntity.ok().body(responseDTO.Response("success", "오늘도 저희 서비스에 방문해주셔서 감사드려요!!!", list));
            }
            else
            {
               throw new AuthenticationException("회원정보가 존재하지 않습니다. 비밀번호나 아이디를 다시 입력해주세요.");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    // 수정
    @PutMapping("/edit")
    @Cacheable(value = "email", key = "#email")
    public ResponseEntity<?> editUser(@RequestPart(value = "image", required = false) MultipartFile image,  @AuthenticationPrincipal String email, @ModelAttribute UserDTO userDTO){
        try
        {
            List<Object> list = new ArrayList<>();
            System.out.println("받은 프로필 파일: " + userDTO.getProfile()); // database-storage.png 제대로 들어오는거 확인

            UserEntity users = userService.selectUser(email);
            if(image != null && image.isEmpty() != true)
            {
                // 이미지가 있는 경우에만 처리
                if(users.getProfile().equals(userDTO.getProfile()) == false && users.getProfile().equals("/ProfileImage.png") != true)
                {
                    s3ImageService.deleteImageFromS3(users.getProfile());
                }
                String ImageUrl = s3ImageService.upload(image);
                UserEntity user = UserEntity.builder()
                        .name(userDTO.getName())
                        .email(userDTO.getEmail())
                        .password(passwordEncoder.encode(userDTO.getPassword()))
                        .phone(userDTO.getPhone())
                        .profile(ImageUrl)
                        .build();

                UserEntity editUser = userService.updateUser(email, user);

                UserDTO responsedUserDTO = UserDTO.builder()
                        .name(editUser.getName())
                        .email(editUser.getEmail())
                        .password(editUser.getPassword())
                        .phone(editUser.getPhone())
                        .profile(editUser.getProfile())
                        .build();

                list.add(responsedUserDTO);


            }
            else
            {
                UserEntity user = UserEntity.builder()
                        .name(userDTO.getName())
                        .email(userDTO.getEmail())
                        .password(passwordEncoder.encode(userDTO.getPassword()))
                        .phone(userDTO.getPhone())
                        .profile(userDTO.getProfile())
                        .build();

                UserEntity editUser = userService.updateUser(email, user);

                UserDTO responsedUserDTO = UserDTO.builder()
                        .name(editUser.getName())
                        .email(editUser.getEmail())
                        .password(editUser.getPassword())
                        .phone(editUser.getPhone())
                        .profile(editUser.getProfile())
                        .build();
                list.add(responsedUserDTO);
            }


            return ResponseEntity.ok().body(responseDTO.Response("info", "회원정보 수정 완료!", list));

        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
    //로그아웃
    @DeleteMapping("/signout")
    @CacheEvict(value = "email")
    public ResponseEntity<?> signout(HttpServletResponse response)
    {
        // refreshToken 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null); // 빈 쿠키를 새로 생성
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 쿠키의 유효 시간을 0으로 설정, 브라우저가 즉시 이 쿠키를 삭제
        response.addCookie(refreshTokenCookie); // 수정된 쿠키(refreshTokenCookie)를 응답에 추가, 클라이언트에게 쿠키를 전송

        return ResponseEntity.ok().body(responseDTO.Response("success", "로그아웃 완료"));
    } // 프론트엔드 연결 후 기능 정상 동작 여부 확인해야 함.


    @PostMapping("/profile")
    public ResponseEntity<?> signprofile(@RequestBody List<String> emails)
    {
        try
        {
            List<String> emailprofile = new ArrayList<>();
            for(String email : emails)
            {
                emailprofile.add(userService.getprofileByEmail(email));//이메일 별로 처리 로직 변경

            }
            return ResponseEntity.ok().body(responseDTO.Response("success", "회원정보 불러오기 완료!", emailprofile));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    @DeleteMapping("/signnot")
    public ResponseEntity<?> signProfile(@AuthenticationPrincipal String email)
    {
        try
        {
            UserEntity users = userService.getUserInfo(email);
            userService.deteleUserID(email);
            if(users.getProfile().equals("/ProfileImage.png") != true)
            {
                s3ImageService.deleteImageFromS3(users.getProfile());
            }
            return ResponseEntity.ok().body(responseDTO.Response("success", "회원정보 삭제"));
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }


    @PostMapping("/findID")
    public ResponseEntity<?> findEmail(@RequestBody FindIDDTO findIDDTO)
    {
        try
        {
            String email = userService.getUserEmailByNameAndPhone(findIDDTO);
            return ResponseEntity.ok().body(responseDTO.Response("success", "이메일 찾기 완료!", Collections.singletonList(email)));
        }
        catch (Exception e)
        {
            return  ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }

    @PostMapping("/findPW")
    public ResponseEntity<?> changePassword(@RequestBody FindPWDTO findPWDTO)
    {
        try
        {
            String PW = userService.changePassword(findPWDTO, passwordEncoder);
            if(PW.equals("Email is not find"))
            {
                throw new RuntimeException("이메일이나 전화번호를 다시 확인해주세요. 정보를 찾을 수 없습니다.");
            }
            else
            {
                return ResponseEntity.ok().body(responseDTO.Response("success", "임시 비밀번호 발급 완료!", Collections.singletonList(PW)));
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body(responseDTO.Response("error", e.getMessage()));
        }
    }
}