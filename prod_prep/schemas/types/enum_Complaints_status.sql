-- Type: enum_Complaints_status

-- DROP TYPE IF EXISTS public."enum_Complaints_status";

CREATE TYPE public."enum_Complaints_status" AS ENUM
    ('OPEN', 'PENDING', 'CLOSED');

ALTER TYPE public."enum_Complaints_status"
    OWNER TO accuvend;