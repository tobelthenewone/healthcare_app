package com.healthcare.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    private int failedAttempts;

    private boolean accountNonLocked = true;

    private LocalDateTime lockTime;

    public boolean isAccountNonLocked() {
        if (accountNonLocked) {
            return true;
        }

        if (lockTime == null) {
            return true;
        }

        // unlock after 15 minutes
        if (lockTime.plusMinutes(10).isBefore(LocalDateTime.now())) {
            accountNonLocked = true;
            failedAttempts = 0;
            lockTime = null;
            return true;
        }

        return false;
    }

    private boolean enabled = false;

    private Instant passwordChangedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}