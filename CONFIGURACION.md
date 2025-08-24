# 🚀 Configuración de Turanchito

## 1. Configurar Supabase

### Paso 1: Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: turanchito
   - **Password**: (elige una contraseña segura)
   - **Region**: South America (São Paulo)
5. Espera a que se cree el proyecto (1-2 minutos)

### Paso 2: Obtener las credenciales
1. Una vez creado el proyecto, ve a **Settings** > **API**
2. Busca la sección **Project API keys**
3. Copia los siguientes valores:
   - **URL**: `https://tu-proyecto-id.supabase.co`
   - **anon key**: `eyJ...` (clave muy larga que empieza con eyJ)

### Paso 3: Configurar variables de entorno
1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores placeholder:

```bash
# Supabase Configuration - REEMPLAZA CON TUS VALORES REALES
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-clave-anonima-completa

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 4: Crear las tablas de la base de datos
1. En Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido completo del archivo `supabase-schema.sql`
4. Haz clic en **Run** para ejecutar el SQL

### Paso 5: Configurar Storage
1. Ve a **Storage** en el panel de Supabase
2. El bucket `property-images` debería crearse automáticamente con el SQL
3. Si no existe, créalo manualmente:
   - Nombre: `property-images`
   - Public: ✅ (marcado)

### Paso 6: Verificar Row Level Security (RLS)
1. Ve a **Authentication** > **Policies**
2. Verifica que las políticas se hayan creado correctamente
3. Deberías ver políticas para las tablas: `profiles`, `properties`, `favorites`, `property_images`

## 2. Reiniciar el servidor de desarrollo

Después de configurar todo:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run dev
```

## 3. Probar la aplicación

1. Ve a [http://localhost:3000](http://localhost:3000)
2. Debería cargar sin errores
3. Prueba registrar un usuario nuevo
4. Prueba hacer login
5. Prueba los filtros de búsqueda

## 4. Datos de prueba (opcional)

Si quieres agregar datos de prueba, puedes ejecutar este SQL adicional en Supabase:

```sql
-- Insertar datos de prueba (ejecutar después del schema principal)
INSERT INTO properties (
    title, description, price, price_usd, currency, property_type, 
    transaction_type, bedrooms, bathrooms, area_m2, city, state, 
    address, features, featured, status
) VALUES 
(
    'Hermoso Apartamento en Las Mercedes',
    'Apartamento de 3 habitaciones en la exclusiva zona de Las Mercedes, Caracas. Completamente renovado con acabados de primera calidad.',
    120000, 120000, 'USD', 'apartment', 'sale', 3, 2, 140,
    'Caracas', 'Distrito Capital',
    'Av. Principal Las Mercedes, Torre Residencial, Piso 12',
    ARRAY['Piscina', 'Gimnasio', 'Seguridad 24h', 'Estacionamiento'],
    true, 'active'
),
(
    'Casa Familiar en Maracay',
    'Amplia casa de 4 habitaciones en urbanización cerrada. Ideal para familias, con jardín y área de BBQ.',
    95000, 95000, 'USD', 'house', 'sale', 4, 3, 250,
    'Maracay', 'Aragua',
    'Urb. San Jacinto, Calle Principal',
    ARRAY['Jardín', 'BBQ', 'Garaje doble', 'Urbanización cerrada'],
    true, 'active'
),
(
    'Apartamento en Alquiler - Valencia',
    'Moderno apartamento de 2 habitaciones en el centro de Valencia. Perfecto para profesionales.',
    800, 800, 'USD', 'apartment', 'rent', 2, 2, 90,
    'Valencia', 'Carabobo',
    'Centro de Valencia, Edificio Moderno',
    ARRAY['Amoblado', 'Servicios incluidos', 'Céntrico'],
    false, 'active'
);
```

## 🆘 Solución de problemas

### Error "Invalid URL"
- Verifica que las variables de entorno estén correctamente configuradas
- Reinicia el servidor después de cambiar `.env.local`

### Error de autenticación
- Verifica que el `anon key` sea correcto y completo
- Asegúrate de que RLS esté configurado correctamente

### Las imágenes no cargan
- Verifica que el bucket `property-images` sea público
- Revisa las políticas de Storage

### ¿Necesitas ayuda?
Si tienes problemas, revisa:
1. La consola del navegador (F12)
2. Los logs del servidor de desarrollo
3. El panel de Supabase para errores

¡Ya tienes todo listo para usar Turanchito! 🏠🇻🇪