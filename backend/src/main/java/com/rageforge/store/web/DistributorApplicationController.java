package com.rageforge.store.web;

import com.rageforge.store.dto.Dtos.DistributorApplicationRequest;
import com.rageforge.store.dto.Dtos.DistributorApplicationResponse;
import com.rageforge.store.service.DistributorApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/distributor-applications")
public class DistributorApplicationController {
    private final DistributorApplicationService applications;

    public DistributorApplicationController(DistributorApplicationService applications) { this.applications = applications; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DistributorApplicationResponse submit(@Valid @RequestBody DistributorApplicationRequest request) {
        return applications.submit(request);
    }
}
