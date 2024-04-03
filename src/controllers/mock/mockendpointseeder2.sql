
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0fdbb465-780e-4a3f-8006-ed5f05ccbd70','200','vend power success','vend-power','BUYPOWER','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('12fafa40-c435-4836-9188-d8a1f78982da','0','Meter validation success','meter-validation','IRECHARGE','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2058e184-3b24-4469-abe1-92ddec193a54','200','vend power success','vend-power','BAXI','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('5b3ad570-7ea8-46fe-8c70-9baa08cf8d28','200','requery success','meter-validation','BAXI','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6852165a-4b6e-4b84-a2a9-25adfa92024f','200','Meter validation success','meter-validation','BUYPOWER','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('73aea210-f588-498f-ada4-0f871b18d32e','0','requery success','requery','IRECHARGE','{
  "status": "00",
  "vend_status": "successful",
  "vend_code": "00",
  "token": "112345678567859765456788",
  "units": "333.300",
  "response_hash": "57e2759e38e2bf428c31d9e5ed32f5af4d76ea41"
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('a0cb6524-1996-4c99-bc4d-a4d959224530','0','vend power success','vend-power','IRECHARGE','{
  "status": "00",
  "message": "Successful",
  "wallet_balance": "10494.00",
  "ref": "24022307211121",
  "amount": 1000,
  "units": "333.300",
  "meter_token": "112345678567859765456788",
  "address": "Mr. John Doe 34 Tokai, Abuja. 7999.",
  "response_hash": "63fd016dce0dc8af89e17e2a181ad2a560e66cca"
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('be6d33a5-e5b0-4b2f-a271-ce905d6bdf10','200','Meter validation success','disco-up','BAXI','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f1323146-a308-4f7d-b465-c8cbfb326fb9','200','requery success','requery','BAXI','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f64e9f89-c656-4e25-aa8f-c0a2e4623e7d','200','requery success','requery','BUYPOWER','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f9102743-9390-4a07-9adc-d4bafdce8cb5','200','Meter validation success','disco-up','BUYPOWER','{
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
}',200,'SUCCESS','TRUE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0ddc7345-1146-4209-84c1-d30da91b6f70','202','Accepted','vend-power','buypower','{
  "status": false,
  "error": true,
  "responseCode": 202,
  "message": "Transaction is still in progress. Please requery in 120 seconds",
  "delay": [
    120,
    120,
    120
  ]
}',202,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0ed2e210-f3b4-47c1-9196-b8ab1fc74c4d','202','Accepted','requery','buypower','{
  "status": false,
  "error": true,
  "responseCode": 202,
  "message": "Transaction is still in progress. Please requery in 120 seconds",
  "delay": [
    120,
    120,
    120
  ]
}',202,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0a6465b8-9e50-4e0f-a59e-3b53673d014e','400','Validation Error','vend-power','buypower','{
  "status": false,
  "message": "Invalid Order ID. \"orderId\" is required",
  "responseCode": 201
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9e5775c6-f7ff-4028-8dd1-6d91eca3470e','400','Validation Error','requery','buypower','{
  "status": false,
  "message": "Invalid Order ID. \"orderId\" is required",
  "responseCode": 201
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('58f991d8-1392-485e-be30-e7f39e0edae6','201','Validation Error','requery','buypower','{
  "status": false,
  "message": "Transaction is still processing. Kindly retry in 2 minutes.",
  "responseCode": 201
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7cfe5bce-b475-4686-a440-7972db1a2a38','203','Validation Error','requery','buypower','{
  "status": false,
  "message": "Transaction not initiated.",
  "responseCode": 203
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3a78571a-e41c-4144-aa5a-47935bca79ef','202','Transaction not successful retry','requery','buypower','{
  "status": false,
  "message": "Transaction not successful. Please retry.",
  "responseCode": 202
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('8afda470-06fe-4fe2-819a-c1b6724c9586','202','Transaction Failure','requery','buypower','{
  "status": false,
  "message": "Transaction failed.",
  "responseCode": 202
}',400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('e4e0cdec-10d5-47c7-8de5-412ce6923ce1','422','Unprocessable','vend-power','buypower','{
  "status": false,
  "message": "insufficient wallet balance.",
  "responseCode": 202
}',422,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f42b025b-f457-4646-ac78-bc4a3e81884a','422','Unprocessable','requery','buypower','{
  "status": false,
  "message": "insufficient wallet balance.",
  "responseCode": 202
}',422,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6ad83177-f0e5-4783-8656-77c2f8537c9b','409','Conflict','vend-power','buypower','{
  "status": false,
  "message": "Request already received",
  "responseCode": 201
}',409,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4294afeb-e8b6-4139-b33b-25b10f7ac740','409','Conflict','requery','buypower','{
  "status": false,
  "message": "Request already received",
  "responseCode": 201
}',409,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4bcfe9f4-90c7-4769-b08b-24dd9da664da','500','Server Error','vend-power','buypower','{
  "status": false,
  "error": true,
  "responseCode": 500,
  "message": "An unexpected error occurred. Please requery to get status."
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ff0ab77f-c47d-4a5e-bb20-4386165b1006','500','Server Error','requery','buypower','{
  "status": false,
  "error": true,
  "responseCode": 500,
  "message": "An unexpected error occurred. Please requery to get status."
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('8ab713ad-15b7-4d69-858a-7056fe8c3fd6','501','Not Implemented','requery','buypower','{
  "status": false,
  "error": true,
  "responseCode": 501,
  "message": "This account is being migrated. Customer is advised to visit their service provider to resolve."
}',501,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('720ea1e5-71b6-48fb-85c6-f923dab88a3b','501','Not Implemented','vend-power','buypower','{
  "status": false,
  "error": true,
  "responseCode": 501,
  "message": "This account is being migrated. Customer is advised to visit their service provider to resolve."
}',502,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('1128a80e-e624-4872-b227-056a80bb4ce9','502','Unexpected Error','requery','buypower','{
  "status": false,
  "error": true,
  "responseCode": 503,
  "message": "An unexpected error occurred. Please requery to get status."
}',502,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c898b738-6478-454e-9d7e-4a968adeb12d','502','Unexpected Error','vend-power','buypower','{
  "status": false,
  "error": true,
  "responseCode": 503,
  "message": "An unexpected error occurred. Please requery to get status."
}',502,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('319c41f0-cf6d-46ed-9cba-73c40f7c793e','503','Service Not Available','requery','buypower','{
  "status": false,
  "error": true,
  "responseCode": 502,
  "message": "An unexpected error occurred. Please requery to get status."
}',503,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6a452b7c-faad-46af-9c93-f63741c2079a','503','Service Not Available','vend token','buypower','{
  "status": false,
  "error": true,
  "responseCode": 502,
  "message": "An unexpected error occurred. Please requery to get status."
}',503,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d555673c-9bc0-4d52-9eab-51059c71c0ee',NULL,NULL,NULL,'buypower',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d4fa513d-ff9b-416a-8492-0b61b94453fc',NULL,NULL,NULL,'buypower',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c55b75b6-540c-4aca-b61a-bbec3ef07ebf',NULL,NULL,NULL,'buypower',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4b78e431-0630-4293-8f1d-23243fdfdf88','20','Not found Error','requery','buypower','{
  "status": false,
  "message": "No transaction found with reference: 135EE81DAAA59E1164853",
  "responseCode": 20
}',404,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2ba83977-6b69-495d-a978-b414f01b342f',NULL,NULL,NULL,NULL,NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('a928d5d3-ab38-449e-bfd8-f025e988485d','200','Successful','requery','BAXI',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d007a495-803d-4783-8d52-c6cbabff4b07','200','Successful','vend-power','BAXI',NULL,200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3202a390-28f6-4138-9bdd-1817273465ac','201','Pending','requery','BAXI',NULL,200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3f4b2629-fb9a-4198-9574-457e7d6e722f','201','Pending','vend-power','BAXI',NULL,201,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('112c025c-97ed-4941-ba4c-d77071dd55c7','400','Bad Request data','requery','BAXI',NULL,201,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('38e99504-7ad9-43fd-8f1b-09f65f5bc976','400','Bad Request data','vend-power','BAXI',NULL,400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('86f978ff-3070-4631-a315-6e80d428a238','503','requires a requery from the service provider','requery','BAXI',NULL,400,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('30ecd27c-587e-4547-857a-bd14796aa974','503','requires a requery from the service provider','vend-power','BAXI',NULL,503,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('11854350-31d9-4b7a-91aa-815a81d7cb8d','500','requires a requery from the service provider','requery','BAXI',NULL,503,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('e871185b-cd67-48a7-8110-c2d7ca90cbbd','500','requires a requery from the service provider','vend-power','BAXI',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b296942d-cb0b-43ad-a9b3-c923bdbfdc19','404','Transaction / Resource not found','requery','BAXI',NULL,500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('404398d8-5d87-47a1-aeef-8000e34ebd09','404','Transaction / Resource not found','vend-power','BAXI',NULL,404,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('1d75fa79-f2f3-4a2c-af24-ce9cbaf8c44c','BX0001','Connection Timeout: Retried 3 times and no response from the service provider','vend-power','BAXI','{ "status": "error", "message": "Connection Timeout: Retried 3 times and no response from the service provider", "code": "BX0001", "errors": { "status": "error", "code": "BX0001", "message": "Connection Timeout: Retried 3 times and no response from the service provider" }}',404,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('8cd11480-ba77-4749-a8d5-ad8e57501d66','BX0002','Transaction does not exist','vend-power','BAXI','{
    "status": "error",
    "message": "Transaction not found in Baxibox upstream system",
    "code": "BX0002",
    "errors": []
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9379cc0a-5255-4413-9149-e6371c39947f','BX0003','Invalid request parameters data','vend-power','BAXI','{ "status": "error", "message": "Invalid request parameters data", "code": "BX0003", "errors": { "status": "error", "code": "BX0003", "message": "Invalid request parameters data" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c8c902ef-3648-41d7-a4b5-f38ab24b122c','BX0004','An In-valid user account in authorization headers sent','vend-power','BAXI','{ "status": "error", "message": "An In-valid user account in authorization headers sent", "code": "BX0004", "errors": { "status": "error", "code": "BX0004", "message": "An In-valid user account in authorization headers sent" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6df418d3-e49d-4736-ba7f-2eedf698b4c0','BX0005','Baxi request date is too old, use the current GMT date.','vend-power','BAXI','{ "status": "error", "message": "Baxi request date is too old, use the current GMT date.", "code": "BX0005", "errors": { "status": "error", "code": "BX0005", "message": "Baxi request date is too old, use the current GMT date." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('70a85771-76f8-43bc-9ee1-001249124050','BX0006','Hash Signature does not match request data sent.','vend-power','BAXI','{ "status": "error", "message": "Hash Signature does not match request data sent.", "code": "BX0006", "errors": { "status": "error", "code": "BX0006", "message": "Hash Signature does not match request data sent." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('834ba036-df55-4d0b-9789-8d79b1e43021','BX0007','Unidentified User Account','vend-power','BAXI','{ "status": "error", "message": "Unidentified User Account", "code": "BX0007", "errors": { "status": "error", "code": "BX0007", "message": "Unidentified User Account" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b3b1bfbe-dd7c-476b-ae15-ff179da54920','BX0008','The request coming from an untrusted source','vend-power','BAXI','{ "status": "error", "message": "The request coming from an untrusted source", "code": "BX0008", "errors": { "status": "error", "code": "BX0008", "message": "The request coming from an untrusted source" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('82272db0-8959-41df-98e9-ac10e420e6d0','BX0009','Client not permitted to access user data','vend-power','BAXI','{ "status": "error", "message": "Client not permitted to access user data", "code": "BX0009", "errors": { "status": "error", "code": "BX0009", "message": "Client not permitted to access user data" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7273f123-71db-45ee-81f7-cbecac7c600a','BX0010','The agent does not exist','vend-power','BAXI','{ "status": "error", "message": "The agent does not exist", "code": "BX0010", "errors": { "status": "error", "code": "BX0010", "message": "The agent does not exist" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7ba8dccc-d954-4beb-a00c-305b4c8e80fa','BX0011','Invalid Bearer String, expected keyword Baxi or API key','vend-power','BAXI','{ "status": "error", "message": "Invalid Bearer String, expected keyword Baxi or API key", "code": "BX0011", "errors": { "status": "error", "code": "BX0011", "message": "Invalid Bearer String, expected keyword Baxi or API key" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ec932238-beea-486a-8709-5f166c009b37','BX0012','Authentication/Authorization mechanism not implemented','vend-power','BAXI','{ "status": "error", "message": "Authentication/Authorization mechanism not implemented", "code": "BX0012", "errors": { "status": "error", "code": "BX0012", "message": "Authentication/Authorization mechanism not implemented" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9c7382c7-1948-4e91-946f-93673fb3361c','BX0013','Bearer Token not provided','vend-power','BAXI','{ "status": "error", "message": "Bearer Token not provided", "code": "BX0013", "errors": { "status": "error", "code": "BX0013", "message": "Bearer Token not provided" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('41ca2704-87fb-4823-98dd-d38adbe842ec','BX0014','Token has expired.','vend-power','BAXI','{ "status": "error", "message": "Token has expired.", "code": "BX0014", "errors": { "status": "error", "code": "BX0014", "message": "Token has expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f914e0b2-139d-4994-8e6c-bae0d682132f','BX0015','Invalid token supplied','vend-power','BAXI','{ "status": "error", "message": "Invalid token supplied", "code": "BX0015", "errors": { "status": "error", "code": "BX0015", "message": "Invalid token supplied" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('afb0be10-7c93-45a9-a7bc-7862c21dbbc0','BX0016','Token has been blacklisted,','vend-power','BAXI','{ "status": "error", "message": "Token has been blacklisted,", "code": "BX0016", "errors": { "status": "error", "code": "BX0016", "message": "Token has been blacklisted," }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('68e7fda7-a5a4-41b8-9e71-88f0cdfbddc7','BX0017','Server Error: Unable to retrieve property','vend-power','BAXI','{ "status": "error", "message": "Server Error: Unable to retrieve property", "code": "BX0017", "errors": { "status": "error", "code": "BX0017", "message": "Server Error: Unable to retrieve property" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('bc03f9ac-1ad2-4a12-99cd-f0fc86a820e2','BX0018','Request route not found,','vend-power','BAXI','{ "status": "error", "message": "Request route not found,", "code": "BX0018", "errors": { "status": "error", "code": "BX0018", "message": "Request route not found," }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('e820f1f6-d9d5-49b4-8f9b-63302e86828e','BX0019','Request status unknown, Connection Timeout','vend-power','BAXI','{ "status": "error", "message": "Request status unknown, Connection Timeout", "code": "BX0019", "errors": { "status": "error", "code": "BX0019", "message": "Request status unknown, Connection Timeout" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f463956d-57b1-4027-945b-943c6cb12b45','BX0020','An error occurred during transaction or request processing','vend-power','BAXI','{ "status": "error", "message": "An error occurred during transaction or request processing", "code": "BX0020", "errors": { "status": "error", "code": "BX0020", "message": "An error occurred during transaction or request processing" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9e9d160e-0b28-459f-b5b3-b2c8214b2918','BX0021','Transaction status unknown: Please query to confirm final status','vend-power','BAXI','{ "status": "error", "message": "Transaction status unknown: Please query to confirm final status", "code": "BX0021", "errors": { "status": "error", "code": "BX0021", "message": "Transaction status unknown: Please query to confirm final status" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('bb9ca7e3-14a3-441c-aabc-279960cfe34f','BX0022','requires a requery from the service provider','vend-power','BAXI','{ "status": "error", "message": "requires a requery from the service provider", "code": "BX0022", "errors": { "status": "error", "code": "BX0022", "message": "requires a requery from the service provider" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c60c767d-517a-4cd7-9172-72f7adca478a','BX0023','Duplicate Agent Transaction Reference','vend-power','BAXI','{
    "status": "error",
    "message": "Duplicate Agent Transaction Reference",
    "code": "BX0023",
    "errors": {
        "status": "error",
        "code": "BX0023",
        "message": "Duplicate Agent Transaction Reference"
    }
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b3e7ad4c-838d-4345-9de5-d423e68c4534','BX0024','No response from the connecting service provider','vend-power','BAXI','{ "status": "error", "message": "No response from the connecting service provider", "code": "BX0024", "errors": { "status": "error", "code": "BX0024", "message": "No response from the connecting service provider" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2ba3cc2e-9e67-45bf-8e21-619c2e852d15','BX0025','Error encountered during name finder validation','vend-power','BAXI','{ "status": "error", "message": "Error encountered during name finder validation", "code": "BX0025", "errors": { "status": "error", "code": "BX0025", "message": "Error encountered during name finder validation" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('80d0041b-fe2f-435f-b769-39a0b1dc2e23','BX0026','Requested biller service does not exist','vend-power','BAXI','{ "status": "error", "message": "Requested biller service does not exist", "code": "BX0026", "errors": { "status": "error", "code": "BX0026", "message": "Requested biller service does not exist" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f66c1df8-230e-4a16-b1fd-29671b1443a4','PROG0001','Programming error on the platform. (Should contact CDL support)','vend-power','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0001", "errors": { "status": "error", "code": "PROG0001", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('39a1cd1d-5ef7-48a0-b143-1b291d3e3b24','PROG0002','Programming error on the platform. (Should contact CDL support)','vend-power','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0002", "errors": { "status": "error", "code": "PROG0002", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('be71e02f-cc60-488b-8fcc-f04f9c8dd159','PROG0003','Programming error on the platform. (Should contact CDL support)','vend-power','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0003", "errors": { "status": "error", "code": "PROG0003", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('efd49f1b-9f67-403a-93a7-073b18d14684','SEC00001','Bad credentials','vend-power','BAXI','{ "status": "error", "message": "Bad credentials", "code": "SEC00001", "errors": { "status": "error", "code": "SEC00001", "message": "Bad credentials" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('5b0f39c8-89c4-4122-8331-5957fb6a1449','SEC00002','The user account has expired.','VENDREQUEST','BAXI','{ "status": "error", "message": "The user account has expired.", "code": "SEC00002", "errors": { "status": "error", "code": "SEC00002", "message": "The user account has expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('1fadcd79-6baa-445b-b2ab-9d64aa82844b','SEC00003','User credentials have expired.','vend-power','BAXI','{ "status": "error", "message": "User credentials have expired.", "code": "SEC00003", "errors": { "status": "error", "code": "SEC00003", "message": "User credentials have expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2f855991-8b07-4854-b57b-92541ac93be7','SEC00004','The user is not active.','vend-power','BAXI','{ "status": "error", "message": "The user is not active.", "code": "SEC00004", "errors": { "status": "error", "code": "SEC00004", "message": "The user is not active." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('53fc3384-1dce-4976-a9bf-faabc7d334da','SEC00005','The user is blocked.','vend-power','BAXI','{ "status": "error", "message": "The user is blocked.", "code": "SEC00005", "errors": { "status": "error", "code": "SEC00005", "message": "The user is blocked." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f45a617f-ae73-4f58-a602-204397e5d282','SEC00100','Unknown authentication error. (Should contact CDL support)','vend-power','BAXI','{ "status": "error", "message": "Unknown authentication error. (Should contact CDL support)", "code": "SEC00100", "errors": { "status": "error", "code": "SEC00100", "message": "Unknown authentication error. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3b278479-7ae1-45d7-895c-c016ce249a70','EXC00102','Not enough funds were available to complete the exchange.','vend-power','BAXI','{ "status": "error", "message": "Not enough funds were available to complete the exchange.", "code": "EXC00102", "errors": { "status": "error", "code": "EXC00102", "message": "Not enough funds were available to complete the exchange." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2db3f9e1-0633-4238-8c37-c9908ad79165','EXC00103','The requested service is not active. (Should resolve through API)','vend-power','BAXI','{ "status": "error", "message": "The requested service is not active. (Should resolve through API)", "code": "EXC00103", "errors": { "status": "error", "code": "EXC00103", "message": "The requested service is not active. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ab15eed9-54f2-47a2-84a7-b12e34bc2d2e','EXC00105','The balance could not be obtained. (Should resolve through API)','vend-power','BAXI','{ "status": "error", "message": "The balance could not be obtained. (Should resolve through API)", "code": "EXC00105", "errors": { "status": "error", "code": "EXC00105", "message": "The balance could not be obtained. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('750dad56-748a-4198-9d71-7d74d7968dd1','EXC00107','The cancellation of the exchange was rejected by the provider. (Should contact CDL support)','vend-power','BAXI','{ "status": "error", "message": "The cancellation of the exchange was rejected by the provider. (Should contact CDL support)", "code": "EXC00107", "errors": { "status": "error", "code": "EXC00107", "message": "The cancellation of the exchange was rejected by the provider. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4e040011-f7c1-4b79-9991-9b345463f91a','EXC00109','The service is blocked. (Should resolve through API)','vend-power','BAXI','{ "status": "error", "message": "The service is blocked. (Should resolve through API)", "code": "EXC00109", "errors": { "status": "error", "code": "EXC00109", "message": "The service is blocked. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b420ef27-0c23-4e36-bbb0-98d89987af11','EXC00112','The query of exchange failed because the exchange was never registered on the platform.','vend-power','BAXI','{ "status": "error", "message": "The query of exchange failed because the exchange was never registered on the platform.", "code": "EXC00112", "errors": { "status": "error", "code": "EXC00112", "message": "The query of exchange failed because the exchange was never registered on the platform." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('66afcf7e-88a9-4fd4-a0ad-1fb932cf701a','EXC00113','The exchange is already canceled by the provider.','vend-power','BAXI','{ "status": "error", "message": "The exchange is already canceled by the provider.", "code": "EXC00113", "errors": { "status": "error", "code": "EXC00113", "message": "The exchange is already canceled by the provider." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ad889ade-4aea-415c-9442-f0d619ad460e','EXC00114','The exchange is still pending. (Should resolve through API)','vend-power','BAXI','{ "status": "error", "message": "The exchange is still pending. (Should resolve through API)", "code": "EXC00114", "errors": { "status": "error", "code": "EXC00114", "message": "The exchange is still pending. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c40d89ff-7a30-42ae-bae8-d7a6ca37d998','EXC00115','The exchange was not sent to the provider.','vend-power','BAXI','{ "status": "error", "message": "The exchange was not sent to the provider.", "code": "EXC00115", "errors": { "status": "error", "code": "EXC00115", "message": "The exchange was not sent to the provider." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('bbae6692-8daf-4f9f-a1dd-21aea910c3ca','EXC00116','The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)','vend-power','BAXI','{ "status": "error", "message": "The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)", "code": "EXC00116", "errors": { "status": "error", "code": "EXC00116", "message": "The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f2896b54-a8a9-4280-85e6-3ca44d1e46bc','EXC00117','There was an error while calculating commissions. (Must contact CDL support immediately)','vend-power','BAXI','{ "status": "error", "message": "There was an error while calculating commissions. (Must contact CDL support immediately)", "code": "EXC00117", "errors": { "status": "error", "code": "EXC00117", "message": "There was an error while calculating commissions. (Must contact CDL support immediately)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0d92505d-1c2b-4afb-b3b9-07651121dd23','EXC00118','The sent service fee is invalid.','vend-power','BAXI','{ "status": "error", "message": "The sent service fee is invalid.", "code": "EXC00118", "errors": { "status": "error", "code": "EXC00118", "message": "The sent service fee is invalid." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3e307ced-48c6-4be6-92e7-39eb91021df3','EXC00119','The payment collector code is not recognized. (Should check client implementation)','vend-power','BAXI','{ "status": "error", "message": "The payment collector code is not recognized. (Should check client implementation)", "code": "EXC00119", "errors": { "status": "error", "code": "EXC00119", "message": "The payment collector code is not recognized. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d88515f5-8951-484c-a9cd-6dbef2f2da26','EXC00123','Service is not allowed.','vend-power','BAXI','{ "status": "error", "message": "Service is not allowed.", "code": "EXC00123", "errors": { "status": "error", "code": "EXC00123", "message": "Service is not allowed." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('5a24ae6a-1240-4660-9d7d-df106e8719a9','EXC00124','The provider platform did not respond in a timely manner. (Should resolve through API)','vend-power','BAXI','{ "status": "error", "message": "The provider platform did not respond in a timely manner. (Should resolve through API)", "code": "EXC00124", "errors": { "status": "error", "code": "EXC00124", "message": "The provider platform did not respond in a timely manner. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3edc40b4-7c23-4b9d-a9de-1a87f69a5266','EXC00125','The exchange request is not valid.','vend-power','BAXI','{ "status": "error", "message": "The exchange request is not valid.", "code": "EXC00125", "errors": { "status": "error", "code": "EXC00125", "message": "The exchange request is not valid." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('65a802d1-ec05-4141-ae14-72f3bf0dd49b','EXC00126','The cancellation failed. (Must be resolved through query API call)','vend-power','BAXI','{ "status": "error", "message": "The cancellation failed. (Must be resolved through query API call)", "code": "EXC00126", "errors": { "status": "error", "code": "EXC00126", "message": "The cancellation failed. (Must be resolved through query API call)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('34852870-cd12-4cb1-81e6-b1fb6d9825d5','EXC00127','The exchange amount is too high.','vend-power','BAXI','{ "status": "error", "message": "The exchange amount is too high.", "code": "EXC00127", "errors": { "status": "error", "code": "EXC00127", "message": "The exchange amount is too high." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('40a23caf-f473-4859-b158-5ca4eeaa42d4','EXC00130','Payment method not recognized. (Should check client implementation)','vend-power','BAXI','{ "status": "error", "message": "Payment method not recognized. (Should check client implementation)", "code": "EXC00130", "errors": { "status": "error", "code": "EXC00130", "message": "Payment method not recognized. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('341bc20c-3e0f-4908-8850-db8be649d665','EXC00131','The exchange request is not allowed at the moment.','vend-power','BAXI','{ "status": "error", "message": "The exchange request is not allowed at the moment.", "code": "EXC00131", "errors": { "status": "error", "code": "EXC00131", "message": "The exchange request is not allowed at the moment." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7a0d1747-d219-48af-be9a-e35729c244d4','EXC00144','Platform is not available to receive new requests for exchange at the moment.','vend-power','BAXI','{ "status": "error", "message": "Platform is not available to receive new requests for exchange at the moment.", "code": "EXC00144", "errors": { "status": "error", "code": "EXC00144", "message": "Platform is not available to receive new requests for exchange at the moment." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ed96c526-d546-43ad-8b1a-90d972c36834','UNK0001','Unknown error on the platform','vend-power','BAXI','{ "status": "error", "message": "Unknown error on the platform", "code": "UNK0001", "errors": { "status": "error", "code": "UNK0001", "message": "Unknown error on the platform" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4ec42f98-e1d4-42bc-8765-f31f5a08d868','EXC00001','Bad Gateway From Provider (Requery)','vend-power','BAXI','{ "status": "error", "message": "Bad Gateway From Provider (Requery)", "code": "EXC00001", "errors": { "status": "error", "code": "EXC00001", "message": "Bad Gateway From Provider (Requery)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f03c937a-16dc-4b0f-97b4-bc8f23b822c8','BX0001','Connection Timeout: Retried 3 times and no response from the service provider','requery','BAXI','{ "status": "error", "message": "Connection Timeout: Retried 3 times and no response from the service provider", "code": "BX0001", "errors": { "status": "error", "code": "BX0001", "message": "Connection Timeout: Retried 3 times and no response from the service provider" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('269eb32f-6c90-4a50-b876-6d0b1bd3129c','BX0002','Transaction does not exist','requery','BAXI','{
    "status": "error",
    "message": "Transaction not found in Baxibox upstream system",
    "code": "BX0002",
    "errors": []
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f987c609-8833-453d-a4f3-ed089be73b7c','BX0003','Invalid request parameters data','requery','BAXI','{ "status": "error", "message": "Invalid request parameters data", "code": "BX0003", "errors": { "status": "error", "code": "BX0003", "message": "Invalid request parameters data" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('db96b4d8-b868-409c-90b8-849b74ee2f57','BX0004','An In-valid user account in authorization headers sent','requery','BAXI','{ "status": "error", "message": "An In-valid user account in authorization headers sent", "code": "BX0004", "errors": { "status": "error", "code": "BX0004", "message": "An In-valid user account in authorization headers sent" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('02192f7b-9277-4cad-aa33-155f6d2a3571','BX0005','Baxi request date is too old, use the current GMT date.','requery','BAXI','{ "status": "error", "message": "Baxi request date is too old, use the current GMT date.", "code": "BX0005", "errors": { "status": "error", "code": "BX0005", "message": "Baxi request date is too old, use the current GMT date." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7f529299-2644-4c61-8010-90b2bc0930fb','BX0006','Hash Signature does not match request data sent.','requery','BAXI','{ "status": "error", "message": "Hash Signature does not match request data sent.", "code": "BX0006", "errors": { "status": "error", "code": "BX0006", "message": "Hash Signature does not match request data sent." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('08ae32da-1fcf-4642-b477-d525ca8c5c8c','BX0007','Unidentified User Account','requery','BAXI','{ "status": "error", "message": "Unidentified User Account", "code": "BX0007", "errors": { "status": "error", "code": "BX0007", "message": "Unidentified User Account" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3ebf0931-625f-4ae2-a360-54335c14898f','BX0008','The request coming from an untrusted source','requery','BAXI','{ "status": "error", "message": "The request coming from an untrusted source", "code": "BX0008", "errors": { "status": "error", "code": "BX0008", "message": "The request coming from an untrusted source" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('aaf838b0-97da-41b8-86fa-98253d27e7cb','BX0009','Client not permitted to access user data','requery','BAXI','{ "status": "error", "message": "Client not permitted to access user data", "code": "BX0009", "errors": { "status": "error", "code": "BX0009", "message": "Client not permitted to access user data" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ab31393e-4a7a-4149-b59a-6c5fdda776b5','BX0010','The agent does not exist','requery','BAXI','{ "status": "error", "message": "The agent does not exist", "code": "BX0010", "errors": { "status": "error", "code": "BX0010", "message": "The agent does not exist" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b4ed58bc-5271-4e2c-b349-9c6074e3b309','BX0011','Invalid Bearer String, expected keyword Baxi or API key','requery','BAXI','{ "status": "error", "message": "Invalid Bearer String, expected keyword Baxi or API key", "code": "BX0011", "errors": { "status": "error", "code": "BX0011", "message": "Invalid Bearer String, expected keyword Baxi or API key" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f9a1ade3-3c5e-400d-8bbb-40fe13b00fdd','BX0012','Authentication/Authorization mechanism not implemented','requery','BAXI','{ "status": "error", "message": "Authentication/Authorization mechanism not implemented", "code": "BX0012", "errors": { "status": "error", "code": "BX0012", "message": "Authentication/Authorization mechanism not implemented" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('822077fb-6466-4465-a4d9-ed24e4baaeb3','BX0013','Bearer Token not provided','requery','BAXI','{ "status": "error", "message": "Bearer Token not provided", "code": "BX0013", "errors": { "status": "error", "code": "BX0013", "message": "Bearer Token not provided" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('8e99eeb5-41a8-464b-8917-96b880f1f812','BX0014','Token has expired.','requery','BAXI','{ "status": "error", "message": "Token has expired.", "code": "BX0014", "errors": { "status": "error", "code": "BX0014", "message": "Token has expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ea36dbd7-9079-4d02-8772-36b49dcea4a3','BX0015','Invalid token supplied','requery','BAXI','{ "status": "error", "message": "Invalid token supplied", "code": "BX0015", "errors": { "status": "error", "code": "BX0015", "message": "Invalid token supplied" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3b7f586e-ddbf-4f72-a284-e83915f68479','BX0016','Token has been blacklisted,','requery','BAXI','{ "status": "error", "message": "Token has been blacklisted,", "code": "BX0016", "errors": { "status": "error", "code": "BX0016", "message": "Token has been blacklisted," }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3923f4c1-9182-4dcf-8aa5-2d0dd384a809','BX0017','Server Error: Unable to retrieve property','requery','BAXI','{ "status": "error", "message": "Server Error: Unable to retrieve property", "code": "BX0017", "errors": { "status": "error", "code": "BX0017", "message": "Server Error: Unable to retrieve property" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('df21bf6d-48f7-4d95-a468-3096a6492be4','BX0018','Request route not found,','requery','BAXI','{ "status": "error", "message": "Request route not found,", "code": "BX0018", "errors": { "status": "error", "code": "BX0018", "message": "Request route not found," }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3f54e177-649c-46d3-89ea-057f660fb60d','BX0019','Request status unknown, Connection Timeout','requery','BAXI','{ "status": "error", "message": "Request status unknown, Connection Timeout", "code": "BX0019", "errors": { "status": "error", "code": "BX0019", "message": "Request status unknown, Connection Timeout" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('429af187-20b0-4d2f-8035-e4204ff01f04','BX0020','An error occurred during transaction or request processing','requery','BAXI','{ "status": "error", "message": "An error occurred during transaction or request processing", "code": "BX0020", "errors": { "status": "error", "code": "BX0020", "message": "An error occurred during transaction or request processing" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d61eb9f3-75c1-43b7-a000-2a4bba7beb9e','BX0021','Transaction status unknown: Please query to confirm final status','requery','BAXI','{ "status": "error", "message": "Transaction status unknown: Please query to confirm final status", "code": "BX0021", "errors": { "status": "error", "code": "BX0021", "message": "Transaction status unknown: Please query to confirm final status" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('fc42a7fa-b0b4-4004-aea4-51296d1b5fbe','BX0022','requires a requery from the service provider','requery','BAXI','{ "status": "error", "message": "requires a requery from the service provider", "code": "BX0022", "errors": { "status": "error", "code": "BX0022", "message": "requires a requery from the service provider" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6493857a-c9a3-4e8c-8a42-1fff543fddd3','BX0023','Duplicate Agent Transaction Reference','requery','BAXI','{
    "status": "error",
    "message": "Duplicate Agent Transaction Reference",
    "code": "BX0023",
    "errors": {
        "status": "error",
        "code": "BX0023",
        "message": "Duplicate Agent Transaction Reference"
    }
}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('780847c7-86a0-4db4-9ef3-8df43cf8e8bc','BX0024','No response from the connecting service provider','requery','BAXI','{ "status": "error", "message": "No response from the connecting service provider", "code": "BX0024", "errors": { "status": "error", "code": "BX0024", "message": "No response from the connecting service provider" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('51011634-d252-4f53-a918-376802238023','BX0025','Error encountered during name finder validation','requery','BAXI','{ "status": "error", "message": "Error encountered during name finder validation", "code": "BX0025", "errors": { "status": "error", "code": "BX0025", "message": "Error encountered during name finder validation" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('2657a993-cb7c-44dc-9ff3-e7ccd5b66d38','BX0026','Requested biller service does not exist','requery','BAXI','{ "status": "error", "message": "Requested biller service does not exist", "code": "BX0026", "errors": { "status": "error", "code": "BX0026", "message": "Requested biller service does not exist" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('5cc3f452-4542-448f-8d32-3478a4a56cfd','PROG0001','Programming error on the platform. (Should contact CDL support)','requery','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0001", "errors": { "status": "error", "code": "PROG0001", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ff881188-b323-414e-bd84-ff4ab0f16b5b','PROG0002','Programming error on the platform. (Should contact CDL support)','requery','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0002", "errors": { "status": "error", "code": "PROG0002", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('bb4a6e9d-6665-4f65-803c-a39e62b658cd','PROG0003','Programming error on the platform. (Should contact CDL support)','requery','BAXI','{ "status": "error", "message": "Programming error on the platform. (Should contact CDL support)", "code": "PROG0003", "errors": { "status": "error", "code": "PROG0003", "message": "Programming error on the platform. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('aa04639c-a372-4d81-8619-375f3c402c0b','SEC00001','Bad credentials','requery','BAXI','{ "status": "error", "message": "Bad credentials", "code": "SEC00001", "errors": { "status": "error", "code": "SEC00001", "message": "Bad credentials" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('581399bd-5616-41f9-8b73-d975aa22eef1','SEC00002','The user account has expired.','requery','BAXI','{ "status": "error", "message": "The user account has expired.", "code": "SEC00002", "errors": { "status": "error", "code": "SEC00002", "message": "The user account has expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('580ad992-2d4d-4f72-8b22-15521b682fb9','SEC00003','User credentials have expired.','requery','BAXI','{ "status": "error", "message": "User credentials have expired.", "code": "SEC00003", "errors": { "status": "error", "code": "SEC00003", "message": "User credentials have expired." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6b09b592-673f-4764-b5cb-a0d4362174ee','SEC00004','The user is not active.','requery','BAXI','{ "status": "error", "message": "The user is not active.", "code": "SEC00004", "errors": { "status": "error", "code": "SEC00004", "message": "The user is not active." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f204d3e6-f66e-4cac-8ae4-0ce3441eacf4','SEC00005','The user is blocked.','requery','BAXI','{ "status": "error", "message": "The user is blocked.", "code": "SEC00005", "errors": { "status": "error", "code": "SEC00005", "message": "The user is blocked." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4fd90881-32ae-4a88-847e-b112edb4a11b','SEC00100','Unknown authentication error. (Should contact CDL support)','requery','BAXI','{ "status": "error", "message": "Unknown authentication error. (Should contact CDL support)", "code": "SEC00100", "errors": { "status": "error", "code": "SEC00100", "message": "Unknown authentication error. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3c17d8e6-61f2-4db5-9a3c-5b79a81d72c2','EXC00102','Not enough funds were available to complete the exchange.','requery','BAXI','{ "status": "error", "message": "Not enough funds were available to complete the exchange.", "code": "EXC00102", "errors": { "status": "error", "code": "EXC00102", "message": "Not enough funds were available to complete the exchange." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('fd595def-bbe0-4215-9798-fab40489d2e6','EXC00103','The requested service is not active. (Should resolve through API)','requery','BAXI','{ "status": "error", "message": "The requested service is not active. (Should resolve through API)", "code": "EXC00103", "errors": { "status": "error", "code": "EXC00103", "message": "The requested service is not active. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('475feb80-b419-42ff-b27d-9a6b886912b5','EXC00105','The balance could not be obtained. (Should resolve through API)','requery','BAXI','{ "status": "error", "message": "The balance could not be obtained. (Should resolve through API)", "code": "EXC00105", "errors": { "status": "error", "code": "EXC00105", "message": "The balance could not be obtained. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('aeb39f8c-15e0-4ca5-897e-47dffa73fdcc','EXC00107','The cancellation of the exchange was rejected by the provider. (Should contact CDL support)','requery','BAXI','{ "status": "error", "message": "The cancellation of the exchange was rejected by the provider. (Should contact CDL support)", "code": "EXC00107", "errors": { "status": "error", "code": "EXC00107", "message": "The cancellation of the exchange was rejected by the provider. (Should contact CDL support)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d8c23f26-549b-4eee-83d9-eda8b595f253','EXC00109','The service is blocked. (Should resolve through API)','requery','BAXI','{ "status": "error", "message": "The service is blocked. (Should resolve through API)", "code": "EXC00109", "errors": { "status": "error", "code": "EXC00109", "message": "The service is blocked. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('16a48faa-4676-4ab8-8da7-a25c9f281ac2','EXC00112','The query of exchange failed because the exchange was never registered on the platform.','requery','BAXI','{ "status": "error", "message": "The query of exchange failed because the exchange was never registered on the platform.", "code": "EXC00112", "errors": { "status": "error", "code": "EXC00112", "message": "The query of exchange failed because the exchange was never registered on the platform." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('91a01962-8633-4d27-a818-331e5beb0809','EXC00113','The exchange is already canceled by the provider.','requery','BAXI','{ "status": "error", "message": "The exchange is already canceled by the provider.", "code": "EXC00113", "errors": { "status": "error", "code": "EXC00113", "message": "The exchange is already canceled by the provider." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('a91d74c6-cbad-4ad4-8702-bff2c83ecee6','EXC00114','The exchange is still pending. (Should resolve through API)','requery','BAXI','{ "status": "error", "message": "The exchange is still pending. (Should resolve through API)", "code": "EXC00114", "errors": { "status": "error", "code": "EXC00114", "message": "The exchange is still pending. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('1250abc1-f04d-4719-94f5-5b32c2dcd036','EXC00115','The exchange was not sent to the provider.','requery','BAXI','{ "status": "error", "message": "The exchange was not sent to the provider.", "code": "EXC00115", "errors": { "status": "error", "code": "EXC00115", "message": "The exchange was not sent to the provider." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('80353174-a3fa-4055-b26e-8adc10a35195','EXC00116','The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)','requery','BAXI','{ "status": "error", "message": "The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)", "code": "EXC00116", "errors": { "status": "error", "code": "EXC00116", "message": "The exchange request was already registered on the platform with the same ID but with different values. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c520cdf4-1d9f-46d5-bb39-f2ed0fde5319','EXC00117','There was an error while calculating commissions. (Must contact CDL support immediately)','requery','BAXI','{ "status": "error", "message": "There was an error while calculating commissions. (Must contact CDL support immediately)", "code": "EXC00117", "errors": { "status": "error", "code": "EXC00117", "message": "There was an error while calculating commissions. (Must contact CDL support immediately)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f36f6a1d-5773-44c0-a6a3-5f99d1b132e1','EXC00118','The sent service fee is invalid.','requery','BAXI','{ "status": "error", "message": "The sent service fee is invalid.", "code": "EXC00118", "errors": { "status": "error", "code": "EXC00118", "message": "The sent service fee is invalid." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('97018cc6-8b44-49cc-aa18-dcf15fb31401','EXC00119','The payment collector code is not recognized. (Should check client implementation)','requery','BAXI','{ "status": "error", "message": "The payment collector code is not recognized. (Should check client implementation)", "code": "EXC00119", "errors": { "status": "error", "code": "EXC00119", "message": "The payment collector code is not recognized. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('de4b1fdc-e014-4993-b49f-96639d7889ba','EXC00123','Service is not allowed.','requery','BAXI','{ "status": "error", "message": "Service is not allowed.", "code": "EXC00123", "errors": { "status": "error", "code": "EXC00123", "message": "Service is not allowed." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('3e5790b3-c6bf-4a9f-94a2-edca04121b03','EXC00124','The provider platform did not respond in a timely manner. (Should resolve through API)','requery','BAXI','{ "status": "error", "message": "The provider platform did not respond in a timely manner. (Should resolve through API)", "code": "EXC00124", "errors": { "status": "error", "code": "EXC00124", "message": "The provider platform did not respond in a timely manner. (Should resolve through API)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('40841f70-dd55-4f10-a947-b1024e9a704d','EXC00125','The exchange request is not valid.','meter-validation','BAXI','{ "status": "error", "message": "The exchange request is not valid.", "code": "EXC00125", "errors": { "status": "error", "code": "EXC00125", "message": "The exchange request is not valid." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f7aa7400-608a-413e-ba0f-a352431248ec','EXC00125','The exchange request is not valid.','requery','BAXI','{ "status": "error", "message": "The exchange request is not valid.", "code": "EXC00125", "errors": { "status": "error", "code": "EXC00125", "message": "The exchange request is not valid." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('59c3c015-440c-4ac9-8613-870e1a4af8f1','EXC00126','The cancellation failed. (Must be resolved through query API call)','requery','BAXI','{ "status": "error", "message": "The cancellation failed. (Must be resolved through query API call)", "code": "EXC00126", "errors": { "status": "error", "code": "EXC00126", "message": "The cancellation failed. (Must be resolved through query API call)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('674a21dc-4943-4951-823b-e1c531f65352','EXC00127','The exchange amount is too high.','requery','BAXI','{ "status": "error", "message": "The exchange amount is too high.", "code": "EXC00127", "errors": { "status": "error", "code": "EXC00127", "message": "The exchange amount is too high." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('eed8df27-9745-4eb5-9cc4-df1fc829dab1','EXC00130','Payment method not recognized. (Should check client implementation)','requery','BAXI','{ "status": "error", "message": "Payment method not recognized. (Should check client implementation)", "code": "EXC00130", "errors": { "status": "error", "code": "EXC00130", "message": "Payment method not recognized. (Should check client implementation)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('474cdc65-13e6-4d21-88ad-c98999e2dd12','EXC00131','The exchange request is not allowed at the moment.','requery','BAXI','{ "status": "error", "message": "The exchange request is not allowed at the moment.", "code": "EXC00131", "errors": { "status": "error", "code": "EXC00131", "message": "The exchange request is not allowed at the moment." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ee88bcac-bac8-4d89-b25e-cf6f858dd992','EXC00144','Platform is not available to receive new requests for exchange at the moment.','requery','BAXI','{ "status": "error", "message": "Platform is not available to receive new requests for exchange at the moment.", "code": "EXC00144", "errors": { "status": "error", "code": "EXC00144", "message": "Platform is not available to receive new requests for exchange at the moment." }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d9bb3949-e64b-4452-b343-b9fe08164d1d','UNK0001','Unknown error on the platform','requery','BAXI','{ "status": "error", "message": "Unknown error on the platform", "code": "UNK0001", "errors": { "status": "error", "code": "UNK0001", "message": "Unknown error on the platform" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b4e2aee2-a661-4663-b07a-f472fc4ef14a','EXC00001','Bad Gateway From Provider (Requery)','requery','BAXI','{ "status": "error", "message": "Bad Gateway From Provider (Requery)", "code": "EXC00001", "errors": { "status": "error", "code": "EXC00001", "message": "Bad Gateway From Provider (Requery)" }}',500,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('95ef81ab-474c-476e-8be7-833243fd41a9','-1','Unauthorised Access','requery','IRECHARGE','{"status": "-1", "message": "Unauthorised Access"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ba3c2b01-f183-4d4d-a0e9-d547a81a0a29','-1','Unauthorised Access','vend-power','IRECHARGE','{"status": "-1", "message": "Unauthorised Access"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('b191ff5c-9764-40bd-ba0c-8ae08799bb34','-1','Unauthorised Access','meter-validation','IRECHARGE','{"status": "-1", "message": "Unauthorised Access"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c7a38d90-037e-4d65-9b43-6be662337da1','2','IP Blacklisted','requery','IRECHARGE','{"status": "02", "message": "IP Blacklisted"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('5eea39cf-e828-4617-9f14-b8d5c2ece38e','2','IP Blacklisted','vend-power','IRECHARGE','{"status": "02", "message": "IP Blacklisted"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('604fded8-3cdd-407d-ac47-ea980c0e30d8','2','IP Blacklisted','meter-validation','IRECHARGE','{"status": "02", "message": "IP Blacklisted"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('fc1d888f-016a-4c43-9ca6-5351338ef6f1','3','Invalid IP/Key/Vendor','requery','IRECHARGE','{"status": "03", "message": "Invalid IP/Key/Vendor"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('52633f86-50d9-492d-abd6-e1632087b0e0','3','Invalid IP/Key/Vendor','vend-power','IRECHARGE','{"status": "03", "message": "Invalid IP/Key/Vendor"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('02fe5b8e-3c7b-437e-86ff-75c735a9f571','3','Invalid IP/Key/Vendor','meter-validation','IRECHARGE','{"status": "03", "message": "Invalid IP/Key/Vendor"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('513d04e3-f295-4ab2-b17e-ab62ab470da6','4','Status not active','requery','IRECHARGE','{"status": "04", "message": "Status not active"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d9193264-44ba-490d-987c-3dbec050c3a4','4','Status not active','vend-power','IRECHARGE','{"status": "04", "message": "Status not active"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('780bc8e7-6a22-4b91-8413-ffc6136d3b68','4','Status not active','meter-validation','IRECHARGE','{"status": "04", "message": "Status not active"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('21c0e934-8795-41ee-9f7f-7ba9b628889b','5','Invalid Hash','vend-power','IRECHARGE','{"status": "05", "message": "Invalid Hash"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('1c1730cd-d424-4919-a8c1-4006ffb4545f','6','Missing Parameters','vend-power','IRECHARGE','{"status": "06", "message": "Missing Parameters"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('24055b08-e068-40ed-a098-43c71b4710b3','11','Service temporarily unavailable','vend-power','IRECHARGE','{"status": "11", "message": "Service temporarily unavailable"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('232cbcb7-835f-4969-bf98-f29a903f1555','12','Unknown User','vend-power','IRECHARGE','{"status": "12", "message": "Unknown User"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7b64a0fb-2130-4c1d-95ac-06aff29a459c','13','Invalid Meter','meter-validation','IRECHARGE','{"status": "13", "message": "Invalid Meter"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0107c2f7-c484-4f69-afa5-61b2c74a6e8d','14','Unknown Meter','meter-validation','IRECHARGE','{"status": "14", "message": "Unknown Meter"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('80182356-c403-42b2-9a73-16e74f0829da','15','Meter has Pending Transaction','vend-power','IRECHARGE','{"status": "15", "message": "Meter has Pending Transaction"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('275ab926-56a2-4751-836b-ee401b242fc4','19','Invalid Test Request','vend-power','IRECHARGE','{"status": "19", "message": "Invalid Test Request"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('67698f81-ec8d-4ea8-9885-718be6670f26','20','Duplicate Reference ID','vend-power','IRECHARGE','{"status": "20", "message": "Duplicate Reference ID"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('8ad9d5ed-8c93-40ae-98b1-c0b0316f4344','40','Amount entered too low or too high','vend-power','IRECHARGE','{"status": "40", "message": "Amount entered too low or too high"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ce32b915-1e7a-4837-be40-f34ef660c00c','41','Invalid phone number','vend-power','IRECHARGE','{"status": "41", "message": "Invalid phone number"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7a80c5e1-27da-4133-ae32-9db87f3258b2','42','Vendor Closed for Business','vend-power','IRECHARGE','{"status": "42", "message": "Vendor Closed for Business"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7399b9df-0dd7-43d1-84ae-049a17eef271','43','Sorry your request could not be completed at the moment. Please try again later.','vend-power','IRECHARGE','{"status": "43", "message": "Sorry your request could not be completed at the moment. Please try again later."}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('65e15902-bc20-4b4a-9354-04a0d65303e2','44','Insufficient Wallet Balance','vend-power','IRECHARGE','{"status": "44", "message": "Insufficient Wallet Balance"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('efa6dad7-9dbb-46e1-9a38-8c752daa1a70','50','Error encountered. Please reconfirm Meter number','vend-power','IRECHARGE','{"status": "50", "message": "Error encountered. Please reconfirm Meter number"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('f694db82-a5ce-4e71-8ac0-68cadb4c1f26','51','Network Error','vend-power','IRECHARGE','{"status": "51", "message": "Network Error"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('e06d8969-8c0f-4722-a279-0784583b124c','6','Missing Parameters','requery','IRECHARGE','{"status": "6", "message": "Missing Parameters"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('eb8ddd3e-b34f-4a1a-b398-67f920e7934a','11','Service temporarily unavailable','requery','IRECHARGE','{"status": "11", "message": "Service temporarily unavailable"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('11b458f3-9fc8-4a88-8846-4343c7d4dcdd','12','Unknown User','requery','IRECHARGE','{"status": "12", "message": "Unknown User"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('7a01eb71-990b-4864-9cca-2c04cb25e82e','13','Invalid Meter','meter-validation','IRECHARGE','{"status": "13", "message": "Invalid Meter"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9bcbd7c1-16bd-4205-87c9-9835c4426470','14','Unknown Meter','meter-validation','IRECHARGE','{"status": "14", "message": "Unknown Meter"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0c5d5d8d-4d56-461f-bc6b-0979024b0454','15','Meter has Pending Transaction','requery','IRECHARGE','{"status": "15", "message": "Meter has Pending Transaction"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('c6cb38de-6c7a-4380-b49e-f8e5815763df','19','Invalid Test Request','requery','IRECHARGE','{"status": "19", "message": "Invalid Test Request"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('ec915163-3bd6-4334-acff-334decb144f1','20','Duplicate Reference ID','requery','IRECHARGE','{"status": "20", "message": "Duplicate Reference ID"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('0b5811ee-9c6b-4626-9680-7fd8ca12a819','40','Amount entered too low or too high','requery','IRECHARGE','{"status": "40", "message": "Amount entered too low or too high"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('754d00a0-6f50-4d2a-8718-71309c49fd80','41','Invalid phone number','requery','IRECHARGE','{"status": "41", "message": "Invalid phone number"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('a0a1ccba-3d30-42d5-98e4-7961896f5313','42','Vendor Closed for Business','requery','IRECHARGE','{"status": "42", "message": "Vendor Closed for Business"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9233cf2d-0d44-4fec-b0f8-2e74ecb15e34','43','Sorry your request could not be completed at the moment. Please try again later.','requery','IRECHARGE','{"status": "43", "message": "Sorry your request could not be completed at the moment. Please try again later."}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('6f12c731-49ca-4050-936e-3ec4c6de51be','44','Insufficient Wallet Balance','requery','IRECHARGE','{"status": "44", "message": "Insufficient Wallet Balance"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('d83a2f65-3543-409f-b2c4-090d2942e4d0','50','Error encountered. Please reconfirm Meter number','requery','IRECHARGE','{"status": "50", "message": "Error encountered. Please reconfirm Meter number"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('9a6a4c2b-661a-4a8b-baa0-63b2d642d3a0','51','Network Error','requery','IRECHARGE','{"status": "51", "message": "Network Error"}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('aa34d36a-c189-4846-b976-59fca3f05094','00"','pending','requery','IRECHARGE','{
  "status": "01",
  "vend_status": "pending",
  "vend_code": "02",
  "token":"",
  "units": "333.300",
  "response_hash": "01f63d91e0ae578f9e91f54c929da04c8c28e530"
}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('4db69bd1-286e-4df1-a5bb-dce48825de86','00"','failed','requery','IRECHARGE','{
  "status": "00",
  "vend_status": "failed",
  "vend_code": "02",
  "token":"",
  "units": "333.300",
  "response_hash": "01f63d91e0ae578f9e91f54c929da04c8c28e530"
}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
INSERT INTO public."MockEndpointData"(id,"vendorCode","description","apiType","vendorName","vendorResponse","httpCode","apiStatusType","activated","updatedAt","createdAt") VALUES ('fc4a1f9d-3c9b-448c-91bd-181ffde06410','00"','unknown','requery','IRECHARGE','{
  "status": "03",
  "vend_status": "unknown",
  "vend_code": "02",
  "token":"",
  "units": "333.300",
  "response_hash": "01f63d91e0ae578f9e91f54c929da04c8c28e530"
}',200,'FAILURE','FALSE','2024-02-22 08:13:37.353+00','2024-02-22 07:13:37.353+00');
