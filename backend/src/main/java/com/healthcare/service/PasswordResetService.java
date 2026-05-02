package com.healthcare.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.healthcare.model.PasswordResetToken;
import com.healthcare.model.User;
import com.healthcare.repository.PasswordResetTokenRepository;
import com.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import jakarta.transaction.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public void sendResetLink(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Do NOT reveal if email exists (security)
        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        // delete old tokens
        tokenRepository.deleteByUser(user);

        String rawToken = UUID.randomUUID().toString();
        String hashedToken = passwordEncoder.encode(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken(
                hashedToken,
                user,
                Instant.now().plus(Duration.ofMinutes(15)));


        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + rawToken;

        sendEmail(user.getEmail(), resetLink);
    }

    private void sendEmail(String to, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reset your password");
        message.setText("Click the link to reset your password: " + link);

        mailSender.send(message);
    }

    public void resetPassword(String rawToken, String newPassword) {

        List<PasswordResetToken> tokens = tokenRepository.findAll();

        PasswordResetToken matchedToken = null;

        for (PasswordResetToken token : tokens) {
            if (passwordEncoder.matches(rawToken, token.getHashedToken())) {
                matchedToken = token;
                break;
            }
        }

        if (matchedToken == null) {
            throw new RuntimeException("Invalid token");
        }

        if (matchedToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = matchedToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordChangedAt(Instant.now());

        userRepository.save(user);

        tokenRepository.delete(matchedToken);
    }
}