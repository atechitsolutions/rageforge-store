package com.rageforge.store.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String slug;
    @Column(nullable = false)
    private String name;
    private String tagline;
    private int sortOrder;

    public Category() {}
    public Category(String slug, String name, String tagline, int sortOrder) {
        this.slug = slug; this.name = name; this.tagline = tagline; this.sortOrder = sortOrder;
    }
    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getTagline() { return tagline; }
    public int getSortOrder() { return sortOrder; }
}
