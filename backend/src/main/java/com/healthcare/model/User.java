package com.healthcare.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.Duration;
import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    private int failedAttempts;

    private boolean accountNonLocked = true;

    private Instant lockTime;

    public boolean isAccountNonLocked() {
        if (accountNonLocked) {
            return true;
        }

        if (lockTime == null) {
            return true;
        }

        // unlock after 15 minutes
        if (lockTime.plus(Duration.ofMinutes(10)).isBefore(Instant.now())) {
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
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;


    @PrePersist
    public void prePersist() {

        createdAt = Instant.now();

        
    }
}