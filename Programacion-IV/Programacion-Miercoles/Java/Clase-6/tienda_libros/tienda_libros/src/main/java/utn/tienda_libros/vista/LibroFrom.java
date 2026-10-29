package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.servicios.LibroServicios;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

@Component
public class LibroFrom extends JFrame {
    LibroServicios libroServicios;
    private JPanel panel;
    private JTable TablasLibros; // Coincide exactamente con tu .form
    private DefaultTableModel tablaModelosLibros;

    @Autowired
    public LibroFrom(LibroServicios libroServicios) {
        this.libroServicios = libroServicios;
        iniciarForma();
    }

    private void iniciarForma() {
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setSize(900, 700);
        // Para obtener las dimensiones de la ventana y centrarla
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Dimension tamanioPantalla = toolkit.getScreenSize();
        int x = (tamanioPantalla.width - getWidth()) / 2;
        int y = (tamanioPantalla.height - getHeight()) / 2;
        setLocation(x, y);
    }

    private void createUIComponents() {
        this.tablaModelosLibros = new DefaultTableModel(0, 5);
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModelosLibros.setColumnIdentifiers(cabecera);
        // Instanciar el objeto de JTable con el mismo nombre del .form
        this.TablasLibros = new JTable(tablaModelosLibros);
        listarLibros();
    }

    private void listarLibros(){
        tablaModelosLibros.setRowCount(0);
        var libros = libroServicios.listarLibros();
        libros.forEach((libro)->{
            Object[] renglonLibro = {
                    libro.getIdLibro(),
                    libro.getNombreLibro(),
                    libro.getAutor(),
                    libro.getPrecio(),
                    libro.getExistencias()
            };
            this.tablaModelosLibros.addRow(renglonLibro);
        });
    }
}