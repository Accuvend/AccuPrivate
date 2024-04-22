-- Type: enum_Products_category

-- DROP TYPE IF EXISTS public."enum_Products_category";

CREATE TYPE public."enum_Products_category" AS ENUM
    ('AIRTIME', 'ELECTRICITY', 'DATA', 'CABLE');

ALTER TYPE public."enum_Products_category"
    OWNER TO accuvend;