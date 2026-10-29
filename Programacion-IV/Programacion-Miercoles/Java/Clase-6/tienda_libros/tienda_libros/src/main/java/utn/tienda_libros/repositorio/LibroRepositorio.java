package utn.tienda_libros.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import utn.tienda_libros.modelos.Libro;

public interface LibroRepositorio extends JpaRepository <Libro, Integer>{
}
