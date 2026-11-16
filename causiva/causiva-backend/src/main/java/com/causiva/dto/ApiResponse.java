package com.causiva.dto;

public record ApiResponse<T>(boolean success, T data, String message, String code) {
    public static <T> ApiResponse<T> ok(T d) {
        return new ApiResponse<>(true, d, "OK", "OK");
    }

    public static <T> ApiResponse<T> created(T d) {
        return new ApiResponse<>(true, d, "Created", "CREATED");
    }
}
