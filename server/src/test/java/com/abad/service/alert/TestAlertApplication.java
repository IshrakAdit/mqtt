package com.abad.service.alert;

import org.springframework.boot.SpringApplication;

public class TestAlertApplication {

	public static void main(String[] args) {
		SpringApplication.from(AlertApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
