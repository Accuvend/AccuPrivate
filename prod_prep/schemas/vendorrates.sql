-- Table: public.VendorRates

-- DROP TABLE IF EXISTS public."VendorRates";

CREATE TABLE IF NOT EXISTS public."VendorRates"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendorName" "enum_VendorRates_vendorName" NOT NULL,
    "discoCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    commission double precision NOT NULL,
    bonus double precision NOT NULL DEFAULT '0'::double precision,
    title character varying(255) COLLATE pg_catalog."default",
    validity character varying(255) COLLATE pg_catalog."default",
    "productCodeId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "VendorRates_pkey" PRIMARY KEY (id),
    CONSTRAINT "VendorRates_productCodeId_fkey" FOREIGN KEY ("productCodeId")
        REFERENCES public."ProductCodes" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."VendorRates"
    OWNER to accuvend;
