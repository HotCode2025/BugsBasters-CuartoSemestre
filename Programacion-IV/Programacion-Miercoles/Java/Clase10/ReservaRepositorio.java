package utn.bodega.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import utn.bodega.modelo.Reserva;

public interface ReservaRepositorio extends JpaRepository<Reserva, Long> {

    List<Reserva> findAllByOrderByFechaAscHoraAscIdAsc();
}
