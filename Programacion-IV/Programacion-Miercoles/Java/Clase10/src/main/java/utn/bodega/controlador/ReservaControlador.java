package utn.bodega.controlador;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import utn.bodega.dto.NuevaReserva;
import utn.bodega.modelo.Reserva;
import utn.bodega.servicio.ReservaServicio;

@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaControlador {

    private final ReservaServicio servicio;

    public ReservaControlador(ReservaServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Reserva> listar() {
        return servicio.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva crear(@Valid @RequestBody NuevaReserva datos) {
        return servicio.crear(datos);
    }

    @PatchMapping("/{id}/asistencia")
    public Reserva registrarAsistencia(@PathVariable long id,
                                       @RequestParam boolean asistio) {
        return servicio.registrarAsistencia(id, asistio);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable long id) {
        servicio.eliminar(id);
    }
}
