-- Table: public.Complaints

-- DROP TABLE IF EXISTS public."Complaints";

CREATE TABLE IF NOT EXISTS public."Complaints"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category character varying(255) COLLATE pg_catalog."default" NOT NULL,
    message character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    image character varying(255) COLLATE pg_catalog."default" DEFAULT ''::character varying,
    "entityId" character varying(255) COLLATE pg_catalog."default",
    status "enum_Complaints_status" NOT NULL DEFAULT 'PENDING'::"enum_Complaints_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Complaints_pkey" PRIMARY KEY (id),
    CONSTRAINT "Complaints_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Complaints"
    OWNER to accuvend;
