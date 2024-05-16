-- Table: public.Events

-- DROP TABLE IF EXISTS public."Events";

CREATE TABLE IF NOT EXISTS public."Events"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "eventTimestamp" timestamp with time zone NOT NULL,
    status "enum_Events_status" NOT NULL DEFAULT 'PENDING'::"enum_Events_status",
    "eventType" "enum_Events_eventType" NOT NULL,
    "eventText" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    source character varying(255) COLLATE pg_catalog."default" NOT NULL,
    payload text COLLATE pg_catalog."default" NOT NULL,
    "transactionId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY (id),
    CONSTRAINT "Events_transactionId_fkey" FOREIGN KEY ("transactionId")
        REFERENCES public."Transactions" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Events"
    OWNER to accuvend;
