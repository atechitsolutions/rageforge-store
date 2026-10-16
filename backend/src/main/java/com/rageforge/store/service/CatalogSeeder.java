package com.rageforge.store.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rageforge.store.model.*;
import com.rageforge.store.repo.CategoryRepository;
import com.rageforge.store.repo.ProductRepository;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Loads catalog.json into MySQL the first time the app starts (only when the tables are empty). */
@Component
public class CatalogSeeder implements CommandLineRunner {
    @JsonIgnoreProperties(ignoreUnknown = true) public record SeedCategory(String slug, String name, String tagline, int sortOrder) {}
    @JsonIgnoreProperties(ignoreUnknown = true) public record SeedSize(String label, int price, int mrp) {}
    @JsonIgnoreProperties(ignoreUnknown = true) public record SeedProduct(String slug, String name, String category, String tagline,
            String description, List<SeedSize> sizes, List<String> flavours, boolean bestseller, boolean featured,
            String accent, String badge, String imageKey, List<String> facts) {}
    @JsonIgnoreProperties(ignoreUnknown = true) public record SeedFile(List<SeedCategory> categories, List<SeedProduct> products) {}

    private final CategoryRepository categories;
    private final ProductRepository products;
    private final ObjectMapper mapper;

    public CatalogSeeder(CategoryRepository categories, ProductRepository products, ObjectMapper mapper) {
        this.categories = categories;
        this.products = products;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categories.count() > 0) return;
        try (InputStream in = new ClassPathResource("catalog.json").getInputStream()) {
            SeedFile seed = mapper.readValue(in, SeedFile.class);
            Map<String, Category> bySlug = new HashMap<>();
            for (SeedCategory c : seed.categories())
                bySlug.put(c.slug(), categories.save(new Category(c.slug(), c.name(), c.tagline(), c.sortOrder())));
            for (SeedProduct s : seed.products()) {
                Product p = new Product();
                p.setSlug(s.slug()); p.setName(s.name()); p.setCategory(bySlug.get(s.category()));
                p.setTagline(s.tagline()); p.setDescription(s.description()); p.setAccent(s.accent());
                p.setBadge(s.badge()); p.setImageKey(s.imageKey() == null || s.imageKey().isBlank() ? null : s.imageKey());
                p.setBestseller(s.bestseller()); p.setFeatured(s.featured());
                s.sizes().forEach(z -> p.getSizes().add(new SizeOption(z.label(), z.price(), z.mrp())));
                p.getFlavours().addAll(s.flavours());
                if (s.facts() != null) p.getFacts().addAll(s.facts());
                products.save(p);
            }
        }
    }
}
