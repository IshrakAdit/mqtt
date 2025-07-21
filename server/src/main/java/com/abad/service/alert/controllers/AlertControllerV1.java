package com.abad.service.alert.controllers;

import com.abad.service.alert.dtos.request.AlertCreateRequest;
import com.abad.service.alert.dtos.response.AlertResponse;
import com.abad.service.alert.services.abstractions.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notify/v1")
@RequiredArgsConstructor
public class AlertControllerV1 {

    private final AlertService alertService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("MQTT Alert service is running successfully");
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<AlertResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AlertResponse>> getAll() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @PostMapping("/create")
    public ResponseEntity<AlertResponse> create(@RequestBody AlertCreateRequest request) {
        AlertResponse response = alertService.createAlert(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }

}

