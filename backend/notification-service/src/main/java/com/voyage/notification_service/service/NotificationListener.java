package com.voyage.notification_service.service;

import com.voyage.notification_service.dto.ReservationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {
    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    @KafkaListener(topics = "reservations", groupId = "notification_group")
    public void handleReservationNotification(ReservationEvent reservationEvent) {
        log.info("Received reservation notification event {}", reservationEvent);
        if("CONFIRMED".equals(reservationEvent.getStatus())&&reservationEvent.getUserId()!=null) {
            try{
                log.info("-----> SENDING NOTIFICATION <-----");
                log.info("TO:{}", reservationEvent.getEmail());
                log.info("Your reservation {} is confirmed!", reservationEvent.getReservationId());
                log.info("----------------------------------");
            } catch (Exception e) {
                log.error("Error while processing reservation notification event {}", reservationEvent, e);
                throw new RuntimeException(e);
            }
        }
    }
}
