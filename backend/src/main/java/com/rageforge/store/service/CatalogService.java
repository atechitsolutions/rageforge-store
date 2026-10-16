package com.rageforge.store.service;

import com.rageforge.store.dto.Dtos.*;
import com.rageforge.store.model.Product;
import com.rageforge.store.repo.CategoryRepository;
import com.rageforge.store.repo.ProductRepository;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class CatalogService {
    private final ProductRepository products;
    private final CategoryRepository categories;

    public CatalogService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    public List<CategoryDto> categories() {
        return categories.findAll().stream()
                .sorted(Comparator.comparingInt(c -> c.getSortOrder()))
                .map(c -> new CategoryDto(c.getSlug(), c.getName(), c.getTagline(), c.getSortOrder()))
                .toList();
    }

    public List<ProductDto> search(String q, String category, Boolean best, Integer maxPrice, String sort) {
        String needle = q == null ? "" : q.trim().toLowerCase();
        Comparator<Product> order = switch (sort == null ? "featured" : sort) {
            case "low" -> Comparator.comparingInt(CatalogService::firstPrice);
            case "high" -> Comparator.comparingInt(CatalogService::firstPrice).reversed();
            case "name" -> Comparator.comparing(Product::getName);
            default -> Comparator.comparing(Product::isFeatured).reversed().thenComparing(Product::getId);
        };
        return products.findAll().stream()
                .filter(p -> category == null || category.isBlank() || p.getCategory().getSlug().equals(category))
                .filter(p -> best == null || !best || p.isBestseller())
                .filter(p -> maxPrice == null || firstPrice(p) <= maxPrice)
                .filter(p -> needle.isEmpty() || haystack(p).contains(needle))
                .sorted(order)
                .map(CatalogService::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto bySlug(String slug) {
        return products.findBySlug(slug).map(CatalogService::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private static int firstPrice(Product p) { return p.getSizes().isEmpty() ? 0 : p.getSizes().get(0).getPrice(); }

    private static String haystack(Product p) {
        return (p.getName() + " " + p.getTagline() + " " + p.getCategory().getSlug() + " " + String.join(" ", p.getFlavours())).toLowerCase();
    }

    public static ProductDto toDto(Product p) {
        return new ProductDto(p.getId(), p.getSlug(), p.getName(), p.getCategory().getSlug(), p.getTagline(), p.getDescription(),
                p.getSizes().stream().map(s -> new SizeDto(s.getLabel(), s.getPrice(), s.getMrp())).toList(),
                List.copyOf(p.getFlavours()), p.isBestseller(), p.isFeatured(), p.getAccent(), p.getBadge(), p.getImageKey(),
                List.copyOf(p.getFacts()));
    }
}
