-- Table: public.ProductCodes

-- DROP TABLE IF EXISTS public."ProductCodes";

CREATE TABLE IF NOT EXISTS public."ProductCodes"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    type "enum_ProductCodes_type" NOT NULL,
    amount double precision,
    network character varying(255) COLLATE pg_catalog."default",
    "vendType" "enum_ProductCodes_vendType" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ProductCodes_pkey" PRIMARY KEY (id),
    CONSTRAINT "ProductCodes_productCode_key" UNIQUE ("productCode"),
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ProductCodes"
    OWNER to accuvend;
