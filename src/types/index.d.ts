export type Plato = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: string;
  subcategoriaId: number;
};

export type Subcategoria = {
  id: number;
  nombre: string;
  categoriaId: number;
  platos?: Plato[];
};

export type Categoria = {
  id: number;
  nombre: string;
  subcategorias?: Subcategoria[];
};