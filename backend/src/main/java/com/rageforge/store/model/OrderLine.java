package com.rageforge.store.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderLine {
    private Long productId;
    private String productName;
    private String sizeLabel;
    private String flavour;
    private int unitPrice;
    private int qty;

    public OrderLine() {}
    public OrderLine(Long productId, String productName, String sizeLabel, String flavour, int unitPrice, int qty) {
        this.productId = productId; this.productName = productName; this.sizeLabel = sizeLabel;
        this.flavour = flavour; this.unitPrice = unitPrice; this.qty = qty;
    }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getSizeLabel() { return sizeLabel; }
    public String getFlavour() { return flavour; }
    public int getUnitPrice() { return unitPrice; }
    public int getQty() { return qty; }
}
