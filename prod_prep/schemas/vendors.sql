-- Table: public.Vendors

-- DROP TABLE IF EXISTS public."Vendors";

CREATE TABLE IF NOT EXISTS public."Vendors"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "schemaData" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "vendorIds" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Vendors_pkey" PRIMARY KEY (id),
    CONSTRAINT "Vendors_name_key" UNIQUE (name),
    CONSTRAINT "Vendors_vendorIds_fkey" FOREIGN KEY ("vendorIds")
        REFERENCES public."Bundles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Vendors"
    OWNER to accuvend;