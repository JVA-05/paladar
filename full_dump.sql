--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.subcategoria DROP CONSTRAINT "subcategoria_categoriaId_fkey";
ALTER TABLE ONLY public.plato DROP CONSTRAINT "plato_subcategoriaId_fkey";
ALTER TABLE ONLY public.plato DROP CONSTRAINT "plato_categoriaId_fkey";
DROP INDEX public.categoria_nombre_key;
DROP INDEX public."Admin_username_key";
ALTER TABLE ONLY public.subcategoria DROP CONSTRAINT subcategoria_pkey;
ALTER TABLE ONLY public.plato DROP CONSTRAINT plato_pkey;
ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."Admin" DROP CONSTRAINT "Admin_pkey";
ALTER TABLE public.subcategoria ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.plato ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.categoria ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Admin" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.subcategoria_id_seq;
DROP TABLE public.subcategoria;
DROP SEQUENCE public.plato_id_seq;
DROP TABLE public.plato;
DROP SEQUENCE public.categoria_id_seq;
DROP TABLE public.categoria;
DROP TABLE public._prisma_migrations;
DROP SEQUENCE public."Admin_id_seq";
DROP TABLE public."Admin";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre text NOT NULL
);


--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: plato; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plato (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    precio double precision NOT NULL,
    imagen text,
    "subcategoriaId" integer,
    "categoriaId" integer
);


--
-- Name: plato_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.plato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: plato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.plato_id_seq OWNED BY public.plato.id;


--
-- Name: subcategoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subcategoria (
    id integer NOT NULL,
    nombre text NOT NULL,
    "categoriaId" integer NOT NULL
);


--
-- Name: subcategoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subcategoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subcategoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subcategoria_id_seq OWNED BY public.subcategoria.id;


--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: plato id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plato ALTER COLUMN id SET DEFAULT nextval('public.plato_id_seq'::regclass);


