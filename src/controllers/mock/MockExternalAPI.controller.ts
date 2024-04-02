import { NextFunction, Request, Response } from "express";
import MockEndpointData, { APISTATUSTYPE } from "../../models/MockAPI.model";
import MockApiService from "../../services/MockApiData.service";


// Class definition for MockExternalControllerAPI

export default class MockExternalControllerAPI {

    /**
     * Maps data to the response object.
     * @param mockEndpointData MockEndpointData object containing response data.
     * @param response Express Response object.
     * @returns Express Response object with mapped data.
     */
    static mapDataToResponse(mockEndpointData: MockEndpointData , response: Response):Response<any, Record<string, any>>{
        let code: number = 500
        if(mockEndpointData.httpCode) code = mockEndpointData.httpCode
        return response.status(code).json(mockEndpointData.vendorResponse)
    }


    /**
     * Sets Vendor active Request response
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
    static async setVendorActiveRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, vendor, endpoint } = req.body;
            console.log(id, vendor, endpoint )
            await MockApiService.setMockEndpointActive(id, vendor, endpoint);
            return res.status(200).json({
                message : 'updated message to default response'
            })
        } catch (err) {
            // Catch and handle errors
            console.log(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    }

    

    /**
     * Validates meter for Irecharge vendor.
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Validates meter for Buypower
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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

     /**
     * Validates meter for Baxi 
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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

     /**
     * Vend Power for Irecharge
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Vend Power for BuyPower
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Vend Power for Baxi
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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


     /**
     *Requery for Irecharge
      * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Requery for BuyPower
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Requery for Baxi
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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


     /**
     * Check Disco up for BuyPower
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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
     /**
     * Check Disco up for Baxi
     * @param req Express Request object.
     * @param res Express Response object.
     * @param next Express NextFunction object.
     */
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


