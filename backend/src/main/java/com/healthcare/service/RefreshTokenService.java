package com.healthcare.service;

import java.time.Instant;
import java.util.UUID;

import java.time.Duration;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.healthcare.model.RefreshToken;
import com.healthcare.model.User;
import com.healthcare.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Transactional

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional

    public RefreshToken createRefreshToken(User user) {

        refreshTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken(
                user,
                token,
                Instant.now().plus(Duration.ofDays(1)));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        return refreshToken;
    }
}