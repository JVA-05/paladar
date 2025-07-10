-- Administradores (Corregido)
INSERT INTO "Admin" (username, password, "createdAt") 
VALUES 
('chefmaster', crypt('admin123', gen_salt('bf')),  -- Faltaba cerrar paréntesis
('supervisor', crypt('paladar456', gen_salt('bf')))  -- Paréntesis final añadido
ON CONFLICT (username) DO NOTHING;  -- Especificar columna única

-- Categorías (Correcto)
INSERT INTO "Categoria" (nombre) 
VALUES 
('Entradas'),
('Platos Principales'),
('Postres')
ON CONFLICT (nombre) DO NOTHING;  -- Conflicto en columna "nombre"

-- Subcategorías (Correcto)
INSERT INTO "Subcategoria" (nombre, "categoriaId") 
VALUES 
('Mariscos', (SELECT id FROM "Categoria" WHERE nombre = 'Platos Principales')),
('Carnes', (SELECT id FROM "Categoria" WHERE nombre = 'Platos Principales')),
('Ensaladas', (SELECT id FROM "Categoria" WHERE nombre = 'Entradas')),
('Tropicales', (SELECT id FROM "Categoria" WHERE nombre = 'Postres'))
ON CONFLICT (nombre, "categoriaId") DO NOTHING;  -- Evitar duplicados compuestos

-- Platos (Añadido ON CONFLICT)
INSERT INTO "Plato" (nombre, descripcion, precio, imagen, "subcategoriaId") 
VALUES 
('Ceviche Clásico', 'Filete de pargo fresco marinado en limón con cebolla y cilantro', 12.99, 'https://ejemplo.com/ceviche.jpg', (SELECT id FROM "Subcategoria" WHERE nombre = 'Mariscos')),
('Ropa Vieja', 'Carne desmenuzada en salsa criolla con arroz blanco y maduros', 15.50, 'https://ejemplo.com/ropa_vieja.jpg', (SELECT id FROM "Subcategoria" WHERE nombre = 'Carnes')),
('Ensalada Paladar', 'Mezcla de lechugas frescas con mango y aderezo de maracuyá', 9.75, NULL, (SELECT id FROM "Subcategoria" WHERE nombre = 'Ensaladas')),
('Flan de Coco', 'Postre cremoso de coco con caramelo', 7.99, 'https://ejemplo.com/flan.jpg', (SELECT id FROM "Subcategoria" WHERE nombre = 'Tropicales'))
ON CONFLICT (nombre, "subcategoriaId") DO NOTHING;