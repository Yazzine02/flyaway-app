package com.voyage.reservation_service.repository;

import com.voyage.reservation_service.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserIdOrderByDateDesc(Long userId);
}
