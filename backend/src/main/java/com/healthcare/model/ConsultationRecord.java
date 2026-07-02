package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "consultation_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Appointment this consultation belongs to.
     * One appointment can have only one consultation record.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    /*
     * Professional diagnosis.
     */
    @Column(nullable = false, length = 2000)
    private String diagnosis;

    /*
     * Prescribed medication/treatment.
     */
    @Column(length = 3000)
    private String prescription;

    /*
     * Advice given to the patient.
     */
    @Column(length = 3000)
    private String recommendations;

    /*
     * Additional consultation notes.
     */
    @Column(length = 5000)
    private String notes;

    /*
     * Audit fields.
     */
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}