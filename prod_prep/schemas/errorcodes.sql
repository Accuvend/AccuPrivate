-- Table: public.ErrorCodes

-- DROP TABLE IF EXISTS public."ErrorCodes";

CREATE TABLE IF NOT EXISTS public."ErrorCodes"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "httpCode" integer,
    category character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    "accuvendDescription" character varying(255) COLLATE pg_catalog."default",
    "accuvendMasterResponseCode" integer,
    request character varying(255) COLLATE pg_catalog."default",
    "STATUS_CODE" character varying(255) COLLATE pg_catalog."default",
    "STATUS_BOOLEAN" boolean,
    "STATUS" character varying(255) COLLATE pg_catalog."default",
    "CODE" character varying(255) COLLATE pg_catalog."default",
    "MSG" character varying(255) COLLATE pg_catalog."default",
    vendor character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ErrorCodes_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ErrorCodes"
    OWNER to accuvend;
