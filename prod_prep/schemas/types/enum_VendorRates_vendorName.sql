-- Type: enum_VendorRates_vendorName

-- DROP TYPE IF EXISTS public."enum_VendorRates_vendorName";

CREATE TYPE public."enum_VendorRates_vendorName" AS ENUM
    ('IRECHARGE', 'BUYPOWERNG', 'BAXI');

ALTER TYPE public."enum_VendorRates_vendorName"
    OWNER TO accuvend;