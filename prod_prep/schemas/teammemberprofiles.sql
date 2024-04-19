-- Table: public.TeamMemberProfiles

-- DROP TABLE IF EXISTS public."TeamMemberProfiles";

CREATE TABLE IF NOT EXISTS public."TeamMemberProfiles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    "partnerId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "TeamMemberProfiles_pkey" PRIMARY KEY (id),
    CONSTRAINT "TeamMemberProfiles_partnerId_fkey" FOREIGN KEY ("partnerId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."TeamMemberProfiles"
    OWNER to postgres;
