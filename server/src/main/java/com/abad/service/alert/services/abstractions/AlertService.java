package com.abad.service.alert.services.abstractions;

import com.abad.service.alert.dtos.request.AlertCreateRequest;
import com.abad.service.alert.dtos.response.AlertResponse;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.util.List;

public interface AlertService {

    AlertResponse createAlert(AlertCreateRequest request);
    void deleteAlert(Long id);
    AlertResponse getAlertById(Long id);
    List<AlertResponse> getAllAlerts();
    void sendNotification(String topic, String message) throws MqttException;

}

