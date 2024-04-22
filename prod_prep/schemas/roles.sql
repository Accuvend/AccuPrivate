-- Table: public.Roles

-- DROP TABLE IF EXISTS public."Roles";

CREATE TABLE IF NOT EXISTS public."Roles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    type character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Roles_pkey" PRIMARY KEY (id),
    CONSTRAINT "Roles_name_key" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Roles"
    OWNER to accuvend;
