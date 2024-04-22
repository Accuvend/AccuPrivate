-- Type: enum_Transactions_paymentType

-- DROP TYPE IF EXISTS public."enum_Transactions_paymentType";

CREATE TYPE public."enum_Transactions_paymentType" AS ENUM
    ('REVERSAL', 'PAYMENT');

ALTER TYPE public."enum_Transactions_paymentType"
    OWNER TO accuvend;