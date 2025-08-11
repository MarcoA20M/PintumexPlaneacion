package com.pintumex.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.pintumex.api.model")  // Indica dónde están tus entidades
@EnableJpaRepositories("com.pintumex.api.repository")  // Indica dónde están tus repositorios
public class PintumexApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(PintumexApiApplication.class, args);
    }
}
