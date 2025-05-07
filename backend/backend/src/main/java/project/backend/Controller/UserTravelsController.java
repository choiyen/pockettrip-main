package project.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.backend.DTO.ResponseDTO;
import project.backend.DTO.TravelPlanDTO;
import project.backend.DTO.UserDTO;
import project.backend.Entity.TravelPlanEntity;
import project.backend.Service.UserTravelsService;

import java.util.ArrayList;

@RestController
@RequestMapping("/user")
public class UserTravelsController {

    @Autowired
    private UserTravelsService userTravelsService;

    private ResponseDTO responseDTO = new ResponseDTO<>();

    @GetMapping("/travelList")
    public ResponseEntity<?> getTravelList(@AuthenticationPrincipal String email){
        try {
            ArrayList<TravelPlanEntity> travelList = userTravelsService.findTravelList(email);
            return ResponseEntity.ok().body(responseDTO.Response("success", "전송 완료", travelList));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
