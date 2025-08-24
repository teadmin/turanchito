# 🏠 Turanchito - Plataforma Inmobiliaria de Venezuela

Turanchito es una plataforma inmobiliaria moderna y completa enfocada en el mercado venezolano. Construida con Next.js 15, Supabase y Tailwind CSS, ofrece una experiencia de usuario excepcional para la compra, venta y alquiler de propiedades en Venezuela.

## ✨ Características

### 🔍 **SEO Optimizado**
- Más de 200 páginas optimizadas para ciudades venezolanas
- URLs amigables: `/comprar-casa-en-caracas`, `/alquilar-apartamento-en-maracay`
- Meta tags dinámicos para cada ciudad y tipo de propiedad
- Sitemap automático con todas las combinaciones de búsqueda

### 🏡 **Gestión de Propiedades**
- Listado completo de propiedades con filtros avanzados
- Soporte para casas, apartamentos, locales comerciales y terrenos
- Galería de imágenes con almacenamiento en Supabase
- Sistema de propiedades destacadas
- Búsqueda por ubicación, precio, tipo y características

### 👤 **Sistema de Usuarios**
- Autenticación completa con Supabase Auth
- Perfiles de usuario personalizables
- Sistema de favoritos
- Gestión de propiedades publicadas
- Historial de búsquedas y actividades

### 🌎 **Cobertura Nacional**
- Soporte para las 24 estados de Venezuela
- Más de 200 ciudades y pueblos incluidos
- Páginas específicas para cada ubicación
- Datos actualizados de ubicaciones venezolanas

### 📱 **Responsive Design**
- Diseño móvil-first completamente responsive
- Interfaz moderna con Tailwind CSS
- Componentes reutilizables y accesibles
- Experiencia consistente en todos los dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15 con App Router
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: React Hot Toast
- **Mapas**: React Leaflet
- **TypeScript**: Para tipado estático

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm, yarn, pnpm o bun
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone [repositorio-url]
cd turanchito
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env.local` y configura:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script SQL en `supabase-schema.sql` para crear las tablas
3. Configura las políticas RLS (Row Level Security)
4. Crea un bucket llamado `property-images` en Storage

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── [...slug]/         # Páginas dinámicas SEO
│   ├── buscar/            # Página de búsqueda
│   ├── login/             # Autenticación
│   ├── registro/          # Registro de usuarios
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes base
│   ├── PropertyCard.tsx   # Tarjeta de propiedad
│   ├── SearchFilters.tsx  # Filtros de búsqueda
│   └── Header.tsx         # Navegación
├── contexts/              # Contextos de React
│   └── AuthContext.tsx    # Contexto de autenticación
├── lib/                   # Utilidades y configuración
│   ├── supabase.ts        # Cliente de Supabase
│   ├── utils.ts           # Funciones utilitarias
│   └── venezuelan-cities-seo.ts # Datos SEO de ciudades
└── styles/                # Estilos globales
```

## 🎯 Funcionalidades Principales

### Búsqueda Avanzada
- Filtro por tipo de propiedad (casa, apartamento, comercial, terreno)
- Filtro por tipo de transacción (venta, alquiler)
- Filtro por ubicación (estado, ciudad)
- Filtro por precio (mín/máx)
- Filtro por características (habitaciones, baños, área)
- Búsqueda por texto libre

### Sistema de Favoritos
- Guardar propiedades favoritas
- Lista personal de favoritos
- Acceso rápido desde el menú de usuario

### Gestión de Propiedades
- Publicar nuevas propiedades
- Editar propiedades existentes
- Subir múltiples imágenes
- Gestionar estado (activa, vendida, inactiva)

### SEO y Performance
- Páginas estáticas generadas para mejor SEO
- Imágenes optimizadas con Next.js Image
- Lazy loading de componentes
- Sitemap automático
- Meta tags dinámicos

## 🌐 Ciudades Soportadas

Turanchito incluye soporte completo para:

- **24 Estados**: Todos los estados de Venezuela
- **200+ Ciudades**: Principales ciudades y pueblos
- **SEO Optimizado**: Páginas específicas para cada ubicación

### Estados incluidos:
- Distrito Capital (Caracas)
- Miranda (Los Teques, Guarenas, Guatire)
- Zulia (Maracaibo, Cabimas)
- Carabobo (Valencia, Puerto Cabello)
- Aragua (Maracay, La Victoria)
- Y muchos más...

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de Entorno en Producción
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_produccion
NEXT_PUBLIC_APP_URL=https://turanchito.com
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si necesitas ayuda:

- 📧 Email: soporte@turanchito.com
- 💬 Crear un Issue en GitHub
- 📱 WhatsApp: +58 XXX-XXXXXXX

## 🎉 Acknowledgments

- Inspirado en Idealista.com para el mercado venezolano
- Construido con amor para Venezuela 🇻🇪
- Gracias a la comunidad de desarrolladores venezolanos

---

**Turanchito** - *Tu hogar en Venezuela* 🏠🇻🇪
