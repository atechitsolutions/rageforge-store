package com.rageforge.store.web;

import com.rageforge.store.dto.Dtos.*;
import com.rageforge.store.service.CatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CatalogController {
    private final CatalogService catalog;

    public CatalogController(CatalogService catalog) { this.catalog = catalog; }

    @GetMapping("/categories")
    public List<CategoryDto> categories() { return catalog.categories(); }

    @GetMapping("/products")
    public List<ProductDto> products(@RequestParam(required = false) String q,
                                     @RequestParam(required = false) String category,
                                     @RequestParam(required = false) Boolean best,
                                     @RequestParam(required = false) Integer maxPrice,
                                     @RequestParam(required = false) String sort) {
        return catalog.search(q, category, best, maxPrice, sort);
    }

    @GetMapping("/products/{slug}")
    public ProductDto product(@PathVariable String slug) { return catalog.bySlug(slug); }
}
