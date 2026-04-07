package com.healthcare.service;

import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.model.User;
import com.healthcare.repository.UserRepository;
import com.healthcare.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import com.healthcare.model.User;
import com.healthcare.repository.UserRepository;
import io.jsonwebtoken.Claims;
import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

        //  IMPORTANT: set initial passwordChangedAt
        user.setPasswordChangedAt(Instant.now());

        userRepository.save(user);

        //  FIX: store token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getPasswordChangedAt());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getId());
    }

    public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    // FIX: store token for loginn
    String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getPasswordChangedAt()
    );

    return new AuthResponse(
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getId()
    );
}
}