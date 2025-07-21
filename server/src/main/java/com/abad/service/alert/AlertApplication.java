package com.abad.service.alert;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AlertApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(AlertApplication.class, args);
	}

	@Override
	public void run(String... args) {
		System.out.println("CareSync Data Service");
	}

}
