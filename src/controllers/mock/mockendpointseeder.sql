
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('6852165a-4b6e-4b84-a2a9-25adfa92024f','BUYPOWER',NULL,'{
    "error": false,
    "discoCode": "ABUJA",
    "vendType": "PREPAID",
    "meterNo": "12345678910",
    "minVendAmount": 350,
    "maxVendAmount": 10000000,
    "responseCode": 100,
    "outstanding": 0,
    "debtRepayment": 0,
    "name": "Ciroma Chukwuma Adekunle",
    "address": "012 Fake Cresent, Fake City, Fake State",
    "tariff": 0,
    "tariffDesc": "Residential class 2",
    "tariffClass": "R2"
}',200,'meter-validation','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('5b3ad570-7ea8-46fe-8c70-9baa08cf8d28','BAXI',NULL,'{
    "status": "success",
    "message": "Successful",
    "code": 200,
    "data": {
        "name": "Adene Jonah",
        "address": "Mr. John Linde 34 Tokai, Cape Town. 7999.",
        "outstandingBalance": "",
        "dueDate": null,
        "district": "",
        "accountNumber": "45060582249",
        "minimumAmount": null,
        "rawOutput": null,
        "errorMessage": null
    }
}',200,'meter-validation','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('12fafa40-c435-4836-9188-d8a1f78982da','IRECHARGE',NULL,'{
  "status": "00",
  "message": "OK",
  "access_token": "24022307211121",
  "customer": {
    "name": "Adene Jonah",
    "address": "Mr. John Doe 34 Tokai, Abuja. 7999.",
    "util": "Demo Utility",
    "minimumAmount": "500"
  },
  "response_hash": "dcbb08261554ce7adfdf11d10cfa4a468f0ffeda"
}',200,'meter-validation','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');

-- Vend token
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('0fdbb465-780e-4a3f-8006-ed5f05ccbd70','BUYPOWER',NULL,'{
    "status": true,
    "message": "Successful transaction",
    "responseCode": 200,
    "data": {
        "id": 7363659,
        "amountGenerated": 1701,
        "tariff": null,
        "debtAmount": 0,
        "debtRemaining": 0,
        "disco": "ABUJA",
        "orderId": "45a7a4bb-ef31-4a5a-9c8f-a947fd553c1a",
        "receiptNo": 1708634380962,
        "tax": 5101,
        "vendTime": "2024-02-22 21:39:40",
        "token": "0000-0000-0000-0000-0000",
        "totalAmountPaid": 6802,
        "units": "12.8",
        "vendAmount": 0,
        "vendRef": 1708634380962,
        "responseCode": 100,
        "responseMessage": "Payment successful",
        "address": "012 Fake Cresent, Fake City, Fake State",
        "name": "Ciroma Chukwuma Adekunle",
        "phoneNo": "08000000000",
        "charges": 0,
        "tariffIndex": null,
        "parcels": [
            {
                "type": "TOKEN",
                "content": "00000000000000000000"
            },
            {
                "type": "BONUS",
                "content": "00000000000000000000"
            }
        ],
        "demandCategory": "NMD",
        "assetProvider": "ABUJA"
    }
}',200,'vend-power','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('2058e184-3b24-4469-abe1-92ddec193a54','BAXI',NULL,'{
    "status": "success",
    "message": "Successful",
    "code": 200,
    "data": {
        "transactionStatus": "success",
        "transactionReference": 105101953,
        "statusCode": "0",
        "transactionMessage": "Payment Successful",
        "tokenCode": "24043863210107446637",
        "tokenAmount": 392.86,
        "amountOfPower": "16.4KWH",
        "rawOutput": {
            "bsstTokenValue": "03077058422533814375",
            "fixedTariff": "Fixed",
            "bsstTokenAmount": 0,
            "tokenTechnologyCode": "02",
            "standardTokenUnits": 16.4,
            "tariffIndex": "52",
            "bsstTokenUnits": 63.67,
            "bsstTokenTax": 0,
            "keyRevisionNumber": "1",
            "terminalId": "1",
            "standardTokenValue": "24043863210107446637",
            "bsstTokenDescription": "FBE",
            "debtTariff": "Debt Recovery",
            "responseCode": "elec000",
            "algorithmCode": "05",
            "debtDescription": "1122",
            "standardTokenTax": 132.63,
            "fixedAmount": 144.74,
            "utilityAddress": "59 WaterFront, Durban. 5899.",
            "utilityName": "Eskom Online",
            "debtAmount": 223.68,
            "retailerMessage": "Hello Operator Message.",
            "standardTokenDescription": "Normal Sale",
            "clientId": "CROWNINTERACTIVEASM",
            "customerMessage": "Good day dear customer. This is\na test customer message from\ncustomer. We have vended a\ntoken for the customer. The\nmessage can be up to 160\ncharacters long....",
            "bsstTokenDate": "2024-02-22T20:22:23.117932+01:00",
            "utilityTaxReference": "860864098863",
            "supplyGroupCode": "100405",
            "exchangeReference": "743953333371",
            "utilityDistrictId": "00663921581870984201",
            "responseMessage": "OK",
            "status": "ACCEPTED",
            "standardTokenAmount": 392.86
        },
        "provider_message": "OK",
        "baxiReference": 1552846
    }
}',200,'vend-power','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('a0cb6524-1996-4c99-bc4d-a4d959224530','IRECHARGE',NULL,'{
  "status": "00",
  "message": "Successful",
  "wallet_balance": "10494.00",
  "ref": "24022307211121",
  "amount": 1000,
  "units": "333.300",
  "meter_token": "112345678567859765456788",
  "address": "Mr. John Doe 34 Tokai, Abuja. 7999.",
  "response_hash": "63fd016dce0dc8af89e17e2a181ad2a560e66cca"
}',200,'vend-power','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');


