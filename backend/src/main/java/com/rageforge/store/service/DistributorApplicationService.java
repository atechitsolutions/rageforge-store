package com.rageforge.store.service;

import com.rageforge.store.dto.Dtos.DistributorApplicationRequest;
import com.rageforge.store.dto.Dtos.DistributorApplicationResponse;
import com.rageforge.store.model.DistributorApplication;
import com.rageforge.store.repo.DistributorApplicationRepository;
import org.springframework.stereotype.Service;

@Service
public class DistributorApplicationService {
    private final DistributorApplicationRepository applications;

    public DistributorApplicationService(DistributorApplicationRepository applications) { this.applications = applications; }

    public DistributorApplicationResponse submit(DistributorApplicationRequest request) {
        DistributorApplication application = new DistributorApplication();
        application.setBusinessName(request.businessName().trim());
        application.setContactName(request.contactName().trim());
        application.setEmail(request.email().trim());
        application.setPhone(request.phone());
        application.setBusinessType(request.businessType().trim());
        application.setCity(request.city().trim());
        application.setState(request.state().trim());
        application.setPincode(request.pincode());
        application.setProductInterest(clean(request.productInterest()));
        application.setMessage(clean(request.message()));
        application.setConsent(request.consent());
        DistributorApplication saved = applications.save(application);
        return new DistributorApplicationResponse("DA-" + String.format("%06d", saved.getId()), saved.getStatus(), saved.getContactName());
    }

    private static String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
