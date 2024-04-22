-- Type: enum_Events_status

-- DROP TYPE IF EXISTS public."enum_Events_status";

CREATE TYPE public."enum_Events_status" AS ENUM
    ('COMPLETE', 'PENDING', 'FAILED');

ALTER TYPE public."enum_Events_status"
    OWNER TO accuvend;