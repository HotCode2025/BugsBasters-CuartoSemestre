package utn.bodega.modelo;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservas")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String visitante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Experiencia experiencia;

    @Column(nullable = false)
    private int personas;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private boolean asistio;

    public Reserva(String visitante, Experiencia experiencia, int personas,
                   LocalDate fecha, LocalTime hora) {
        this.visitante = visitante;
        this.experiencia = experiencia;
        this.personas = personas;
        this.fecha = fecha;
        this.hora = hora;
    }

    public void registrarAsistencia(boolean asistio) {
        this.asistio = asistio;
    }
}
