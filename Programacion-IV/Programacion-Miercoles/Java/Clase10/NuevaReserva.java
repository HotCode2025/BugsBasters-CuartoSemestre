package utn.bodega.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.*;
import utn.bodega.modelo.Experiencia;

public record NuevaReserva(
        @NotBlank @Size(max = 100) String visitante,
        @NotNull Experiencia experiencia,
        @NotNull @Min(1) Integer personas,
        @NotNull LocalDate fecha,
        @NotNull LocalTime hora
) {}
