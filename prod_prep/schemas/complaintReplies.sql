-- Table: public.ComplaintReplies

-- DROP TABLE IF EXISTS public."ComplaintReplies";

CREATE TABLE IF NOT EXISTS public."ComplaintReplies"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    message character varying(255) COLLATE pg_catalog."default" NOT NULL,
    image character varying(255) COLLATE pg_catalog."default" DEFAULT ''::character varying,
    "entityId" character varying(255) COLLATE pg_catalog."default",
    "complaintId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ComplaintReplies_pkey" PRIMARY KEY (id),
    CONSTRAINT "ComplaintReplies_complaintId_fkey" FOREIGN KEY ("complaintId")
        REFERENCES public."Complaints" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "ComplaintReplies_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ComplaintReplies"
    OWNER to postgres;
