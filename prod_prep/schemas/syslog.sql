-- Table: public.SysLogs

-- DROP TABLE IF EXISTS public."SysLogs";

CREATE TABLE IF NOT EXISTS public."SysLogs"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    level character varying(255) COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    "transactionId" character varying(255) COLLATE pg_catalog."default",
    "logType" character varying(255) COLLATE pg_catalog."default",
    meta jsonb,
    description jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "SysLogs_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."SysLogs"
    OWNER to postgres;
