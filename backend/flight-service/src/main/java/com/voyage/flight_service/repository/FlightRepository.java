package com.voyage.flight_service.repository;

import com.voyage.flight_service.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight,Long> {
    // Find flights leaving FROM A TO B BETWEEN start of day and end of day
    List<Flight> findByDepartureAndDestinationAndDepartureDateBetween(
            String departure,
            String destination,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    );
}
