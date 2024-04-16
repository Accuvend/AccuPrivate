-- Table: public.VendorProducts

-- DROP TABLE IF EXISTS public."VendorProducts";

CREATE TABLE IF NOT EXISTS public."VendorProducts"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendorId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleAmount" double precision,
    commission double precision NOT NULL,
    bonus double precision NOT NULL,
    "vendorCode" character varying(255) COLLATE pg_catalog."default",
    "vendorName" character varying(255) COLLATE pg_catalog."default",
    "schemaData" jsonb,
    "vendorHttpUrl" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleId" character varying(255) COLLATE pg_catalog."default",
    "bundleCode" character varying(255) COLLATE pg_catalog."default",
    "bundleName" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "VendorProducts_pkey" PRIMARY KEY (id),
    CONSTRAINT "VendorProducts_vendorId_bundleId_key" UNIQUE ("vendorId", "bundleId"),
    CONSTRAINT "VendorProducts_bundleId_fkey" FOREIGN KEY ("bundleId")
        REFERENCES public."Bundles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "VendorProducts_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES public."Products" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "VendorProducts_vendorId_fkey" FOREIGN KEY ("vendorId")
        REFERENCES public."Vendors" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."VendorProducts"
    OWNER to postgres;
