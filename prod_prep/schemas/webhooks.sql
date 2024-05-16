-- Table: public.WebHooks

-- DROP TABLE IF EXISTS public."WebHooks";

CREATE TABLE IF NOT EXISTS public."WebHooks"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    url character varying(255) COLLATE pg_catalog."default",
    "partnerId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "WebHooks_pkey" PRIMARY KEY (id),
    CONSTRAINT "WebHooks_partnerId_fkey" FOREIGN KEY ("partnerId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."WebHooks"
    OWNER to accuvend;
