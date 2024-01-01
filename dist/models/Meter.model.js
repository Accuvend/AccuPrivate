"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and dependencies
const sequelize_typescript_1 = require("sequelize-typescript");
const User_model_1 = __importDefault(require("./User.model"));
const PowerUnit_model_1 = __importDefault(require("./PowerUnit.model"));
const Transaction_model_1 = __importDefault(require("./Transaction.model"));
// Define the Sequelize model for the "Meter" table
let Meter = class Meter extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.IsUUID)(4),
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Meter.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Meter.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Meter.prototype, "meterNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Meter.prototype, "disco", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", Object)
], Meter.prototype, "vendType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_model_1.default),
    (0, sequelize_typescript_1.IsUUID)(4),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Meter.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_model_1.default),
    __metadata("design:type", User_model_1.default)
], Meter.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PowerUnit_model_1.default),
    __metadata("design:type", Array)
], Meter.prototype, "powerUnits", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_model_1.default),
    __metadata("design:type", Array)
], Meter.prototype, "transactions", void 0);
Meter = __decorate([
    sequelize_typescript_1.Table
], Meter);
exports.default = Meter;
