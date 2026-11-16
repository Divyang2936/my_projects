package com.causiva.service;

import com.causiva.dto.ProductDtos.ProductResponse;
import com.causiva.exception.NotFoundException;
import com.causiva.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProductService {
    final ProductRepository repo;

    public ProductService(ProductRepository r) {
        repo = r;
    }

    public List<ProductResponse> all() {
        return repo.findByActiveTrueOrderByCreatedAtDesc().stream().map(ProductResponse::of).toList();
    }

    public ProductResponse bySlug(String slug) {
        return ProductResponse
                .of(repo.findBySlugAndActiveTrue(slug).orElseThrow(() -> new NotFoundException("Product not found")));
    }
}
