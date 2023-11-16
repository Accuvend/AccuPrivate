"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_service_1 = __importDefault(require("../../services/Transaction.service"));
const Transaction_model_1 = __importStar(require("../../models/Transaction.model"));
const uuid_1 = require("uuid");
const User_service_1 = __importDefault(require("../../services/User.service"));
const Meter_service_1 = __importDefault(require("../../services/Meter.service"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const Meter_model_1 = __importDefault(require("../../models/Meter.model"));
const Vendor_service_1 = __importDefault(require("../../services/Vendor.service"));
const PowerUnit_service_1 = __importDefault(require("../../services/PowerUnit.service"));
const Constants_1 = require("../../utils/Constants");
const Errors_1 = require("../../utils/Errors");
const Helper_1 = require("../../utils/Helper");
const Email_1 = __importStar(require("../../utils/Email"));
const ResponseTrimmer_1 = __importDefault(require("../../utils/ResponseTrimmer"));
class VendorController {
    static validateMeter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meterNumber, disco, phoneNumber, email, vendType } = req.body;
            const superagent = Constants_1.DEFAULT_ELECTRICITY_PROVIDER; // BUYPOWERNG or BAXI
            const transactionId = (0, uuid_1.v4)();
            const partnerId = req.key;
            // We Check for Meter User *
            const response = superagent != 'BUYPOWERNG'
                ? yield Vendor_service_1.default.buyPowerValidateMeter({
                    transactionId,
                    meterNumber,
                    disco,
                    vendType
                }).catch(e => { throw new Errors_1.BadRequestError('Meter validation failed'); })
                : yield Vendor_service_1.default.baxiValidateMeter(disco, meterNumber, vendType)
                    .catch(e => { throw new Errors_1.BadRequestError('Meter validation failed'); });
            // Add User
            const user = yield User_service_1.default.addUser({
                id: (0, uuid_1.v4)(),
                address: response.address,
                email: email,
                name: response.name,
                phoneNumber: phoneNumber,
            });
            const transaction = yield Transaction_service_1.default.addTransaction({
                id: transactionId,
                amount: '0',
                status: Transaction_model_1.Status.PENDING,
                superagent: superagent,
                paymentType: Transaction_model_1.PaymentType.PAYMENT,
                transactionTimestamp: new Date(),
                disco: disco,
                userId: user.id,
                partnerId: partnerId,
            });
            const meter = yield Meter_service_1.default.addMeter({
                id: (0, uuid_1.v4)(),
                address: response.address,
                meterNumber: meterNumber,
                userId: user.id,
                disco: disco,
                vendType,
            });
            yield transaction.update({ meterId: meter.id });
            const successful = transaction instanceof Transaction_model_1.default && user instanceof User_model_1.default && meter instanceof Meter_model_1.default;
            if (!successful)
                throw new Errors_1.InternalServerError('An error occured while validating meter');
            res.status(200).json({
                status: 'success',
                data: {
                    transaction: {
                        transactionId: transaction.id,
                        status: transaction.status,
                    },
                    meter: {
                        disco: meter.disco,
                        number: meter.meterNumber,
                        address: meter.address,
                        phone: user.phoneNumber,
                        vendType: meter.vendType,
                        name: user.name,
                    }
                }
            });
        });
    }
    static requestToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transactionId, bankRefId, bankComment, amount, vendType } = req.query;
            if (!bankRefId)
                throw new Errors_1.BadRequestError('Transaction reference is required');
            const transactionRecord = yield Transaction_service_1.default.viewSingleTransaction(transactionId);
            if (!transactionRecord) {
                throw new Errors_1.BadRequestError('Transaction does not exist');
            }
            const disco = transactionRecord.disco;
            // Check if Disco is Up
            const checKDisco = yield Vendor_service_1.default.buyPowerCheckDiscoUp(disco);
            if (!checKDisco)
                throw new Errors_1.BadRequestError('Disco is currently down');
            // Check if bankRefId has been used before
            const existingTransaction = yield Transaction_service_1.default.viewSingleTransactionByBankRefID(bankRefId);
            if (existingTransaction instanceof Transaction_model_1.default) {
                throw new Errors_1.BadRequestError('Bank reference has been used before');
            }
            const transactionHasCompleted = transactionRecord.status === Transaction_model_1.Status.COMPLETE;
            if (transactionHasCompleted) {
                throw new Errors_1.BadRequestError('Transaction has been completed before');
            }
            //  Get Meter 
            const meter = yield transactionRecord.$get('meter');
            if (!meter) {
                throw new Errors_1.InternalServerError(`Transaction ${transactionRecord.id} does not have a meter`);
            }
            const user = yield transactionRecord.$get('user');
            if (!user) {
                throw new Errors_1.InternalServerError(`Transaction ${transactionRecord.id} does not have a user`);
            }
            // Initiate Purchase for token
            const tokenInfo = yield Vendor_service_1.default.buyPowerVendToken({
                transactionId,
                meterNumber: meter.meterNumber,
                disco,
                amount: amount,
                phone: user.phoneNumber,
                vendType: vendType
            }).catch(error => error);
            if (tokenInfo instanceof Error) {
                if (tokenInfo.message === 'Transaction timeout') {
                    yield Transaction_service_1.default.updateSingleTransaction(transactionId, { status: Transaction_model_1.Status.PENDING, bankComment, bankRefId });
                    throw new Errors_1.GateWayTimeoutError('Transaction timeout');
                }
                throw tokenInfo;
            }
            const discoLogo = Constants_1.DISCO_LOGO[disco.toLowerCase()];
            // Add Power Unit to store token 
            const newPowerUnit = yield PowerUnit_service_1.default.addPowerUnit({
                id: (0, uuid_1.v4)(),
                transactionId: transactionId,
                disco: disco,
                discoLogo,
                amount: amount,
                meterId: meter.id,
                superagent: transactionRecord.superagent,
                address: meter.address,
                token: Constants_1.NODE_ENV === 'development' ? (0, Helper_1.generateRandomToken)() : tokenInfo.data.token,
                tokenNumber: tokenInfo.token,
                tokenUnits: tokenInfo.units
            });
            // Update Transaction
            // TODO: Add request token event to transaction
            yield Transaction_service_1.default.updateSingleTransaction(transactionId, { amount, bankRefId, bankComment, status: Transaction_model_1.Status.COMPLETE });
            Email_1.default.sendEmail({
                to: user.email,
                subject: 'Token Purchase',
                html: yield new Email_1.EmailTemplate().receipt({
                    transaction: transactionRecord,
                    meterNumber: meter === null || meter === void 0 ? void 0 : meter.meterNumber,
                    token: newPowerUnit.token
                })
            });
            //return PowerUnit
            res.status(200).json({
                status: 'success',
                message: 'Token retrieved successfully',
                data: {
                    newPowerUnit: ResponseTrimmer_1.default.trimPowerUnit(newPowerUnit)
                }
            });
        });
    }
    static getDiscos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let discos = [];
            switch (Constants_1.DEFAULT_ELECTRICITY_PROVIDER) {
                case 'BAXI':
                    discos = yield Vendor_service_1.default.baxiFetchAvailableDiscos();
                    break;
                case 'BUYPOWERNG':
                    discos = yield Vendor_service_1.default.buyPowerFetchAvailableDiscos();
                    break;
                default:
                    discos = [];
                    break;
            }
            res.status(200).json({
                status: 'success',
                message: 'Discos retrieved successfully',
                data: {
                    discos: discos
                }
            });
        });
    }
    static checkDisco(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { disco } = req.query;
            let result = false;
            switch (Constants_1.DEFAULT_ELECTRICITY_PROVIDER) {
                case 'BAXI':
                    result = yield Vendor_service_1.default.baxiCheckDiscoUp(disco);
                    break;
                case 'BUYPOWERNG':
                    result = yield Vendor_service_1.default.buyPowerCheckDiscoUp(disco);
                    break;
                default:
                    throw new Errors_1.InternalServerError('An error occured');
            }
            res.status(200).json({
                status: 'success',
                message: 'Disco check successful',
                data: {
                    discAvailable: result
                }
            });
        });
    }
}
exports.default = VendorController;