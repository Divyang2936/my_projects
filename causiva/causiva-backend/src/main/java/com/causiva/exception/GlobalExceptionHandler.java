package com.causiva.exception;

import com.causiva.dto.ApiResponse;
import com.causiva.security.RateLimitExceededException;
import com.causiva.security.RedisUnavailableException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    record ErrorBody(String code, String message, String path, Instant timestamp) {
    }

    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<ApiResponse<ErrorBody>> nf(NotFoundException e, HttpServletRequest r) {
        return error(HttpStatus.NOT_FOUND, "NOT_FOUND", e, r);
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiResponse<ErrorBody>> cf(ConflictException e, HttpServletRequest r) {
        return error(HttpStatus.CONFLICT, "CONFLICT", e, r);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiResponse<ErrorBody>> integrity(DataIntegrityViolationException e, HttpServletRequest r) {
        return error(HttpStatus.CONFLICT, "CONFLICT", "Request conflicts with existing data", r);
    }

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<ApiResponse<ErrorBody>> ua(UnauthorizedException e, HttpServletRequest r) {
        return error(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", e, r);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    ResponseEntity<ApiResponse<ErrorBody>> limited(RateLimitExceededException e, HttpServletRequest r) {
        return error(HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMITED", "Too many requests", r);
    }

    @ExceptionHandler(RedisUnavailableException.class)
    ResponseEntity<ApiResponse<ErrorBody>> redisUnavailable(RedisUnavailableException e, HttpServletRequest r) {
        return error(HttpStatus.SERVICE_UNAVAILABLE, "SECURITY_SERVICE_UNAVAILABLE", "Security service unavailable", r);
    }

    @ExceptionHandler(ForbiddenException.class)
    ResponseEntity<ApiResponse<ErrorBody>> fb(ForbiddenException e, HttpServletRequest r) {
        return error(HttpStatus.FORBIDDEN, "FORBIDDEN", e, r);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<ErrorBody>> val(MethodArgumentNotValidException e, HttpServletRequest r) {
        String m = e.getBindingResult().getFieldErrors().stream().map(x -> x.getField() + ": " + x.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return error(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", m, r);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<ErrorBody>> all(Exception e, HttpServletRequest r) {
        e.printStackTrace();
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Unexpected server error", r);
    }

    private ResponseEntity<ApiResponse<ErrorBody>> error(HttpStatus s, String code, Exception e, HttpServletRequest r) {
        return error(s, code, e.getMessage(), r);
    }

    private ResponseEntity<ApiResponse<ErrorBody>> error(HttpStatus s, String code, String msg, HttpServletRequest r) {
        return ResponseEntity.status(s)
                .body(new ApiResponse<>(false, new ErrorBody(code, msg, r.getRequestURI(), Instant.now()), msg, code));
    }
}
