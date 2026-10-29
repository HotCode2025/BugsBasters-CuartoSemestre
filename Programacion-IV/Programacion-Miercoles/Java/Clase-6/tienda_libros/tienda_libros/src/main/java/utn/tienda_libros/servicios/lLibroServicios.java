package utn.tienda_libros.servicios;

import utn.tienda_libros.modelos.Libro;

import java.util.List;

public interface lLibroServicios {
    public List<Libro> listarLibros();
    public  Libro buscarLibroPorId(Integer idLibro);
    public  void guardarLibro (Libro libro);
    public  void eliminarLibro (Libro libro);

}
