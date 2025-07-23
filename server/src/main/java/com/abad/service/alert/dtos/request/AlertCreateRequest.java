package com.abad.service.alert.dtos.request;

import com.abad.service.alert.enums.ALERT_TYPE;
import lombok.Builder;

@Builder
public record AlertCreateRequest(

        Long userId,
        String userName,
        ALERT_TYPE type,
        String description

) {
}
