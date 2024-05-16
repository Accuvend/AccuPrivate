-- Type: enum_ProductCodes_type

-- DROP TYPE IF EXISTS public."enum_ProductCodes_type";

CREATE TYPE public."enum_ProductCodes_type" AS ENUM
    ('POSTPAID', 'PREPAID', 'AIRTIME', 'ELECTRICITY', 'DATA', 'CABLE');

ALTER TYPE public."enum_ProductCodes_type"
    OWNER TO accuvend;