-- Disco up 

INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('f9102743-9390-4a07-9adc-d4bafdce8cb5','BUYPOWER',NULL,'{
    "ABUJA": true,
    "EKO": true,
    "IKEJA": true,
    "IBADAN": true,
    "ENUGU": true,
    "PH": true,
    "JOS": true,
    "KADUNA": true,
    "KANO": true,
    "BH": true,
    "PROTOGY": false,
    "PHISBOND": false,
    "ACCESSPOWER": false,
    "APLE": false,
    "BENIN": false,
    "YOLA": true,
    "KOIOS": false,
    "KAIDA": false,
    "MTN": true,
    "GLO": false,
    "9MOBILE": false,
    "DSTV": true,
    "GOTV": true,
    "STARTIMES": true
}',200,'disco-up','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('be6d33a5-e5b0-4b2f-a271-ce905d6bdf10','BAXI',NULL,'{
    "status": "success",
    "message": "Successful",
    "code": 200,
    "data": {
        "providers": [
            {
                "service_type": "jos_electric_postpaid",
                "shortname": "jos electric postpaid",
                "biller_id": 2,
                "product_id": 2,
                "name": "Jos Postpaid"
            },
            {
                "service_type": "jos_electric_prepaid",
                "shortname": "jos electric prepaid",
                "biller_id": 2,
                "product_id": 3,
                "name": "Jos Prepaid"
            },
            {
                "service_type": "kaduna_electric_prepaid",
                "shortname": "kaduna electric prepaid",
                "biller_id": 3,
                "product_id": 5,
                "name": "Kaduna Prepaid"
            },
            {
                "service_type": "eko_electric_prepaid",
                "shortname": "eko electric prepaid",
                "biller_id": 5,
                "product_id": 11,
                "name": "Eko Prepaid"
            },
            {
                "service_type": "ibadan_electric_prepaid",
                "shortname": "ibadan electric prepaid",
                "biller_id": 6,
                "product_id": 12,
                "name": "Ibadan Disco Prepaid (Fets Wallet)"
            },
            {
                "service_type": "portharcourt_electric_postpaid",
                "shortname": "portharcourt electric postpaid",
                "biller_id": 7,
                "product_id": 13,
                "name": "Port Harcourt Postpaid (Xpresspayments)"
            },
            {
                "service_type": "portharcourt_electric_prepaid",
                "shortname": "portharcourt electric prepaid",
                "biller_id": 7,
                "product_id": 14,
                "name": "Port Harcourt Prepaid (Xpresspayments)"
            },
            {
                "service_type": "enugu_electric_postpaid",
                "shortname": "enugu electric postpaid",
                "biller_id": 8,
                "product_id": 15,
                "name": "Enugu Postpaid"
            },
            {
                "service_type": "enugu_electric_prepaid",
                "shortname": "enugu electric prepaid",
                "biller_id": 8,
                "product_id": 16,
                "name": "Enugu Prepaid"
            },
            {
                "service_type": "abuja_electric_postpaid",
                "shortname": "abuja electric postpaid",
                "biller_id": 9,
                "product_id": 17,
                "name": "Abuja Postpaid"
            },
            {
                "service_type": "abuja_electric_prepaid",
                "shortname": "abuja electric prepaid",
                "biller_id": 9,
                "product_id": 18,
                "name": "Abuja Prepaid"
            },
            {
                "service_type": "kedco_electric_postpaid",
                "shortname": "kedco electric postpaid",
                "biller_id": 10,
                "product_id": 21,
                "name": "Kano Postpaid"
            },
            {
                "service_type": "kedco_electric_prepaid",
                "shortname": "kedco electric prepaid",
                "biller_id": 10,
                "product_id": 22,
                "name": "Kano Prepaid"
            },
            {
                "service_type": "ikeja_electric_prepaid",
                "shortname": "ikeja electric prepaid",
                "biller_id": 4,
                "product_id": 25,
                "name": "Ikeja Disco Token Vending (Prepaid)"
            },
            {
                "service_type": "ikeja_electric_postpaid",
                "shortname": "ikeja electric postpaid",
                "biller_id": 4,
                "product_id": 26,
                "name": "Ikeja Disco Bill Payment (Postpaid)"
            },
            {
                "service_type": "eko_electric_postpaid",
                "shortname": "eko electric postpaid",
                "biller_id": 5,
                "product_id": 27,
                "name": "Eko Postpaid"
            },
            {
                "service_type": "ibadan_electric_postpaid",
                "shortname": "ibadan electric postpaid",
                "biller_id": 6,
                "product_id": 44,
                "name": "Ibadan Disco Postpaid (Fets Wallet)"
            }
        ]
    }
}',200,'disco-up','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');

