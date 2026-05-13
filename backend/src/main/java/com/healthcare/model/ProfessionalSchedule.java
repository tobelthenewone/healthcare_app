package com.healthcare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ProfessionalSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Professional owner
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private User professional;

    /*
     * Day of week
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeekEnum dayOfWeek;

    /*
     * Working hours
     */
    @Column(nullable = false)
    private Integer startHour;

    @Column(nullable = false)
    private Integer endHour;

    /*
     * Break hours (optional)
     */
    private Integer breakStartHour;

    private Integer breakEndHour;

    /*
     * Enabled working day
     */
    @Column(nullable = false)
    private boolean enabled = true;
}