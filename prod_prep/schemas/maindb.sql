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

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
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

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PartnerProfiles"
    OWNER to accuvend;

-- Table: public.Roles

-- DROP TABLE IF EXISTS public."Roles";

CREATE TABLE IF NOT EXISTS public."Roles"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    type character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Roles_pkey" PRIMARY KEY (id),
    CONSTRAINT "Roles_name_key" UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Roles"
    OWNER to accuvend;

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
    OWNER to accuvend;

-- Table: public.ApiKeys

-- DROP TABLE IF EXISTS public."ApiKeys";

CREATE TABLE IF NOT EXISTS public."ApiKeys"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "partnerId" character varying(255) COLLATE pg_catalog."default",
    active boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "lastUsed" timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY (id),
    CONSTRAINT "ApiKeys_partnerId_fkey" FOREIGN KEY ("partnerId")
        REFERENCES public."PartnerProfiles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ApiKeys"
    OWNER to accuvend;

-- Table: public.ErrorCodes

-- DROP TABLE IF EXISTS public."ErrorCodes";

CREATE TABLE IF NOT EXISTS public."ErrorCodes"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "httpCode" integer,
    category character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    "accuvendDescription" character varying(255) COLLATE pg_catalog."default",
    "accuvendMasterResponseCode" integer,
    request character varying(255) COLLATE pg_catalog."default",
    "STATUS_CODE" character varying(255) COLLATE pg_catalog."default",
    "STATUS_BOOLEAN" boolean,
    "STATUS" character varying(255) COLLATE pg_catalog."default",
    "CODE" character varying(255) COLLATE pg_catalog."default",
    "MSG" character varying(255) COLLATE pg_catalog."default",
    vendor character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ErrorCodes_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ErrorCodes"
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

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Meters"
    OWNER to accuvend;

-- Table: public.ResponsePaths

-- DROP TABLE IF EXISTS public."ResponsePaths";

CREATE TABLE IF NOT EXISTS public."ResponsePaths"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vendor character varying(255) COLLATE pg_catalog."default" NOT NULL,
    path character varying(255) COLLATE pg_catalog."default",
    "accuvendRefCode" character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    "requestType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "forErrorResponses" boolean,
    CONSTRAINT "ResponsePaths_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ResponsePaths"
    OWNER to accuvend;

-- Table: public.ProductCodes

-- DROP TABLE IF EXISTS public."ProductCodes";

CREATE TABLE IF NOT EXISTS public."ProductCodes"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    type "enum_ProductCodes_type" NOT NULL,
    amount double precision,
    network character varying(255) COLLATE pg_catalog."default",
    "vendType" "enum_ProductCodes_vendType" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ProductCodes_pkey" PRIMARY KEY (id),
    CONSTRAINT "ProductCodes_productCode_key" UNIQUE ("productCode")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ProductCodes"
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

TABLESPACE pg_default;

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

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Bundles"
    OWNER to accuvend;


-- Table: public.Vendors

-- DROP TABLE IF EXISTS public."Vendors";

CREATE TABLE IF NOT EXISTS public."Vendors"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "schemaData" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "vendorIds" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Vendors_pkey" PRIMARY KEY (id),
    CONSTRAINT "Vendors_name_key" UNIQUE (name),
    CONSTRAINT "Vendors_vendorIds_fkey" FOREIGN KEY ("vendorIds")
        REFERENCES public."Bundles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Vendors"
    OWNER to accuvend;




-- Table: public.VendorRates

-- DROP TABLE IF EXISTS public."VendorRates";

CREATE TABLE IF NOT EXISTS public."VendorRates"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendorName" "enum_VendorRates_vendorName" NOT NULL,
    "discoCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    commission double precision NOT NULL,
    bonus double precision NOT NULL DEFAULT '0'::double precision,
    title character varying(255) COLLATE pg_catalog."default",
    validity character varying(255) COLLATE pg_catalog."default",
    "productCodeId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "VendorRates_pkey" PRIMARY KEY (id),
    CONSTRAINT "VendorRates_productCodeId_fkey" FOREIGN KEY ("productCodeId")
        REFERENCES public."ProductCodes" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."VendorRates"
    OWNER to accuvend;



-- Table: public.VendorProducts

-- DROP TABLE IF EXISTS public."VendorProducts";

CREATE TABLE IF NOT EXISTS public."VendorProducts"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "vendorId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productCode" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleAmount" double precision,
    commission double precision NOT NULL,
    bonus double precision NOT NULL,
    "vendorCode" character varying(255) COLLATE pg_catalog."default",
    "vendorName" character varying(255) COLLATE pg_catalog."default",
    "schemaData" jsonb,
    "vendorHttpUrl" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "bundleId" character varying(255) COLLATE pg_catalog."default",
    "bundleCode" character varying(255) COLLATE pg_catalog."default",
    "bundleName" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "VendorProducts_pkey" PRIMARY KEY (id),
    CONSTRAINT "VendorProducts_vendorId_bundleId_key" UNIQUE ("vendorId", "bundleId"),
    CONSTRAINT "VendorProducts_bundleId_fkey" FOREIGN KEY ("bundleId")
        REFERENCES public."Bundles" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "VendorProducts_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES public."Products" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "VendorProducts_vendorId_fkey" FOREIGN KEY ("vendorId")
        REFERENCES public."Vendors" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."VendorProducts"
    OWNER to accuvend;



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


-- Table: public.Passwords

-- DROP TABLE IF EXISTS public."Passwords";

CREATE TABLE IF NOT EXISTS public."Passwords"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "entityId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Passwords_pkey" PRIMARY KEY (id),
    CONSTRAINT "Passwords_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Passwords"
    OWNER to accuvend;

-- Table: public.Complaints

-- DROP TABLE IF EXISTS public."Complaints";

CREATE TABLE IF NOT EXISTS public."Complaints"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category character varying(255) COLLATE pg_catalog."default" NOT NULL,
    message character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    image character varying(255) COLLATE pg_catalog."default" DEFAULT ''::character varying,
    "entityId" character varying(255) COLLATE pg_catalog."default",
    status "enum_Complaints_status" NOT NULL DEFAULT 'PENDING'::"enum_Complaints_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Complaints_pkey" PRIMARY KEY (id),
    CONSTRAINT "Complaints_entityId_fkey" FOREIGN KEY ("entityId")
        REFERENCES public."Entities" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Complaints"
    OWNER to accuvend;


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

TABLESPACE acc_space_1;

ALTER TABLE IF EXISTS public."Transactions"
    OWNER to accuvend;


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

TABLESPACE acc_space_1;

ALTER TABLE IF EXISTS public."Events"
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

TABLESPACE acc_space_1;

ALTER TABLE IF EXISTS public."DiscoStatuses"
    OWNER to accuvend;


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

TABLESPACE acc_space_1;

ALTER TABLE IF EXISTS public."Notifications"
    OWNER to accuvend;


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

TABLESPACE acc_space_1;

ALTER TABLE IF EXISTS public."PowerUnits"
    OWNER to accuvend;