-- Requery 

INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('f64e9f89-c656-4e25-aa8f-c0a2e4623e7d','BUYPOWER',NULL,'{
    "result": {
        "status": true,
        "message": "Successful transaction",
        "responseCode": 200,
        "data": {
            "id": 7363659,
            "amountGenerated": "1701.00",
            "tariff": null,
            "disco": "ABUJA",
            "debtAmount": "0.00",
            "debtRemaining": "0.00",
            "orderId": "45a7a4bb-ef31-4a5a-9c8f-a947fd553c1a",
            "receiptNo": "1708634380962",
            "tax": "5101.00",
            "vendTime": "2024-02-22 20:39:40",
            "token": "0000-0000-0000-0000-0000",
            "totalAmountPaid": 6802,
            "units": "12.8",
            "vendAmount": "6802",
            "vendRef": null,
            "responseCode": 100,
            "responseMessage": "Payment successful",
            "address": "012 Fake Cresent, Fake City, Fake State",
            "name": "Ciroma Chukwuma Adekunle",
            "phoneNo": "08000000000",
            "charges": "0.00",
            "tariffIndex": null,
            "parcels": [
                {
                    "type": "TOKEN",
                    "content": "0000-0000-0000-0000-0000"
                },
                {
                    "type": "BONUS",
                    "content": "0000-0000-0000-0000-0000"
                },
                {
                    "type": "KCT1",
                    "content": "0000-0000-0000-0000-0000"
                },
                {
                    "type": "KCT2",
                    "content": "0000-0000-0000-0000-0000"
                }
            ],
            "demandCategory": "MD",
            "assetProvider": "ABUJA"
        }
    }
}',200,'requery','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('f1323146-a308-4f7d-b465-c8cbfb326fb9','BAXI',NULL,'{
    "status": "success",
    "message": "Successful",
    "code": 200,
    "data": {
        "statusCode": "0",
        "transactionStatus": "success",
        "transactionReference": 105101953,
        "transactionMessage": "Successful",
        "baxiReference": "1552846",
        "pins": [],
        "tokenCode": "24043863210107446637",
        "rawData": {
            "bsstTokenValue": "03077058422533814375",
            "fixedTariff": "Fixed",
            "bsstTokenAmount": 0,
            "tokenTechnologyCode": "02",
            "standardTokenUnits": 16.4,
            "tariffIndex": "52",
            "bsstTokenUnits": 63.67,
            "bsstTokenTax": 0,
            "keyRevisionNumber": "1",
            "terminalId": "1",
            "standardTokenValue": "24043863210107446637",
            "bsstTokenDescription": "FBE",
            "debtTariff": "Debt Recovery",
            "responseCode": "elec000",
            "algorithmCode": "05",
            "debtDescription": "1122",
            "standardTokenTax": 132.63,
            "fixedAmount": 144.74,
            "utilityAddress": "59 WaterFront, Durban. 5899.",
            "utilityName": "Eskom Online",
            "debtAmount": 223.68,
            "retailerMessage": "Hello Operator Message.",
            "standardTokenDescription": "Normal Sale",
            "clientId": "CROWNINTERACTIVEASM",
            "customerMessage": "Good day dear customer. This is\na test customer message from\ncustomer. We have vended a\ntoken for the customer. The\nmessage can be up to 160\ncharacters long....",
            "bsstTokenDate": "2024-02-22T20:22:23.117932+01:00",
            "utilityTaxReference": "860864098863",
            "supplyGroupCode": "100405",
            "exchangeReference": "743953333371",
            "utilityDistrictId": "00663921581870984201",
            "responseMessage": "OK",
            "status": "ACCEPTED",
            "standardTokenAmount": 392.86
        }
    }
}',200,'requery','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
INSERT INTO public."MockEndpointData"(id,"vendorName","vendorCode","vendorResponse","httpCode","apiType","apiStatusType","activated","createdAt","updatedAt") VALUES ('73aea210-f588-498f-ada4-0f871b18d32e','IRECHARGE',NULL,'{
  "status": "00",
  "vend_status": "successful",
  "vend_code": "00",
  "token": "112345678567859765456788",
  "units": "333.300",
  "response_hash": "57e2759e38e2bf428c31d9e5ed32f5af4d76ea41"
}',200,'requery','SUCCESS',true,'2024-02-22 08:13:37.353+00','2024-02-22 08:13:37.353+01');
