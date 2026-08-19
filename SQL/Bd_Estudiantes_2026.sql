-- comenzamos con CRUD: Create(insertar),read(leer),update(actualizar), delete(eliminar)
-- listar los estudiantes(read)
SELECT * from estudiantes_2026;
-- insertar estudiantes.
INSERT INTO	estudiantes_2026(nombre, apellido, telefono, mail) values ( "Juan", "Perez", "213123123", "JuanPerez@gmail.com.ar");
-- update (modifcar /actualizar)
UPDATE estudiantes_2026 SET nombre="Juan Carlos", apellido= "Garcia" WHERE idestudiantes_2026=1;
-- delete (eliminar)
DELETE FROM estudiantes_2026 where idestudiantes_2026=7;
-- Para modificar el idestudiantes_2026 y cominece en 1 (no recomendable ni es buena practica)
ALTER TABLE estudiantes_2026 AUTO_INCREMENT = 1;