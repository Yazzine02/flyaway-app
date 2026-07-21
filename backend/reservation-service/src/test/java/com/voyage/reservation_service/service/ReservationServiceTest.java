package com.voyage.reservation_service.service;

import com.voyage.reservation_service.client.FlightClient;
import com.voyage.reservation_service.client.HotelClient;
import com.voyage.reservation_service.client.PaymentClient;
import com.voyage.reservation_service.client.UserClient;
import com.voyage.reservation_service.dto.FlightDTO;
import com.voyage.reservation_service.dto.PaymentResponse;
import com.voyage.reservation_service.dto.ReservationEvent;
import com.voyage.reservation_service.dto.UserDTO;
import com.voyage.reservation_service.model.FlightClass;
import com.voyage.reservation_service.model.Reservation;
import com.voyage.reservation_service.model.ReservationStatus;
import com.voyage.reservation_service.dto.ReservationRequest;
import com.voyage.reservation_service.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock private ReservationRepository reservationRepository;
    @Mock private FlightClient flightClient;
    @Mock private HotelClient hotelClient;
    @Mock private PaymentClient paymentClient;
    @Mock private UserClient userClient;
    @Mock private KafkaTemplate<String, ReservationEvent> kafkaTemplate;

    @InjectMocks private ReservationService service;

    @Test
    void confirmsFlightOnlyReservationAndComputesTotal() {
        FlightDTO flight = new FlightDTO();
        flight.setPrice(100.0);
        when(flightClient.getFlightById(1L)).thenReturn(flight);
        when(paymentClient.processPayment(any())).thenReturn(new PaymentResponse("SUCCESS", "txn_1", null));
        when(reservationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        UserDTO user = new UserDTO();
        user.setEmail("a@b.com");
        when(userClient.getUser(anyLong())).thenReturn(user);

        ReservationRequest request = new ReservationRequest();
        request.setUserId(1L);
        request.setFlightId(1L);
        request.setFlightPassengers(2);
        request.setFlightClass(FlightClass.FLEX); // +200 per passenger

        Reservation result = service.createReservation(request);

        assertThat(result.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
        assertThat(result.getTotalPrice()).isEqualTo((100.0 + 200.0) * 2);
    }

    @Test
    void rejectsReservationWithNeitherFlightNorHotel() {
        ReservationRequest request = new ReservationRequest();
        request.setUserId(1L);

        assertThatThrownBy(() -> service.createReservation(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("flight or a hotel");
    }
}
