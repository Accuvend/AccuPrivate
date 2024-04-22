-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    "phoneNumber" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id)
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."Users"
    OWNER to accuvend;

-- Table: public.Meters

-- DROP TABLE IF EXISTS public."Meters";

CREATE TABLE IF NOT EXISTS public."Meters"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "meterNumber" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    disco character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Meters_pkey" PRIMARY KEY (id),
    CONSTRAINT "Meters_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."Meters"
    OWNER to accuvend;


-- Table: public.PartnerProfiles

-- DROP TABLE IF EXISTS public."PartnerProfiles";

CREATE TABLE IF NOT EXISTS public."PartnerProfiles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "companyName" character varying(255) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default",
    "partnerCode" character varying(255) COLLATE pg_catalog."default",
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sec character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PartnerProfiles_pkey" PRIMARY KEY (id)
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."PartnerProfiles"
    OWNER to accuvend;


-- Table: public.Products

-- DROP TABLE IF EXISTS public."Products";

CREATE TABLE IF NOT EXISTS public."Products"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "masterProductCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category "enum_Products_category" NOT NULL,
    type "enum_Products_type",
    "productName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Products_pkey" PRIMARY KEY (id),
    CONSTRAINT "Products_masterProductCode_key" UNIQUE ("masterProductCode")
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."Products"
    OWNER to accuvend;

-- Table: public.Bundles

-- DROP TABLE IF EXISTS public."Bundles";

CREATE TABLE IF NOT EXISTS public."Bundles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productId" character varying(255) COLLATE pg_catalog."default",
    validity character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleAmount" double precision NOT NULL,
    "vendorIds" character varying(255)[] COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Bundles_pkey" PRIMARY KEY (id),
    CONSTRAINT "Bundles_bundleCode_key" UNIQUE ("bundleCode"),
    CONSTRAINT "Bundles_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES public."Products" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."Bundles"
    OWNER to accuvend;


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

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."Transactions"
    OWNER to accuvend;


-- Table: public.DiscoStatuses

-- DROP TABLE IF EXISTS public."DiscoStatuses";

CREATE TABLE IF NOT EXISTS public."DiscoStatuses"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status "enum_DiscoStatuses_status",
    disco character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "DiscoStatuses_pkey" PRIMARY KEY (id)
)

TABLESPACE acc_space_2;

ALTER TABLE IF EXISTS public."DiscoStatuses"
    OWNER to accuvend;



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
    OWNER TO accuvend;
