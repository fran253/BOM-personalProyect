import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase en .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para las tablas
export type PerfilUsuario = {
  id: string
  nombre_usuario: string
  email: string
  avatar_url?: string
  rol: 'admin' | 'usuario'
  esta_baneado: boolean
  creado_en: string
  actualizado_en: string
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  color: string;
  imagen_url: string;
  imagen_hero: string;     
  frase: string;            
  autor_frase: string;     
  orden_visualizacion: number;
  creado_en: string;
}
export type PanelManga = {
  id: string
  titulo: string
  descripcion?: string
  imagen_url: string
  categoria_id?: string
  creado_por?: string
  cantidad_likes: number
  es_destacado: boolean
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  creado_en: string
  actualizado_en: string
}

export type Favorito = {
  id: string
  usuario_id: string
  panel_id: string
  creado_en: string
}

export type Reporte = {
  id: string
  panel_id: string
  reportado_por?: string
  razon: 'inapropiado' | 'ofensivo' | 'spam' | 'derechos_autor' | 'otro'
  descripcion?: string
  estado: 'pendiente' | 'revisando' | 'resuelto' | 'desestimado'
  creado_en: string
  resuelto_en?: string
  resuelto_por?: string
}