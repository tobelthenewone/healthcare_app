package com.healthcare.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.healthcare.model.User;
import com.healthcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final UserRepository userRepository;

    private static final int MAX_ATTEMPTS = 5;

    public void loginFailed(User user) {
        int attempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(attempts);

        if (attempts >= MAX_ATTEMPTS) {
            user.setAccountNonLocked(false);
            user.setLockTime(Instant.now());
        }

        userRepository.save(user);
    }

    public void loginSucceeded(User user) {
        user.setFailedAttempts(0);
        user.setAccountNonLocked(true);
        user.setLockTime(null);

        userRepository.save(user);
    }
}