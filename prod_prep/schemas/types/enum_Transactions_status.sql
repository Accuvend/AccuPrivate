-- Type: enum_Transactions_status

-- DROP TYPE IF EXISTS public."enum_Transactions_status";

CREATE TYPE public."enum_Transactions_status" AS ENUM
    ('COMPLETE', 'PENDING', 'FAILED', 'INPROGRESS', 'FLAGGED');

ALTER TYPE public."enum_Transactions_status"
    OWNER TO accuvend;