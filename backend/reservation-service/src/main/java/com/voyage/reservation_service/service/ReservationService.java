package com.voyage.reservation_service.service;

import com.voyage.reservation_service.client.FlightClient;
import com.voyage.reservation_service.client.HotelClient;
import com.voyage.reservation_service.client.PaymentClient;
import com.voyage.reservation_service.client.UserClient;
import com.voyage.reservation_service.dto.*;
import com.voyage.reservation_service.model.Reservation;
import com.voyage.reservation_service.model.ReservationStatus;
import com.voyage.reservation_service.repository.ReservationRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Good to add for this method

import java.time.LocalDateTime;

@Service
public class ReservationService {
    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private FlightClient flightClient;
    @Autowired
    private HotelClient hotelClient;
    @Autowired
    private PaymentClient paymentClient;
    @Autowired
    private UserClient userClient;
    @Autowired
    private KafkaTemplate<String, ReservationEvent> kafkaTemplate;

    @Transactional // Make this method transactional
    public Reservation createReservation(ReservationRequest reservationRequest) {
        double totalFlightPrice = 0.0;
        double totalHotelPrice = 0.0;
        double flightClassCharge = 0.0;
        double baseFlightPrice = 0.0;
        double baseHotelPrice = 0.0;

        // BUG 2 FIX: Use "reservationRequest" variable
        FlightDTO flight = getFlightDetails(reservationRequest.getFlightId());
        if (flight != null) {
            baseFlightPrice = flight.getPrice();
            flightClassCharge = reservationRequest.getFlightClass().getPrice();
            totalFlightPrice = (flightClassCharge + baseFlightPrice) * reservationRequest.getFlightPassengers();
        }

        HotelDTO hotel = getHotelDetails(reservationRequest.getHotelId());
        if (hotel != null) {
            baseHotelPrice = hotel.getPrice();

            // --- FIX: Calculate total based on nights ---
            int nights = reservationRequest.getNumberOfNights();
            // Safety check: ensure at least 1 night
            if (nights < 1) nights = 1;

            totalHotelPrice = baseHotelPrice * reservationRequest.getHotelPassengers() * nights;
        }

        double finalTotalPrice = totalFlightPrice + totalHotelPrice;
        if(finalTotalPrice <= 0){
            throw new RuntimeException("Reservation must include a flight or a hotel.");
        }

        // BUG 1 FIX: Call the new wrapper method, not the client directly
        PaymentResponse paymentResponse = processPayment(new PaymentRequest(
                reservationRequest.getUserId(),
                finalTotalPrice
        ));

        Reservation reservation = new Reservation();
        reservation.setUserId(reservationRequest.getUserId());
        reservation.setFlightId(reservationRequest.getFlightId());
        reservation.setHotelId(reservationRequest.getHotelId());

        // BUG 4 FIX: Use the corrected field name
        reservation.setDate(LocalDateTime.now()); // Assuming you renamed 'date' to 'reservationDate'

        reservation.setFlightPassengers(reservationRequest.getFlightPassengers());
        reservation.setHotelPassengers(reservationRequest.getHotelPassengers());
        reservation.setFlightClass(reservationRequest.getFlightClass());
        reservation.setBaseFlightPrice(baseFlightPrice);
        reservation.setBaseHotelPrice(baseHotelPrice);
        reservation.setFlightClassCharge(flightClassCharge);
        reservation.setTotalPrice(finalTotalPrice);

        if ("SUCCESS".equals(paymentResponse.getStatus())) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        } else {
            reservation.setStatus(ReservationStatus.FAILED);
        }

        Reservation savedReservation = reservationRepository.save(reservation);

        if(savedReservation.getStatus() == ReservationStatus.CONFIRMED && savedReservation.getUserId() != null){
            try{
                log.info("Fetching user details for notification...");
                UserDTO user = userClient.getUser(savedReservation.getUserId()); // Assuming method is getUserById
                ReservationEvent reservationEvent = new ReservationEvent(
                        savedReservation.getId(),
                        savedReservation.getUserId(),
                        "CONFIRMED",
                        user.getEmail()
                );
                log.info("Publishing reservation event: {}", reservationEvent);
                kafkaTemplate.send("reservations", reservationEvent);
            } catch (Exception e) {
                // BUG 3 FIX: Only log the error. DO NOT throw an exception.
                // Throwing here would roll back the successful reservation.
                log.error("Failed to send Kafka message for reservation {}: {}", savedReservation.getId(), e.getMessage());
            }
        }
        return savedReservation;
    }

    // --- PAYMENT WRAPPER AND FALLBACK (BUG 1 FIX) ---
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        return paymentClient.processPayment(paymentRequest);
    }

    public PaymentResponse paymentFallback(PaymentRequest paymentRequest, Throwable t) {
        log.warn("--- Payment Service Fallback Activated. Reason: {}", t.getMessage());
        return new PaymentResponse("FAILED", null, "Payment service is temporarily unavailable.");
    }

    // --- FLIGHT ---
    @CircuitBreaker(name = "flightService", fallbackMethod = "flightFallback")
    public FlightDTO getFlightDetails(Long flightId) {
        if (flightId == null) return null;
        return flightClient.getFlightById(flightId);
    }

    public FlightDTO flightFallback(Long flightId, Throwable t) {
        log.warn("--- Flight Service Fallback Activated. Reason: {}", t.getMessage());
        throw new RuntimeException("Flight service is temporarily unavailable. Cannot complete reservation.");
    }

    // --- HOTEL ---
    @CircuitBreaker(name = "hotelService", fallbackMethod = "hotelFallback")
    public HotelDTO getHotelDetails(Long hotelId) {
        if (hotelId == null) return null;
        return hotelClient.getHotelById(hotelId);
    }

    public HotelDTO hotelFallback(Long hotelId, Throwable t) {
        log.warn("--- Hotel Service Fallback Activated. Reason: {}", t.getMessage());
        throw new RuntimeException("Hotel service is temporarily unavailable. Cannot complete reservation.");
    }
}