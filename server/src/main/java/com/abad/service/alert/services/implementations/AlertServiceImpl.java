package com.abad.service.alert.services.implementations;

import com.abad.service.alert.dtos.request.AlertCreateRequest;
import com.abad.service.alert.dtos.response.AlertResponse;
import com.abad.service.alert.entities.Alert;
import com.abad.service.alert.entities.User;
import com.abad.service.alert.repositories.AlertRepository;
import com.abad.service.alert.repositories.UserRepository;
import com.abad.service.alert.services.abstractions.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

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
