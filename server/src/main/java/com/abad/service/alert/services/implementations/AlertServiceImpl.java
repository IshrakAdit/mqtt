package com.abad.service.alert.services.implementations;

import com.abad.service.alert.dtos.request.AlertCreateRequest;
import com.abad.service.alert.dtos.response.AlertResponse;
import com.abad.service.alert.entities.Alert;
import com.abad.service.alert.entities.User;
import com.abad.service.alert.repositories.AlertRepository;
import com.abad.service.alert.repositories.UserRepository;
import com.abad.service.alert.services.abstractions.AlertService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

import org.eclipse.paho.client.mqttv3.MqttClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    private final MqttClient mqttClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AlertResponse createAlert(AlertCreateRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = new Alert();
        alert.setDescription(request.description());
        alert.setType(request.type());
        alert.setUser(user);

        Alert saved = alertRepository.save(alert);
        return mapToResponse(saved);
    }

    @Override
    public void deleteAlert(Long id) {
        if (!alertRepository.existsById(id)) {
            throw new RuntimeException("Alert not found");
        }
        alertRepository.deleteById(id);
    }

    @Override
    public AlertResponse getAlertById(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        return mapToResponse(alert);
    }

    @Override
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void sendNotification(String topic, String message) throws MqttException {
        if (!mqttClient.isConnected()) {
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            mqttClient.connect(options);
            System.out.println("Connected to MQTT broker.");
        }

        String receiver = "alerts/" + topic;
        MqttMessage mqttMessage = new MqttMessage(message.getBytes());
        mqttMessage.setQos(1); // QoS level 1: at least once
        mqttClient.publish(receiver, mqttMessage);
        System.out.println("📡 Published message to topic: " + topic);
    }

    @Override
    public AlertResponse sendAlert(AlertCreateRequest request) {
        User user = userRepository.findByName(request.userName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = new Alert();
        alert.setDescription(request.description());
        alert.setType(request.type());
        alert.setUser(user);

        Alert saved = alertRepository.save(alert);
        AlertResponse response = mapToResponse(saved);

        String topic = "alerts/" + request.userName();
        try {
            String jsonObject = objectMapper.writeValueAsString(response);
            sendNotification(topic, jsonObject);
        } catch (MqttException e) {
            System.err.println("Failed to send MQTT notification: " + e.getMessage());
        } catch (JsonProcessingException e) {
            System.err.println("JSON processing exception: " + e.getMessage());
        }

        return response;
    }


    private AlertResponse mapToResponse(Alert alert) {
        return new AlertResponse(
                alert.getId(),
                alert.getType(),
                alert.getDescription(),
                alert.getUser().getId(),
                alert.getUser().getName()
        );
    }

}
