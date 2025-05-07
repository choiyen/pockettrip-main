package project.backend.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Builder
public class ApplicantsDTO
{
    private String travelcode;
    private Set<String> userList;
}
