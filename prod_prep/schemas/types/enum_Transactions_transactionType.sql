-- Type: enum_Transactions_transactionType

-- DROP TYPE IF EXISTS public."enum_Transactions_transactionType";

CREATE TYPE public."enum_Transactions_transactionType" AS ENUM
    ('AIRTIME', 'ELECTRICITY', 'DATA', 'CABLE');

ALTER TYPE public."enum_Transactions_transactionType"
    OWNER TO accuvend;