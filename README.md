# Adoptme API

API REST para gestión de adopciones de mascotas.
Stack: Node.js, Express y MongoDB.

## Imagen de Docker

La imagen del proyecto dockerhub:

👉 **[https://hub.docker.com/r/matiasbermudez211/adoptme](https://hub.docker.com/r/matiasbermudez211/adoptme)**

> ⚠️ Reemplazá `matiasbermudez211` con tu nombre de usuario real de DockerHub.

## Requisitos previos

- [Docker](https://www.docker.com/get-started) instalado
- Una instancia de MongoDB accesible (local o Atlas)

## Cómo construir la imagen

```bash
docker build -t adoptme .
```

## Cómo ejecutar el contenedor

```bash
docker run -d -p 8080:8080 -e MONGO_URL="tu_url_de_mongodb" --name adoptme-container adoptme
```

### Variables de entorno

| Variable    | Descripción                      | Ejemplo                                                       |
|-------------|----------------------------------|---------------------------------------------------------------|
| `MONGO_URL` | URL de conexión a MongoDB        | `mongodb+srv://user:pass@cluster.mongodb.net/adoptme`         |
| `PORT`      | Puerto de la aplicación (opcional) | `8080`                                                      |

## Cómo subir la imagen a DockerHub

```bash
# 1. Loguearse en DockerHub
docker login

# 2. Taggear la imagen con tu usuario
docker tag adoptme matiasbermudez211/adoptme:latest

# 3. Subir la imagen
docker push matiasbermudez211/adoptme:latest
```

## Cómo descargar y ejecutar desde DockerHub

```bash
# Descargar la imagen
docker pull matiasbermudez211/adoptme:latest

# Ejecutar el contenedor
docker run -d -p 8080:8080 -e MONGO_URL="tu_url_de_mongodb" --name adoptme-container matiasbermudez211/adoptme:latest
```

Una vez corriendo, la API estará disponible en `http://localhost:8080`.

## Endpoints principales

- `GET /api/users` — Obtener todos los usuarios
- `GET /api/users/:uid` — Obtener un usuario por ID
- `PUT /api/users/:uid` — Actualizar un usuario
- `DELETE /api/users/:uid` — Eliminar un usuario
- `GET /api/pets` — Obtener todas las mascotas
- `GET /api/adoptions` — Obtener todas las adopciones
- `GET /api/adoptions/:aid` — Obtener una adopción por ID
- `POST /api/adoptions/:uid/:pid` — Crear una adopción
- `POST /api/sessions/register` — Registrar un usuario
- `POST /api/sessions/login` — Iniciar sesión

## Documentación Swagger

Con el servidor corriendo, accedé a la documentación interactiva en:

```
http://localhost:8080/api-docs
```

## Tests

```bash
npm test
```

Los tests funcionales cubren todos los endpoints del router de adopciones, incluyendo casos de éxito y error.

## Tecnologías

- Node.js
- Express
- MongoDB / Mongoose
- JWT para autenticación
- Mocha + Chai + Supertest para testing
- Swagger para documentación
- Docker para contenedorización
