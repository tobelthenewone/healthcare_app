package com.healthcare.controller;

import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.ForgotPasswordRequest;
import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.RefreshResponse;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.dto.ResetPasswordRequest;
import com.healthcare.model.BlacklistedToken;
import com.healthcare.model.RefreshToken;
import com.healthcare.model.User;
import com.healthcare.service.AuthService;
import com.healthcare.service.PasswordResetService;
import com.healthcare.service.RefreshTokenService;
import com.healthcare.util.JwtUtil;
import com.healthcare.repository.BlacklistedTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam String token) {
        authService.verifyToken(token);
        return "Account verified successfully!";
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@RequestBody Map<String, String> request) {

        String requestToken = request.get("refreshToken");

        RefreshToken refreshToken = refreshTokenService.verifyToken(requestToken);

        User user = refreshToken.getUser();

        String newAccessToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getPasswordChangedAt());

        return ResponseEntity.ok(
                new RefreshResponse(newAccessToken, requestToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("No token found");
        }

        String token = authHeader.substring(7);

        Date expiry = jwtUtil.extractExpiration(token);

        BlacklistedToken blacklistedToken = new BlacklistedToken(
                token,
                expiry.toInstant().atZone(ZoneId.systemDefault()).toInstant());

        blacklistedTokenRepository.save(blacklistedToken);

        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendResetLink(request.getEmail());
        return ResponseEntity.ok("If the email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword());
        return ResponseEntity.ok("Password reset successful");
    }
}