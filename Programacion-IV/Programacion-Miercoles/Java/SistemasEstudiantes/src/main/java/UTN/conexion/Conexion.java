package UTN.conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    public static Connection getConection() {
        Connection conexion = null;
        var baseDeDatos = "estudiantes";
        var url = "jdbc:mysql://localhost:3306/" + baseDeDatos;
        var usuario = "root";

        // Lee la contraseña desde las variables de entorno del sistema
        var password = System.getenv("DB_PASSWORD");

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");
            conexion = DriverManager.getConnection(url, usuario, password);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Error al conectar a la base de datos: " + e.getMessage());
        }

        return conexion;
    }
}