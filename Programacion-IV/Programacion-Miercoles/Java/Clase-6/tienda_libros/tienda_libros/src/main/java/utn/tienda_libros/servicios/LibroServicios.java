package utn.tienda_libros.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utn.tienda_libros.modelos.Libro;
import utn.tienda_libros.repositorio.LibroRepositorio;

import java.util.List;

@Service
public class LibroServicios implements lLibroServicios {

    @Autowired
    private LibroRepositorio libroRepositorio;


    @Override
    public List<Libro> listarLibros() {
        return libroRepositorio.findAll();
    }

    @Override
    public Libro buscarLibroPorId(Integer idLibro) {
        return libroRepositorio.findById(idLibro).orElse(null);
    }

    @Override
    public void guardarLibro(Libro libro) {
        libroRepositorio.save(libro);
    }

    @Override
    public void eliminarLibro(Libro libro) {
        libroRepositorio.delete(libro);
    }
}
