package com.abad.service.alert.dtos.request;

import lombok.Builder;

@Builder
public record UserRequest (

        Long id,
        String name

){}
