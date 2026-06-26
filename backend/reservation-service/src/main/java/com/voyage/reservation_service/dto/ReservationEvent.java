package com.voyage.reservation_service.dto;

import lombok.Data;

@Data
public class ReservationEvent {
    private Long reservationId;
    private Long userId;
    private String status;
    private String email;

    public ReservationEvent(Long reservationId, Long userId, String status, String email) {
        this.reservationId = reservationId;
        this.userId = userId;
        this.status = status;
        this.email = email;
    }
}