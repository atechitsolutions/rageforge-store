package com.rageforge.store.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/** All request/response shapes in one place. Field names match the React frontend. */
public final class Dtos {
    private Dtos() {}

    public record CategoryDto(String slug, String name, String tagline, int sortOrder) {}
    public record SizeDto(String label, int price, int mrp) {}
    public record ProductDto(Long id, String slug, String name, String category, String tagline, String description,
                             List<SizeDto> sizes, List<String> flavours, boolean bestseller, boolean featured,
                             String accent, String badge, String imageKey, List<String> facts) {}

    public record OrderItemRequest(@NotNull Long productId, @NotBlank String size, @NotBlank String flavour,
                                   @Min(1) @Max(10) int qty) {}

    public record OrderRequest(
            @NotBlank @Size(min = 2, max = 120) String customerName,
            @NotBlank @Email String email,
            @Pattern(regexp = "^[6-9]\\d{9}$", message = "must be a 10-digit Indian mobile number") String phone,
            @NotBlank @Size(min = 6, max = 300) String address,
            @NotBlank @Size(max = 80) String city,
            @Pattern(regexp = "^\\d{6}$", message = "must be a 6-digit pincode") String pincode,
            String coupon,
            @NotEmpty @Valid List<OrderItemRequest> items) {}

    public record OrderLineDto(Long productId, String name, String size, String flavour, int price, int qty) {}
    public record OrderResponse(String id, String status, String customerName, int subtotal, int discount,
                                int shipping, int total, List<OrderLineDto> items) {}

    public record DistributorApplicationRequest(
            @NotBlank @Size(min = 2, max = 160) String businessName,
            @NotBlank @Size(min = 2, max = 120) String contactName,
            @NotBlank @Email @Size(max = 160) String email,
            @Pattern(regexp = "^[6-9]\\d{9}$", message = "must be a 10-digit Indian mobile number") String phone,
            @NotBlank @Size(max = 80) String businessType,
            @NotBlank @Size(max = 80) String city,
            @NotBlank @Size(max = 80) String state,
            @Pattern(regexp = "^\\d{6}$", message = "must be a 6-digit pincode") String pincode,
            @Size(max = 300) String productInterest,
            @Size(max = 2000) String message,
            @AssertTrue(message = "consent is required") boolean consent) {}

    public record DistributorApplicationResponse(String applicationId, String status, String contactName) {}
}
