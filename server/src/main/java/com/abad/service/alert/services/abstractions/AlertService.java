package com.abad.service.alert.services.abstractions;

import com.abad.service.alert.dtos.request.AlertCreateRequest;
import com.abad.service.alert.dtos.response.AlertResponse;

import java.util.List;

public interface AlertService {

    AlertResponse createAlert(AlertCreateRequest request);
    void deleteAlert(Long id);
    AlertResponse getAlertById(Long id);
    List<AlertResponse> getAllAlerts();

}

