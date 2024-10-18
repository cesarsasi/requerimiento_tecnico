
# Requerimientos Técnicos  
**César Salazar Silva**

## Recomendaciones Iniciales

Se propone gestionar Node y los paquetes con **nvm**.

```bash
nvm install 16.14.0
nvm use 16.14.0
nvm alias default 16.14.0
```

## Inspección Local

1. **Configurar el archivo `.env`:**  
   Revisa y ajusta las líneas 6-7 del archivo para seleccionar el host de la base de datos.

2. **Instalar dependencias:**

```bash
npm install
```

3. **Ejecutar Seeder:**

```bash
npm run seeder
```

4. **Correr tests:**

```bash
npm run test
```

5. **Levantar el servidor en modo desarrollo:**

```bash
npm run dev
```

## Ejecución de la Aplicación con Base de Datos

1. Instalar **Docker** y **docker-compose**.
2. Configurar el archivo `.env` (líneas 6-7) para definir el host de la base de datos.
3. Ejecutar el siguiente comando para levantar el microservicio:

```bash
docker-compose up --build -d
```
4. Stopear contenedor de la app, en caso de querer levantar localmente
```bash
docker stop XXXX
```
4. Cargar de los datos, ejecutar seeder (linea 29 del archivo)

## Datos de Prueba

En el repositorio se incluye una colección de Postman con los endpoints preconfigurados y las variables (host: localhost, puerto: 3000). Además, la aplicación incluye documentación **Swagger** en `localhost:3000/api-docs`.

**Usuario de prueba con rol Admin:**

```plaintext
email: admin@eclass.com  
password: PassWord123&
```

**Usuario de prueba con rol Alumno:**

```plaintext
email: alumno1@eclass.com  
password: PassWord123&
```

## Cobertura de Tests (24 en total)

### Usuario (7 Tests)
- Crear un nuevo usuario: Verifica que un usuario se pueda crear exitosamente.
- No crear usuario con email existente: Asegura que no se pueda crear un usuario con un email ya registrado.
- Actualizar un usuario: Verifica que un usuario existente se pueda actualizar.
- No actualizar usuario inexistente: Confirma que no se pueda actualizar un usuario que no existe.
- Eliminar un usuario: Verifica que un usuario se pueda eliminar.
- No eliminar usuario inexistente: Asegura que no se pueda eliminar un usuario que no existe.
- Listar todos los usuarios: Verifica que se puedan listar todos los usuarios.


### Cursos (9 Tests)
- Crear un nuevo curso: Verifica que se pueda crear un curso exitosamente.
- Fallar al crear un curso sin nombre: Asegura que no se pueda crear un curso sin proporcionar un nombre.
- Actualizar un curso: Verifica que se pueda actualizar un curso existente.
- Fallar al actualizar un curso inexistente: Asegura que no se pueda actualizar un curso que no existe.
- Asignar un curso a un usuario: Verifica que se pueda asignar un curso a un usuario.
- Fallar al asignar un curso inexistente: Asegura que no se pueda asignar un curso que no existe.
- Desasignar un curso de un usuario: Verifica que se pueda desasignar un curso de un usuario.
- Eliminar un curso: Verifica que se pueda eliminar un curso existente.
- Fallar al eliminar un curso inexistente: Asegura que no se pueda eliminar un curso que no existe.

### Autenticación (8 Tests)
- Login exitoso: Verifica que un usuario pueda iniciar sesión exitosamente con las credenciales correctas.
- Login con credenciales incorrectas: Asegura que un usuario no pueda iniciar sesión con credenciales incorrectas.
- Login con JSON incorrecto: Verifica que se maneje adecuadamente un JSON mal formado.

- Sin token, acceso denegado: Verifica que se devuelva un código 401 si no se proporciona un token.
- Token inválido: Asegura que un token inválido devuelve un código 401 con el mensaje adecuado.
- Token válido: Verifica que un token válido permita el acceso y devuelva un código 200.

- Acceso denegado por rol incorrecto: Asegura que un usuario sin el rol adecuado reciba un código 403.
- Acceso permitido con rol correcto: Verifica que un usuario con el rol adecuado pueda acceder y obtenga un código 200.


## Revisión de Funcionalidades

### Requerimientos Base

1. **Revisión:** `AuthController`, método `login`, autenticación y middleware `authMiddleware`.
2. **Revisión:** Modelos `User` y `Course`, junto con las rutas `AuthRoutes`, `CourseRoutes` y `UserRoutes`, donde se distribuyen los privilegios según el rol.
3. **Revisión:** Funcionalidades en los tests, principalmente en `courseController` y `userController`.
4. **Revisión:** Listado de cursos por usuario logueado (`my-courses`), leyendo desde el token.

### Requerimientos Técnicos

- **Node:** Versión `16.14.0`
- **Cargado en Git.**
- **Datos cargados con seeders** (evitando cargas manuales de backups).
- **Documentación Postman** y **Swagger** disponibles.

### Calidad del Código

- Opinión delegada al revisor.
- 24 tests unitarios creados.
- Contraseñas encriptadas.

### Funcionalidades Adicionales

- Se genera ecosistema de contenedores para facilitar el depliegue.
- Se integra con documentacion automatica (Swagger).
- Se generan seeders para evitar cargas manuales de backups.
- Se robustece las validaciones al modelo de datos con class-validator, permitiendo un mejor control de errores.


## Requerimientos Adicionales para Perfil Admin

- Puede realizar gestión de Cursos: Crear, editar y eliminar cursos.
- Puede realizar gestión de Usuarios: Asociar, eliminar y listar usuarios y sus cursos.

## Requerimientos Adicionales para Perfil Alumno

- Perfil alumno puede solamente visualizar Cursos: Ver el listado de cursos a los que está inscrito.

## EXTRA: Consulta SQL para Reporte de Cursos por Estudiante
```sql
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    c.id AS course_id,
    c.name AS course_title,
    c.description AS course_description
FROM 
    users u
JOIN 
    user_courses uc ON u.id = uc.user_id 
JOIN 
    courses c ON uc.course_id = c.id
ORDER BY 
    u.id, c.id;
```

**Muchas gracias!**