-- Table: public.Passwords

-- DROP TABLE IF EXISTS public."Passwords";

CREATE TABLE IF NOT EXISTS public."Passwords"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "entityId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Passwords_pkey" PRIMARY KEY (id),
    CONSTRAINT "Passwords_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Passwords"
    OWNER to postgres;
