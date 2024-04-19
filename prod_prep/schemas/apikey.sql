-- Table: public.ApiKeys

-- DROP TABLE IF EXISTS public."ApiKeys";

CREATE TABLE IF NOT EXISTS public."ApiKeys"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "partnerId" character varying(255) COLLATE pg_catalog."default",
    active boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "lastUsed" timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY (id),
    CONSTRAINT "ApiKeys_partnerId_fkey" FOREIGN KEY ("partnerId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ApiKeys"
    OWNER to postgres;
