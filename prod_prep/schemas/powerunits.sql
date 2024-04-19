-- Table: public.PowerUnits

-- DROP TABLE IF EXISTS public."PowerUnits";

CREATE TABLE IF NOT EXISTS public."PowerUnits"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    disco character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "discoLogo" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    superagent character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT '0'::character varying,
    "tokenNumber" integer DEFAULT 0,
    token character varying(255) COLLATE pg_catalog."default",
    "tokenUnits" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT '0'::character varying,
    "tokenFromVend" character varying(255) COLLATE pg_catalog."default",
    "meterId" character varying(255) COLLATE pg_catalog."default",
    "transactionId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PowerUnits_pkey" PRIMARY KEY (id),
    CONSTRAINT "PowerUnits_meterId_fkey" FOREIGN KEY ("meterId")
        REFERENCES public."Meters" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "PowerUnits_transactionId_fkey" FOREIGN KEY ("transactionId")
        REFERENCES public."Transactions" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PowerUnits"
    OWNER to postgres;
