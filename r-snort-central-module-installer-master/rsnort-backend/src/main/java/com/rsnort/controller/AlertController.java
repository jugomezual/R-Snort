package com.rsnort.controller;

import com.rsnort.model.Alert;
import com.rsnort.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @GetMapping("/latest")
    public List<Alert> getLatestAlerts(@RequestParam(defaultValue = "10") int limit) {
        return alertService.getLatestAlerts(limit);
    }
}
