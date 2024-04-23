-- Table: public.Bundles

-- DROP TABLE IF EXISTS public."Bundles";

CREATE TABLE IF NOT EXISTS public."Bundles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productId" character varying(255) COLLATE pg_catalog."default",
    validity character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleAmount" double precision NOT NULL,
    "vendorIds" character varying(255)[] COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Bundles_pkey" PRIMARY KEY (id),
    CONSTRAINT "Bundles_bundleCode_key" UNIQUE ("bundleCode"),
    CONSTRAINT "Bundles_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES public."Products" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Bundles"
    OWNER to accuvend;
