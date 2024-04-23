-- Table: public.Transactions

-- DROP TABLE IF EXISTS public."Transactions";

CREATE TABLE IF NOT EXISTS public."Transactions"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT '0'::character varying,
    "tokenFromVend" character varying(255) COLLATE pg_catalog."default",
    "tokenFromRequery" character varying(255) COLLATE pg_catalog."default",
    status "enum_Transactions_status" NOT NULL DEFAULT 'PENDING'::"enum_Transactions_status",
    "paymentType" "enum_Transactions_paymentType" NOT NULL DEFAULT 'PAYMENT'::"enum_Transactions_paymentType",
    "transactionTimestamp" timestamp with time zone NOT NULL,
    disco character varying(255) COLLATE pg_catalog."default",
    "bankRefId" character varying(255) COLLATE pg_catalog."default",
    "bankComment" character varying(255) COLLATE pg_catalog."default",
    superagent character varying(255) COLLATE pg_catalog."default" NOT NULL,
    reference character varying(255) COLLATE pg_catalog."default",
    "retryRecord" jsonb DEFAULT '[]'::jsonb,
    "productType" character varying(255) COLLATE pg_catalog."default",
    "productCodeId" character varying(255) COLLATE pg_catalog."default",
    "irechargeAccessToken" character varying(255) COLLATE pg_catalog."default",
    "vendorReferenceId" character varying(255) COLLATE pg_catalog."default",
    "networkProvider" character varying(255) COLLATE pg_catalog."default",
    "bundleId" character varying(255) COLLATE pg_catalog."default",
    "previousVendors" character varying(255)[] COLLATE pg_catalog."default",
    "userId" character varying(255) COLLATE pg_catalog."default",
    "transactionType" "enum_Transactions_transactionType",
    "partnerId" character varying(255) COLLATE pg_catalog."default",
    "powerUnitId" character varying(255) COLLATE pg_catalog."default",
    "meterId" character varying(255) COLLATE pg_catalog."default",
    channel character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT '2024-04-14 16:11:57+01'::timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL DEFAULT '2024-04-14 16:11:57+01'::timestamp with time zone,
    CONSTRAINT "Transactions_pkey" PRIMARY KEY (id),
    CONSTRAINT "Transactions_bankRefId_key" UNIQUE ("bankRefId"),
    CONSTRAINT "Transactions_bundleId_fkey" FOREIGN KEY ("bundleId")
        REFERENCES public."Bundles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "Transactions_meterId_fkey" FOREIGN KEY ("meterId")
        REFERENCES public."Meters" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "Transactions_partnerId_fkey" FOREIGN KEY ("partnerId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Transactions"
    OWNER to accuvend;
