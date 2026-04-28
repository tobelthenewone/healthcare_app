package com.healthcare.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.healthcare.repository.BlacklistedTokenRepository;
import com.healthcare.repository.PasswordResetTokenRepository;
import com.healthcare.repository.VerificationTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;

    @Scheduled(fixedRate = 3600000) // every 1 hour
    public void cleanUpExpiredTokens() {

        LocalDateTime now = LocalDateTime.now();

        blacklistedTokenRepository.deleteByExpiryDateBefore(now);
        passwordResetTokenRepository.deleteByExpiryDateBefore(now);
        verificationTokenRepository.deleteByExpiryDateBefore(now);

        System.out.println("Expired tokens cleaned up at: " + now);
    }
}