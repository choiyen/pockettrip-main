package project.backend.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Builder
@Getter
@Setter
public class UserTravelsDTO {

    private String email;
    private ArrayList<String> travelList;
}
