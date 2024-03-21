import { NextFunction, Request, Response } from "express";
import MockEndpointData, { APISTATUSTYPE } from "../../models/MockAPI.model";
import MockApiService from "../../services/MockApiData.service";


// Class definition for MockExternalControllerAPI

export default class MockExternalControllerAPI {

     // Maps data to the response object
    static mapDataToResponse(mockEndpointData: MockEndpointData , response: Response):Response<any, Record<string, any>>{
        return response.status(mockEndpointData.httpCode).json(mockEndpointData.vendorResponse)
    }

    

    // Validates meter for Irecharge
    static async validateMeterIrecharge(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'meter-validation',
                activated: true,
                vendorName: 'IRECHARGE'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Validates meter for Buypower
    static async validateMeterBuyPower(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'meter-validation',
                activated: true,
                vendorName: 'BUYPOWER'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }

    // Validates meter for Baxi 
    static async validateMeterBaxi(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'meter-validation',
                activated: true,
                vendorName: 'BAXI'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }

    // Validates meter for Irecharge
    static async vendPowerIrecharge(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'vend-power',
                activated: true,
                vendorName: 'IRECHARGE'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Validates meter for BuyPower
    static async vendPowerBuyPower(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'vend-power',
                activated: true,
                vendorName: 'BUYPOWER'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Validates meter for Baxi
    static async vendPowerBaxi(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'vend-power',
                activated: true,
                vendorName: 'BAXI'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }


     // Requery for Irecharge
     static async requeryIrecharge(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'requery',
                activated: true,
                vendorName: 'IRECHARGE'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Requery for BuyPower
    static async requeryBuyPower(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'requery',
                activated: true,
                vendorName: 'BUYPOWER'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Requery for Baxi
    static async requeryBaxi(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'requery',
                activated: true,
                vendorName: 'BAXI'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }


    // Check Disco up for BuyPower
    static async checkDiscoUpBuyPower(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'disco-up',
                activated: true,
                vendorName: 'BUYPOWER'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }
    // Check Disco up for Baxi
    static async checkDiscoUpBaxi(req: Request, res: Response, next: NextFunction){
        try{
            // Retrieve mock data for meter validation from the MockApiService
            const mockEndpointData: MockEndpointData | void  = await MockApiService.getMockData({
                apiType: 'disco-up',
                activated: true,
                vendorName: 'BAXI'
            })

            // If no mock data is retrieved, return a 500 server error response
            if (typeof mockEndpointData === 'undefined') {
                return res.status(500).json({
                    message: 'Server Error: No mock endpoint found'
                })
            }

            // Map the retrieved data to the response
            return MockExternalControllerAPI.mapDataToResponse(mockEndpointData , res)
        }catch(err){
            // Catch and handle errors
            console.log(err)
            return res.status(500).json({
                message: 'Server Error'
            })
        }
    }



    
    
}


