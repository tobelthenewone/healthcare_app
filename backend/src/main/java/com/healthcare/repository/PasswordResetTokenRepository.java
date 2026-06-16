package com.healthcare.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import com.healthcare.model.PasswordResetToken;
import com.healthcare.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    List<PasswordResetToken> findByUser(User user);

    @Modifying
    @Transactional
    void deleteByUser(User user);
    void deleteByExpiryDateBefore(Instant now);
}