-- Table: public.Products

-- DROP TABLE IF EXISTS public."Products";

CREATE TABLE IF NOT EXISTS public."Products"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "masterProductCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category "enum_Products_category" NOT NULL,
    type "enum_Products_type",
    "productName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Products_pkey" PRIMARY KEY (id),
    CONSTRAINT "Products_masterProductCode_key" UNIQUE ("masterProductCode"),
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Products"
    OWNER to accuvend;
