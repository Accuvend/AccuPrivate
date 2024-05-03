-- Table: public.ZohoIntegrationSettings

-- DROP TABLE IF EXISTS public."ZohoIntegrationSettings";

CREATE TABLE IF NOT EXISTS public."ZohoIntegrationSettings"
(
    id integer NOT NULL DEFAULT nextval('"ZohoIntegrationSettings_id_seq"'::regclass),
    refreshtoken character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    authorizationcode character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    accesstoken character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    clientid character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    clientsecret character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    redirecturl character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "organizationId" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ZohoIntegrationSettings_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ZohoIntegrationSettings"
    OWNER to accuvend;