package com.healthcare.specification;

import com.healthcare.dto.AppointmentFilterRequest;
import com.healthcare.model.Appointment;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AppointmentSpecification {

    public static Specification<Appointment> filterAppointments(
            AppointmentFilterRequest filter
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            /*
             * Status filter
             */
            if (filter.getStatus() != null) {

                predicates.add(
                        cb.equal(
                                root.get("status"),
                                filter.getStatus()
                        )
                );
            }

            /*
             * Patient filter
             */
            if (filter.getPatientId() != null) {

                predicates.add(
                        cb.equal(
                                root.get("patient").get("id"),
                                filter.getPatientId()
                        )
                );
            }

            /*
             * Professional filter
             */
            if (filter.getProfessionalId() != null) {

                predicates.add(
                        cb.equal(
                                root.get("professional").get("id"),
                                filter.getProfessionalId()
                        )
                );
            }

            /*
             * From date
             */
            if (filter.getFrom() != null) {

                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("appointmentTime"),
                                filter.getFrom()
                        )
                );
            }

            /*
             * To date
             */
            if (filter.getTo() != null) {

                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("appointmentTime"),
                                filter.getTo()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}