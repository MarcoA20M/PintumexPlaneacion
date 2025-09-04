package com.pintumex.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConfigController {
    
    @Value("${spring.datasource.url:NOT_SET}")
    private String dbUrl;
    
    @Value("${spring.datasource.username:NOT_SET}") 
    private String dbUser;
    
    @GetMapping("/config")
    public String showConfig() {
        return "DB URL: " + dbUrl + "<br>"
             + "DB User: " + dbUser;
    }
}