package com.rageforge.store.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "distributor_applications")
public class DistributorApplication {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String businessName;
    @Column(nullable = false) private String contactName;
    @Column(nullable = false) private String email;
    @Column(nullable = false) private String phone;
    @Column(nullable = false) private String businessType;
    @Column(nullable = false) private String city;
    @Column(nullable = false) private String state;
    @Column(nullable = false) private String pincode;
    @Column(length = 300) private String productInterest;
    @Column(length = 2000) private String message;
    @Column(nullable = false) private boolean consent;
    @Column(nullable = false) private String status = "RECEIVED";
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String value) { businessName = value; }
    public String getContactName() { return contactName; }
    public void setContactName(String value) { contactName = value; }
    public String getEmail() { return email; }
    public void setEmail(String value) { email = value; }
    public String getPhone() { return phone; }
    public void setPhone(String value) { phone = value; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String value) { businessType = value; }
    public String getCity() { return city; }
    public void setCity(String value) { city = value; }
    public String getState() { return state; }
    public void setState(String value) { state = value; }
    public String getPincode() { return pincode; }
    public void setPincode(String value) { pincode = value; }
    public String getProductInterest() { return productInterest; }
    public void setProductInterest(String value) { productInterest = value; }
    public String getMessage() { return message; }
    public void setMessage(String value) { message = value; }
    public boolean isConsent() { return consent; }
    public void setConsent(boolean value) { consent = value; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
