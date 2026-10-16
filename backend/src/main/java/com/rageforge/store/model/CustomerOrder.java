package com.rageforge.store.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** A demo order. No payment is collected; status is always DEMO_ORDER. */
@Entity
@Table(name = "orders")
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String pincode;
    private String coupon;
    private int subtotal;
    private int discount;
    private int shipping;
    private int total;
    private String status = "DEMO_ORDER";
    private Instant createdAt = Instant.now();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_lines", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderLine> lines = new ArrayList<>();

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { customerName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { phone = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { address = v; }
    public String getCity() { return city; }
    public void setCity(String v) { city = v; }
    public String getPincode() { return pincode; }
    public void setPincode(String v) { pincode = v; }
    public String getCoupon() { return coupon; }
    public void setCoupon(String v) { coupon = v; }
    public int getSubtotal() { return subtotal; }
    public void setSubtotal(int v) { subtotal = v; }
    public int getDiscount() { return discount; }
    public void setDiscount(int v) { discount = v; }
    public int getShipping() { return shipping; }
    public void setShipping(int v) { shipping = v; }
    public int getTotal() { return total; }
    public void setTotal(int v) { total = v; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderLine> getLines() { return lines; }
}