--
-- Name: subcategoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subcategoria ALTER COLUMN id SET DEFAULT nextval('public.subcategoria_id_seq'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Admin" (id, username, password, "createdAt") FROM stdin;
1	admin	$2b$10$F1v/IGKmDf4IzsYZqljgM.XY/Cv4iFbmPKU2PtZnLXwRlCc2etDbe	2025-05-24 17:38:47.285
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6b03ba3d-2215-4f3f-a4c7-71607302d4e4	bb6c8534bedc67e24091c61671cbf4151348138f1853a5607af43ecf4302752b	2025-05-24 13:37:14.525814-04	20250524173714_init	\N	\N	2025-05-24 13:37:14.466613-04	1
810c7135-d0f4-4569-83e3-502abeec286c	d19294e5696e0838eb6fb53fc9e366818df8a95db3798fe1a1418d17aa30b92f	2025-05-24 19:28:32.638054-04	20250524232832_cascade_delete	\N	\N	2025-05-24 19:28:32.619027-04	1
aaed000c-d4a0-4f99-a26a-f472e7df3afd	33bd85ce9b5aa03e32737ff925ee8e29cc7cb75cacd1703655133ff5bd349688	2025-07-07 15:12:28.268728-04	20250707191227_add_direct_platos_to_categoria	\N	\N	2025-07-07 15:12:28.259079-04	1
9738ffb9-39f5-462e-bf2a-34149cd5f000	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-07-12 14:42:42.617925-04	20250712184210_init	\N	\N	2025-07-12 14:42:42.608933-04	1
\.


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categoria (id, nombre) FROM stdin;
1	Platos Fuertes
2	Postres
3	Bebida
20	Completas
\.


--
-- Data for Name: plato; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.plato (id, nombre, descripcion, precio, imagen, "subcategoriaId", "categoriaId") FROM stdin;
58	completa1	asdasda	12312	\N	\N	20
6	Jugo de Mango	Jugo natural de mango	3.5	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751659060/paladar/platos/plato_6.jpg	3	\N
15	Helado de Vainilla	Helado artesanal de vainill	4	/images/helado-vainilla.jpg	8	\N
47	ProbandoCloudinary	asdas	200	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751659521/paladar/platos/cyltlvoso9g4b2q8coh2.jpg	3	\N
11	Ceviche	Pescado marinado en jugo de limón con especias y cebolla	14	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751659917/paladar/platos/plato_11.jpg	6	\N
48	ProbandoCloudinary	asdsa	200	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751659976/paladar/platos/t69zkyuee7sucbvszp8z.jpg	9	\N
21	Refresco limon	Eres anormal o q es refresco	500	\N	2	\N
16	Helado de Fresa	Helado artesanal de fres	4	/images/helado-fresa.jpg	8	\N
59	new	asd	12	\N	\N	20
13	Torta de Chocolate	Bizcocho húmedo de chocolate con cobertura de ganache	500	/images/torta-chocolate.jpg	7	\N
7	Bife de chorizo	Corte de carne argentino, cocido a la parrilla	90	/images/bife-chorizo.jpg	4	\N
50	NuevoPlato	\N	1000	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751815084/paladar/platos/szhnmhwxailtyehgduzh.jpg	5	\N
17	Flan	Postre tradicional con caramel	4.5	/images/flan.jpg	9	\N
37	Probar	asdsa	121	\N	7	\N
40	ProbarImagen	asd	123	\N	7	\N
3	Coca-Cola	Bebida gaseosa clásica	2.5	https://res.cloudinary.com/dfbwtcyem/image/upload/v1749368067/paladar/platos/sdj7szhlalp2g6b8d7vd.jpg	2	\N
42	12	asdas	12	\N	11	\N
43	Probando imagen	asdsadd	12312	https://res.cloudinary.com/dfbwtcyem/image/upload/v1749769865/paladar/platos/ripvkeahdbnezseqg8yt.png	4	\N
45	Probar Imagen2	12312	123	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751658458/paladar/platos/kw1seb8hkw80etgj7kqa.jpg	3	\N
4	Sprite	Refresco de limón	2.5	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751658555/paladar/platos/olug0jrmmpgejf5zcu44.jpg	2	\N
5	Jugo de Naranja	Jugo natural de naranja	3	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751658918/paladar/platos/qog5xhyohzf9lmlfq8pj.jpg	3	\N
51	Completa	asdas	121	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751916047/paladar/platos/dyepbikf4uwqjhzbo3x3.jpg	5	\N
52	Jorge	asd	123	https://res.cloudinary.com/dfbwtcyem/image/upload/v1751917477/paladar/platos/t7piisagjakljyma3wkv.jpg	\N	20
14	Tiramisú	Postre italiano con café, mascarpone y cacao	6.5	/images/tiramisu.jpg	5	\N
53	a	\N	12	\N	\N	\N
54	a	asdasd	123	\N	\N	\N
55	probar completa	adasdas	1212	\N	\N	\N
56	probar si existen	asdad	1231	\N	5	\N
57	sdfds	adasd	12121	\N	\N	20
\.


--
-- Data for Name: subcategoria; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subcategoria (id, nombre, "categoriaId") FROM stdin;
2	Gaseosas	3
3	Jugos Naturales	3
4	Carne Roja	1
5	Carne Blanca	1
6	Mariscos	1
7	Tortas	2
8	Helados	2
9	Dulces Tradicionales	2
11	Pescados	1
\.


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


--
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categoria_id_seq', 20, true);


--
-- Name: plato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.plato_id_seq', 59, true);


--
-- Name: subcategoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subcategoria_id_seq', 25, true);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: plato plato_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plato
    ADD CONSTRAINT plato_pkey PRIMARY KEY (id);


--
-- Name: subcategoria subcategoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subcategoria
    ADD CONSTRAINT subcategoria_pkey PRIMARY KEY (id);


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- Name: categoria_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categoria_nombre_key ON public.categoria USING btree (nombre);


--
-- Name: plato plato_categoriaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plato
    ADD CONSTRAINT "plato_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES public.categoria(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plato plato_subcategoriaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plato
    ADD CONSTRAINT "plato_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES public.subcategoria(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subcategoria subcategoria_categoriaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subcategoria
    ADD CONSTRAINT "subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES public.categoria(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

