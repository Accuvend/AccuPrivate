-- Table: public.DiscoStatuses

-- DROP TABLE IF EXISTS public."DiscoStatuses";

CREATE TABLE IF NOT EXISTS public."DiscoStatuses"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status "enum_DiscoStatuses_status",
    disco character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "DiscoStatuses_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."DiscoStatuses"
    OWNER to postgres;
