package com.rageforge.store.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String slug;
    @Column(nullable = false)
    private String name;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Category category;
    private String tagline;
    @Column(length = 2000)
    private String description;
    private String accent;
    private String badge;
    private String imageKey;
    private boolean bestseller;
    private boolean featured;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "pos")
    private List<SizeOption> sizes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_flavours", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "flavour")
    @OrderColumn(name = "pos")
    private List<String> flavours = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_facts", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "fact")
    @OrderColumn(name = "pos")
    private List<String> facts = new ArrayList<>();

    public Product() {}

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String v) { slug = v; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public Category getCategory() { return category; }
    public void setCategory(Category v) { category = v; }
    public String getTagline() { return tagline; }
    public void setTagline(String v) { tagline = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public String getAccent() { return accent; }
    public void setAccent(String v) { accent = v; }
    public String getBadge() { return badge; }
    public void setBadge(String v) { badge = v; }
    public String getImageKey() { return imageKey; }
    public void setImageKey(String v) { imageKey = v; }
    public boolean isBestseller() { return bestseller; }
    public void setBestseller(boolean v) { bestseller = v; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean v) { featured = v; }
    public List<SizeOption> getSizes() { return sizes; }
    public List<String> getFlavours() { return flavours; }
    public List<String> getFacts() { return facts; }
}
