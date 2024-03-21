import { IRechargeAirtimeApi } from "./Airtime";
import { IRechargeDataApi } from "./Data";

export class IRechargeApi {
    static Airtime = IRechargeAirtimeApi
    static Data = IRechargeDataApi
}