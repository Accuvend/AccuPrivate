import MockEndpointData from "../models/MockAPI.model";
import { IMockEndpointData } from "../models/MockAPI.model";

export default class MockApiService {

    static async getMockData(where: any): Promise<MockEndpointData | void>{
        try{
            const data : MockEndpointData | null = await MockEndpointData.findOne({
                where
            })
            if(data === null) throw Error('No item  found')
            return data 
            
        }catch(err){
            throw err
        }
        
    }

    static async getAllMockData (){

    }

    static async updateMockData (){

    }
    static mapDataToResponse(mockdata : MockEndpointData) : any{
        
    }
}