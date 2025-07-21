package com.abad.service.alert.dtos.response;

import com.abad.service.alert.enums.ALERT_TYPE;
import lombok.Builder;

@Builder
public record AlertResponse(
        Long id,
        ALERT_TYPE type,
        String description,
        Long userId,
        String userName
) {
}
