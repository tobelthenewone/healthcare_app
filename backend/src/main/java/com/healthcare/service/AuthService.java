package com.healthcare.service;

import java.util.UUID;
import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.model.RefreshToken;
import com.healthcare.model.User;
import com.healthcare.model.VerificationToken;
import com.healthcare.repository.UserRepository;
import com.healthcare.repository.VerificationTokenRepository;
import com.healthcare.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final RefreshTokenService refreshTokenService;
        private final LoginAttemptService loginAttemptService;
        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final EmailService emailService;
        private final VerificationTokenRepository tokenRepository;

        public void verifyToken(String token) {

                VerificationToken verificationToken = tokenRepository.findByToken(token)
                                .orElseThrow(() -> new RuntimeException("Invalid token"));

                if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
                        throw new RuntimeException("Token expired");
                }

                User user = verificationToken.getUser();
                user.setEnabled(true);
                userRepository.save(user);
        }

        public AuthResponse register(RegisterRequest request) {

                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already exists");
                }

                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setFullName(request.getFullName());
                user.setPhone(request.getPhone());
                user.setRole(request.getRole());

                // IMPORTANT: set initial passwordChangedAt
                user.setPasswordChangedAt(Instant.now());

                userRepository.save(user);

                // Create verification token
                String verificationTokenStr = UUID.randomUUID().toString();

                VerificationToken verificationToken = new VerificationToken();
                verificationToken.setToken(verificationTokenStr);
                verificationToken.setUser(user);
                verificationToken.setExpiryDate(Instant.now().plusSeconds(60 * 60)); // 1 hour

                tokenRepository.save(verificationToken);

                // Send verification email
                String link = "http://localhost:8080/api/auth/verify?token=" + verificationTokenStr;

                emailService.sendEmail(
                                user.getEmail(),
                                "Verify your account",
                                "Click this link to verify your account:\n" + link);

                // FIX: store token
                String jwtToken = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getPasswordChangedAt());

                return new AuthResponse(
                                jwtToken,
                                null, // no refresh token on register
                                user.getEmail(),
                                user.getFullName(),
                                user.getRole(),
                                user.getId());

        }

        public AuthResponse login(LoginRequest request) {

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

                if (!user.isAccountNonLocked()) {
                        throw new RuntimeException("Account is locked. Try again later.");
                }

                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));

                        // SUCCESS → reset attempts
                        loginAttemptService.loginSucceeded(user);

                        user.setLastLoginAt(LocalDateTime.now());
                        userRepository.save(user);
                        // Generate JWT and refresh token
                        String accessToken = jwtUtil.generateToken(
                                        user.getEmail(),
                                        user.getPasswordChangedAt());

                        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                        return new AuthResponse(
                                        accessToken,
                                        refreshToken.getToken(),
                                        user.getEmail(),
                                        user.getFullName(),
                                        user.getRole(),
                                        user.getId());

                } catch (BadCredentialsException ex) {

                        // FAILED → increment attempts
                        loginAttemptService.loginFailed(user);

                        throw new RuntimeException("Invalid credentials");
                }
        }
}