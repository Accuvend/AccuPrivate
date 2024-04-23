-- Table: public.Notifications

-- DROP TABLE IF EXISTS public."Notifications";

CREATE TABLE IF NOT EXISTS public."Notifications"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    heading character varying(255) COLLATE pg_catalog."default" NOT NULL,
    read boolean NOT NULL DEFAULT false,
    "eventId" character varying(255) COLLATE pg_catalog."default",
    "entityId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "timeStamp" character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT '2024-04-14T16:11:57+01:00'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Notifications_pkey" PRIMARY KEY (id),
    CONSTRAINT "Notifications_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "Notifications_eventId_fkey" FOREIGN KEY ("eventId")
        REFERENCES public."Events" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Notifications"
    OWNER to accuvend;
