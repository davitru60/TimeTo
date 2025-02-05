# TimeTo
## 🧩 Introducción al proyecto
TimeTo ofrece a un equipo de diseñadores una plataforma digital donde pueden añadir y gestionar sus proyectos de manera sencilla y profesional. En un mundo donde la presencia digital es clave para destacar y atraer oportunidades, esta plataforma permite a los diseñadores mostrar sus trabajos de forma efectiva, reflejando los valores y la personalidad de sus marcas.

El objetivo principal es proporcionar una herramienta que facilite la organización y presentación de proyectos, ayudando a los diseñadores a destacar y conectar con su público objetivo. Además, la plataforma es flexible y permite actualizar fácilmente los portfolios para adaptarse a las nuevas tendencias y necesidades del mercado.

## 💻 Características
### Requisitos funcionales de los usuarios
- **Registro e inicio de sesión**: Validación en tiempo real al registrar datos y opción de autenticación con Google o credenciales propias.
- **Barra de navegación**: Acceso a secciones clave: Inicio, Proyectos, Aprende, Sobre Nosotros y Comunidad, con menús desplegables.
- **Pantalla de inicio**: Landing page atractiva con un texto motivador y un botón que dirige a servicios y contacto.
- **Gestión de proyectos**: Visualización de todos los proyectos y proyectos recomendados basados en gustos del usuario.
- **Perfil de usuario**: Gestión de gustos y categorías personalizadas.

### Requisitos funcionales del administrador
- **Gestión de proyectos y categorías**: Crear, editar y eliminar proyectos y categorías asignadas.
- **Modo edición de proyectos**: Inclusión de imágenes y descripciones dinámicas con opciones de edición/eliminación. Posicionamiento de elementos mediante Drag & Drop.
- **Vista dividida**: Modo de pantalla dividida para gestionar información y vista previa del proyecto.

## 🏛️ Tecnologías empleadas
- **Frontend**: Angular 17, Tailwind
- **Backend**: Node.js con Express.js
- **Subida de imagenes**: Dropbox

## 💭 Puesta en marcha de la aplicación
Para instalar las dependencias necesarias en la parte del frontend, abriremos una terminal en la carpeta frontend y usaremos el siguiente comando:
```
npm install
```
Para ejecutar el script de construcción definido en el archivo `package.json` usaremos el siguiente comando:
```
npm run build
```
Esto mismo haremos con la carpeta de backend.
### ✅ Ejecutar migraciones y seeders para crear la base de datos
Para disponer de las tablas en la base de datos y de registros en ella vamos a necesitar ejecutar los siguientes comandos:
```
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate --env development
```

### 🖱️ Iniciar los servidores de frontend y backend
Para iniciar el frontend, abriremos en una terminal la carpeta de frontend y escribiremos el siguiente comando:
```
ng s -o
```

Para iniciar el backend, abriremos en una terminal la carpeta de backend y escribiremos el siguiente comando:
```
npm run dev
```


