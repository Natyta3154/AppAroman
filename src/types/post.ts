


// src/types/Post.ts
export interface CategoriaPost {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Post {
  id: number;
  titulo: string;
  descripcion: string;
  contenido?: string;
  imagenUrl: string;
  category?: CategoriaPost;
  fecha?: string;
  comentarios?: any[]; // si vas a manejar comentarios como array
}

