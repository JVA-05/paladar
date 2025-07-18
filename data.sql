--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-07-12 16:27:53

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

--
-- TOC entry 4923 (class 0 OID 17910)
-- Dependencies: 219
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, username, password, "createdAt") FROM stdin;
1	admin	$2b$10$F1v/IGKmDf4IzsYZqljgM.XY/Cv4iFbmPKU2PtZnLXwRlCc2etDbe	2025-05-24 17:38:47.285
\.


--
-- TOC entry 4921 (class 0 OID 17896)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6b03ba3d-2215-4f3f-a4c7-71607302d4e4	bb6c8534bedc67e24091c61671cbf4151348138f1853a5607af43ecf4302752b	2025-05-24 13:37:14.525814-04	20250524173714_init	\N	\N	2025-05-24 13:37:14.466613-04	1
810c7135-d0f4-4569-83e3-502abeec286c	d19294e5696e0838eb6fb53fc9e366818df8a95db3798fe1a1418d17aa30b92f	2025-05-24 19:28:32.638054-04	20250524232832_cascade_delete	\N	\N	2025-05-24 19:28:32.619027-04	1
aaed000c-d4a0-4f99-a26a-f472e7df3afd	33bd85ce9b5aa03e32737ff925ee8e29cc7cb75cacd1703655133ff5bd349688	2025-07-07 15:12:28.268728-04	20250707191227_add_direct_platos_to_categoria	\N	\N	2025-07-07 15:12:28.259079-04	1
9738ffb9-39f5-462e-bf2a-34149cd5f000	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-07-12 14:42:42.617925-04	20250712184210_init	\N	\N	2025-07-12 14:42:42.608933-04	1
\.


--
-- TOC entry 4925 (class 0 OID 17920)
-- Dependencies: 221
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id, nombre) FROM stdin;
1	Platos Fuertes
2	Postres
3	Bebida
20	Completas
\.


--
-- TOC entry 4927 (class 0 OID 17929)
-- Dependencies: 223
-- Data for Name: subcategoria; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- TOC entry 4929 (class 0 OID 17938)
-- Dependencies: 225
-- Data for Name: plato; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 218
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 220
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 20, true);


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 224
-- Name: plato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plato_id_seq', 59, true);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 222
-- Name: subcategoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategoria_id_seq', 25, true);


-- Completed on 2025-07-12 16:27:54

--
-- PostgreSQL database dump complete
--

