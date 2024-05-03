-- Table: public.ZohoIntegrationSettings

-- DROP TABLE IF EXISTS public."ZohoIntegrationSettings";

CREATE TABLE IF NOT EXISTS public."ZohoIntegrationSettings"
(
    id integer NOT NULL DEFAULT nextval('"ZohoIntegrationSettings_id_seq"'::regclass),
    refreshtoken character varying(255) COLLATE pg_catalog."default" NOT NULL,
    authorizationcode character varying(255) COLLATE pg_catalog."default" NOT NULL,
    accesstoken character varying(255) COLLATE pg_catalog."default" NOT NULL,
    clientid character varying(255) COLLATE pg_catalog."default" NOT NULL,
    clientsecret character varying(255) COLLATE pg_catalog."default" NOT NULL,
    redirecturl character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "organizationId" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ZohoIntegrationSettings_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ZohoIntegrationSettings"
    OWNER to accuvend;