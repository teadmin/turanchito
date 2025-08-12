-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  ciudad VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  price_usd DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'VES' CHECK (currency IN ('VES', 'USD')),
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'commercial', 'land')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'rent')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_m2 DECIMAL(8,2),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(usuario_id, property_id)
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  property_interest TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property images table (for better image management)
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_state ON properties(state);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_user ON properties(usuario_id);
CREATE INDEX idx_favorites_user ON favorites(usuario_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);
CREATE INDEX idx_property_images_property ON property_images(property_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (auth.uid() = usuario_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR ALL USING (auth.uid() = usuario_id);

-- Property images policies
CREATE POLICY "Anyone can view property images" ON property_images
  FOR SELECT USING (true);

CREATE POLICY "Property owners can manage images" ON property_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_images.property_id 
      AND properties.usuario_id = auth.uid()
    )
  );

-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, ciudad)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'ciudad', 'Caracas')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Insert sample data for Venezuelan cities
INSERT INTO properties (title, description, price, price_usd, currency, property_type, transaction_type, bedrooms, bathrooms, area_m2, city, state, address, features, featured) VALUES 
('Hermosa Casa en Las Mercedes', 'Amplia casa familiar de 3 habitaciones en exclusiva zona de Las Mercedes. Cuenta con jardín, garaje para 2 carros y piscina. Ideal para familias.', 150000, 150000, 'USD', 'house', 'sale', 3, 3, 250, 'Caracas', 'Distrito Capital', 'Av. Principal Las Mercedes, Caracas', ARRAY['Piscina', 'Jardín', 'Garaje', 'Seguridad 24h'], true),
('Apartamento Moderno en El Rosal', 'Apartamento de 2 habitaciones completamente renovado en El Rosal. Excelente ubicación cerca del metro y centros comerciales.', 85000, 85000, 'USD', 'apartment', 'sale', 2, 2, 120, 'Caracas', 'Distrito Capital', 'Calle Madrid, El Rosal, Caracas', ARRAY['Aire acondicionado', 'Cocina integral', 'Vista panorámica'], false),
('Casa en Urbanización Cerrada - Maracay', 'Espectacular casa de 4 habitaciones en urbanización cerrada con vigilancia 24h. Incluye área de BBQ y jardín amplio.', 120000, 120000, 'USD', 'house', 'sale', 4, 3, 300, 'Maracay', 'Aragua', 'Urb. San Jacinto, Maracay', ARRAY['Urbanización cerrada', 'BBQ', 'Jardín', 'Vigilancia'], true),
('Apartamento en Alquiler - La Candelaria', 'Acogedor apartamento de 1 habitación en el corazón de La Candelaria. Perfecto para profesionales o estudiantes.', 350, 350, 'USD', 'apartment', 'rent', 1, 1, 60, 'Caracas', 'Distrito Capital', 'Plaza La Candelaria, Caracas', ARRAY['Amoblado', 'Servicios incluidos', 'Céntrico'], false),
('Villa de Lujo en Country Club', 'Exclusiva villa con 5 habitaciones, piscina olímpica y cancha de tenis. La mejor inversión en bienes raíces de Caracas.', 450000, 450000, 'USD', 'house', 'sale', 5, 4, 500, 'Caracas', 'Distrito Capital', 'Country Club, Caracas', ARRAY['Piscina olímpica', 'Cancha de tenis', 'Gym privado', 'Jardín botanical'], true),
('Apartamento Familiar en Base Aragua', 'Apartamento de 3 habitaciones ideal para familias. Zona tranquila y segura con excelentes colegios cercanos.', 65000, 65000, 'USD', 'apartment', 'sale', 3, 2, 140, 'Maracay', 'Aragua', 'Base Aragua, Maracay', ARRAY['Parque infantil', 'Colegios cercanos', 'Transporte público'], false);

INSERT INTO leads (name, email, phone, message, property_interest) VALUES 
('María González', 'maria@email.com', '+58414-1234567', 'Interesada en propiedades en Caracas, presupuesto hasta $100,000', 'Apartamento en Caracas'),
('Carlos Rodríguez', 'carlos@email.com', '+58412-9876543', 'Busco casa en Maracay para mi familia', 'Casa en Maracay'),
('Ana Pérez', 'ana@email.com', '+58424-5555555', 'Necesito información sobre apartamentos en alquiler', 'Apartamento en alquiler');