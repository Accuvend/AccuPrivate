-- Table: public.MockEndpointData

-- DROP TABLE IF EXISTS public."MockEndpointData";

CREATE TABLE IF NOT EXISTS public."MockEndpointData"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendorName" character varying(255) COLLATE pg_catalog."default",
    "vendorCode" text COLLATE pg_catalog."default",
    "vendorResponse" json,
    "httpCode" integer,
    "apiType" text COLLATE pg_catalog."default",
    "apiStatusType" "enum_MockEndpointData_apiStatusType",
    activated boolean NOT NULL DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "MockEndpointData_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MockEndpointData"
    OWNER to accuvend;
