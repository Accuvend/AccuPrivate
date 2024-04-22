-- Type: enum_MockEndpointData_apiStatusType

-- DROP TYPE IF EXISTS public."enum_MockEndpointData_apiStatusType";

CREATE TYPE public."enum_MockEndpointData_apiStatusType" AS ENUM
    ('FAILURE', 'SUCCESS');

ALTER TYPE public."enum_MockEndpointData_apiStatusType"
    OWNER TO accuvend;