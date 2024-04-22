-- Type: enum_DiscoStatuses_status

-- DROP TYPE IF EXISTS public."enum_DiscoStatuses_status";

CREATE TYPE public."enum_DiscoStatuses_status" AS ENUM
    ('available', 'unavailable');

ALTER TYPE public."enum_DiscoStatuses_status"
    OWNER TO accuvend;