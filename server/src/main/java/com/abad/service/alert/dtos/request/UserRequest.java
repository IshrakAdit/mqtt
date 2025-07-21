package com.abad.service.alert.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UserRequest (

        @NotBlank(message = "Hospital name cannot be blank")
        @Size(max = 150)
        String name

){}
