-- Table: public.PartnerProfiles

-- DROP TABLE IF EXISTS public."PartnerProfiles";

CREATE TABLE IF NOT EXISTS public."PartnerProfiles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "companyName" character varying(255) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default",
    "partnerCode" character varying(255) COLLATE pg_catalog."default",
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sec character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PartnerProfiles_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PartnerProfiles"
    OWNER to accuvend;
