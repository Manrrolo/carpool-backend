# Carpool Backend🚗

### Instalación de dependencias

Para instalar las dependencias necesarias, ejecuta el siguiente comando en tu terminal:

```bash
npm install
```

### Ejecución Local

Para ejecutar el backend localmente, utiliza el siguiente comando:

```bash
node server.js
```

### Levantar contenedores con Docker

Para levantar todos los contenedores necesarios para el entorno de desarrollo, utiliza el siguiente comando:

```bash
docker-compose up -d
```

Esto iniciará todos los contenedores necesarios en segundo plano (-d).

### Variables de entorno

Aquí están las variables de entorno necesarias para el proyecto, que deben estar en un archivo .env en la raíz del proyecto:

```bash
POSTGRESDB_USER=postgres
POSTGRESDB_ROOT_PASSWORD=123456
POSTGRESDB_DATABASE=carpool_db
POSTGRESDB_LOCAL_PORT=5433
POSTGRESDB_DOCKER_PORT=5432

NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080
```
