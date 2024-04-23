-- Table: public.Entities

-- DROP TABLE IF EXISTS public."Entities";

CREATE TABLE IF NOT EXISTS public."Entities"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status jsonb NOT NULL,
    "profilePicture" character varying(255) COLLATE pg_catalog."default",
    "roleId" character varying(255) COLLATE pg_catalog."default",
    "teamMemberProfileId" character varying(255) COLLATE pg_catalog."default",
    "partnerProfileId" character varying(255) COLLATE pg_catalog."default",
    "userId" character varying(255) COLLATE pg_catalog."default",
    "notificationSettings" jsonb DEFAULT '{"login": true, "logout": true, "failedTransactions": true}'::jsonb,
    "requireOTPOnLogin" boolean DEFAULT false,
    "phoneNumber" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Entities_pkey" PRIMARY KEY (id),
    CONSTRAINT "Entities_email_key" UNIQUE (email),
    CONSTRAINT "Entities_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "Entities_roleId_fkey" FOREIGN KEY ("roleId")
        REFERENCES public."Roles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT "Entities_teamMemberProfileId_fkey" FOREIGN KEY ("teamMemberProfileId")
        REFERENCES public."TeamMemberProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "Entities_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Entities"
    OWNER to accuvend;
