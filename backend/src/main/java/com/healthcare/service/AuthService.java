package com.healthcare.service;

import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.model.User;
import com.healthcare.repository.UserRepository;
import com.healthcare.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if user exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        
        userRepository.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new AuthResponse(
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getId()
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new AuthResponse(
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getId()
        );
    }
}