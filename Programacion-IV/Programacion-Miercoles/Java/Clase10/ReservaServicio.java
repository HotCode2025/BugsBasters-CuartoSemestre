package utn.bodega.servicio;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import utn.bodega.dto.NuevaReserva;
import utn.bodega.modelo.Reserva;
import utn.bodega.repositorio.ReservaRepositorio;

@Service
public class ReservaServicio {

    private final ReservaRepositorio repositorio;

    public ReservaServicio(ReservaRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public List<Reserva> listar() {
        return repositorio.findAllByOrderByFechaAscHoraAscIdAsc();
    }

    public Reserva crear(NuevaReserva datos) {
        return repositorio.save(new Reserva(
                datos.visitante().strip(),
                datos.experiencia(),
                datos.personas(),
                datos.fecha(),
                datos.hora()
        ));
    }

    private Reserva buscar(long id) {
        return repositorio.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Reserva inexistente"
                )
        );
    }

    @Transactional
    public Reserva registrarAsistencia(long id, boolean asistio) {
        Reserva reserva = buscar(id);
        reserva.registrarAsistencia(asistio);
        return reserva;
    }

    @Transactional
    public void eliminar(long id) {
        repositorio.delete(buscar(id));
    }
}
