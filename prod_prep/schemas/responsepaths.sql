-- Table: public.ResponsePaths

-- DROP TABLE IF EXISTS public."ResponsePaths";

CREATE TABLE IF NOT EXISTS public."ResponsePaths"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vendor character varying(255) COLLATE pg_catalog."default" NOT NULL,
    path character varying(255) COLLATE pg_catalog."default",
    "accuvendRefCode" character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    "requestType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "forErrorResponses" boolean,
    CONSTRAINT "ResponsePaths_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ResponsePaths"
    OWNER to postgres;
