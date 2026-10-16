package com.rageforge.store.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class SizeOption {
    private String label;
    private int price;
    private int mrp;

    public SizeOption() {}
    public SizeOption(String label, int price, int mrp) { this.label = label; this.price = price; this.mrp = mrp; }
    public String getLabel() { return label; }
    public int getPrice() { return price; }
    public int getMrp() { return mrp; }
}
