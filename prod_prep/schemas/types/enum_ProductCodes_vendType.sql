-- Type: enum_ProductCodes_vendType

-- DROP TYPE IF EXISTS public."enum_ProductCodes_vendType";

CREATE TYPE public."enum_ProductCodes_vendType" AS ENUM
    ('POSTPAID', 'PREPAID');

ALTER TYPE public."enum_ProductCodes_vendType"
    OWNER TO accuvend;