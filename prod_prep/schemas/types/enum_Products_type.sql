-- Type: enum_Products_type

-- DROP TYPE IF EXISTS public."enum_Products_type";

CREATE TYPE public."enum_Products_type" AS ENUM
    ('POSTPAID', 'PREPAID');

ALTER TYPE public."enum_Products_type"
    OWNER TO accuvend;


    