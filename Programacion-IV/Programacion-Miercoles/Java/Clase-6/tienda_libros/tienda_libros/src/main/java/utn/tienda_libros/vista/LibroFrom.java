package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelos.Libro;
import utn.tienda_libros.servicios.LibroServicios;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

@Component
public class LibroFrom extends JFrame {
    LibroServicios libroServicios;
    private JPanel panel;
    private JTable TablasLibros;
    private JTextField idTexto;
    private JTextField LibroTexto;
    private JLabel Autor;
    private JTextField AutorTexto;
    private JTextField PrecioTexto;
    private JTextField ExistenciasTexto;
    private JButton agregarButton;
    private JButton modificarButton;
    private JButton eliminarButton;
    private DefaultTableModel tablaModelosLibros;

    @Autowired
    public LibroFrom(LibroServicios libroServicios) {
        this.libroServicios = libroServicios;
        iniciarForma();
        agregarButton.addActionListener(e -> agregarLibro());
        TablasLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                cargarLibroSeleccionado();
            }
        });
        modificarButton.addActionListener(e -> modificarLibro());
        eliminarButton.addActionListener(e -> eliminarLibro());
    }

    private void iniciarForma() {
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setSize(900, 700);
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Dimension tamanioPantalla = toolkit.getScreenSize();
        int x = (tamanioPantalla.width - getWidth()) / 2;
        int y = (tamanioPantalla.height - getHeight()) / 2;
        setLocation(x, y);
    }

    private void agregarLibro() {
        if (LibroTexto.getText().equals("")) {
            mostrarMensaje("Ingresa el nombre del libro");
            LibroTexto.requestFocusInWindow();
            return;
        }
        var nombreLibro = LibroTexto.getText();
        var autor = AutorTexto.getText();
        var precio = Double.parseDouble(PrecioTexto.getText());
        var existencias = Integer.parseInt(ExistenciasTexto.getText());

        var libro = new Libro(null, nombreLibro, autor, precio, existencias);
        this.libroServicios.guardarLibro(libro);
        mostrarMensaje("Se agrego el libro...");
        limpiarFormulario();
        listarLibros();
    }

    private void cargarLibroSeleccionado() {
        var renglon = TablasLibros.getSelectedRow();
        if (renglon != -1) {
            String idLibro = TablasLibros.getModel().getValueAt(renglon, 0).toString();
            idTexto.setText(idLibro);

            String nombreLibro = TablasLibros.getModel().getValueAt(renglon, 1).toString();
            LibroTexto.setText(nombreLibro);

            String autor = TablasLibros.getModel().getValueAt(renglon, 2).toString();
            AutorTexto.setText(autor);

            String precio = TablasLibros.getModel().getValueAt(renglon, 3).toString();
            PrecioTexto.setText(precio);

            String existencias = TablasLibros.getModel().getValueAt(renglon, 4).toString();
            ExistenciasTexto.setText(existencias);
        }
    }

    private void modificarLibro() {
        if (this.idTexto.getText().equals("")) {
            mostrarMensaje("Debes seleccionar un registro en la tabla");
        } else {
            if (LibroTexto.getText().equals("")) {
                mostrarMensaje("Ingrese el nombre del libro...");
                LibroTexto.requestFocusInWindow();
                return;
            }
            int idLibro = Integer.parseInt(idTexto.getText());
            var nombreLibro = LibroTexto.getText();
            var autor = AutorTexto.getText();
            var precio = Double.parseDouble(PrecioTexto.getText());
            var existencias = Integer.parseInt(ExistenciasTexto.getText());
            var libro = new Libro(idLibro, nombreLibro, autor, precio, existencias);
            libroServicios.guardarLibro(libro);
            mostrarMensaje("Se modifico el libro...");
            limpiarFormulario();
            listarLibros();
        }
    }

    private void eliminarLibro() {
        var renglon = TablasLibros.getSelectedRow();
        if (renglon != -1) {
            String idLibro = TablasLibros.getModel().getValueAt(renglon, 0).toString();
            var libro = new Libro();
            libro.setIdLibro(Integer.parseInt(idLibro));
            libroServicios.eliminarLibro(libro);
            mostrarMensaje("Libro " + idLibro + " ELIMINADO");
            limpiarFormulario();
            listarLibros();
        } else {
            mostrarMensaje("No se ha seleccionado ningun libro de la tabla");
        }
    }

    private void limpiarFormulario() {
        idTexto.setText("");
        LibroTexto.setText("");
        AutorTexto.setText("");
        PrecioTexto.setText("");
        ExistenciasTexto.setText("");
    }

    private void mostrarMensaje(String mensaje) {
        JOptionPane.showMessageDialog(this, mensaje);
    }

    private void createUIComponents() {
        idTexto = new JTextField("");
        idTexto.setVisible(false);
        this.tablaModelosLibros = new DefaultTableModel(0, 5) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModelosLibros.setColumnIdentifiers(cabecera);
        // Instanciar el objeto de JTable
        this.TablasLibros = new JTable(tablaModelosLibros);
        // Evitar que se seleccionen varios registros de la tabla
        TablasLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros() {
        tablaModelosLibros.setRowCount(0);
        var libros = libroServicios.listarLibros();
        libros.forEach((libro) -> {
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