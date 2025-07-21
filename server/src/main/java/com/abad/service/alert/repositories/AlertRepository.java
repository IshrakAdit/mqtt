package com.abad.service.alert.repositories;

import com.abad.service.alert.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}

