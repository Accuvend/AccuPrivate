-- Table: public.ZohoIntegrationSettings

-- DROP TABLE IF EXISTS public."ZohoIntegrationSettings";

CREATE TABLE IF NOT EXISTS public."ZohoIntegrationSettings"
(
    id integer NOT NULL DEFAULT,
    refreshtoken character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    authorizationcode character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    accesstoken character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    clientid character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    clientsecret character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    redirecturl character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "organizationId" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "departmentId" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ZohoIntegrationSettings_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ZohoIntegrationSettings"
    OWNER to accuvend;

--
-- TOC entry 3154 (class 0 OID 0)
-- Dependencies: 226
-- Name: ZohoIntegrationSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: accuvend
--

ALTER SEQUENCE public."ZohoIntegrationSettings_id_seq" OWNED BY public."ZohoIntegrationSettings".id;


--
-- TOC entry 3006 (class 2604 OID 2923179)
-- Name: ZohoIntegrationSettings id; Type: DEFAULT; Schema: public; Owner: accuvend
--

ALTER TABLE ONLY public."ZohoIntegrationSettings" ALTER COLUMN id SET DEFAULT nextval('public."ZohoIntegrationSettings_id_seq"'::regclass);


--
-- TOC entry 3155 (class 0 OID 0)
-- Dependencies: 226
-- Name: ZohoIntegrationSettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: accuvend
--

SELECT pg_catalog.setval('public."ZohoIntegrationSettings_id_seq"', 1, false);


--
-- TOC entry 3016 (class 2606 OID 2923191)
-- Name: ZohoIntegrationSettings ZohoIntegrationSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: accuvend
--

ALTER TABLE ONLY public."ZohoIntegrationSettings"
    ADD CONSTRAINT "ZohoIntegrationSettings_pkey" PRIMARY KEY (id);


-- Completed on 2024-05-05 04:19:53 WAT

--
-- PostgreSQL database dump complete
--