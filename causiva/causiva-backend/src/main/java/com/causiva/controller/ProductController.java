package com.causiva.controller;

import com.causiva.dto.*;
import com.causiva.dto.ProductDtos.ProductResponse;
import com.causiva.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    final ProductService s;

    public ProductController(ProductService s) {
        this.s = s;
    }

    @GetMapping
    ApiResponse<List<ProductResponse>> all() {
        return ApiResponse.ok(s.all());
    }

    @GetMapping("/slug/{slug}")
    ApiResponse<ProductResponse> one(@PathVariable String slug) {
        return ApiResponse.ok(s.bySlug(slug));
    }
}
