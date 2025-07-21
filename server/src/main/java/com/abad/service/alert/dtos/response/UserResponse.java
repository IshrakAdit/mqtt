package com.abad.service.alert.dtos.response;

import lombok.Builder;

@Builder
public record UserResponse (

        Long id,
        String name

){}
