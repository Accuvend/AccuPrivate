-- Table: public.Meters

-- DROP TABLE IF EXISTS public."Meters";

CREATE TABLE IF NOT EXISTS public."Meters"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "meterNumber" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    disco character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Meters_pkey" PRIMARY KEY (id),
    CONSTRAINT "Meters_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Meters"
    OWNER to accuvend;
