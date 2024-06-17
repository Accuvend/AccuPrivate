import Complaint, {
    ICreateComplaint,
    IUpdateComplaint,
} from "../models/Complaint.model";
import Entity from "../models/Entity/Entity.model";
import ComplaintReply, {
    ICreateComplaintReply,
    IUpdateComplaintReply,
} from "../models/ComplaintReply.model";
import logger from "../utils/Logger";
import { v4 as uuidv4 } from "uuid";
import ZohoIntegrationSettings from "../models/ZohoIntegrationSettings.model";
import { ZOHO_BASE_URL } from "../utils/Constants";
import FormData from 'form-data'
import fs from 'fs'
/**
 * Service class for handling operations related to Zoho Integrations
 */
export default class ZohoIntegrationService {
    /**
     * Generates a new access token for Zoho integration.
     * @returns A Promise resolving to the updated Zoho integration settings containing the access token or void if an error occurs.
     */
    static async generateAccessToken(): Promise<ZohoIntegrationSettings | void> {
        try {
            const zohoSettings: ZohoIntegrationSettings | null =
                await ZohoIntegrationSettings.findOne();
            if (zohoSettings == null) throw Error("Empty Zoho Setting");
            const apiresponse = await fetch(
                `https://accounts.zoho.com/oauth/v2/token?code=${zohoSettings?.authorizationcode}&grant_type=authorization_code&client_id=${zohoSettings?.clientid}&client_secret=${zohoSettings?.clientsecret}&redirect_uri=${zohoSettings?.redirecturl}`,
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const apidata = await apiresponse.json();

            if (apidata?.error) {
                throw Error(apidata?.error);
            }

            await zohoSettings.update({
                refreshtoken: apidata.refresh_token || "",
                accesstoken: apidata.access_token || "",
            });

            return zohoSettings;
        } catch (err: any) {
            logger.error(
                `${err.message}
      ${err.stack}` ||
                    `Error Generating Access Token 
      ${err.stack}`
            );
            throw err;
        }
    }

    /**
     * Refreshes the access token for Zoho integration.
     * @returns A Promise resolving to the updated Zoho integration settings containing the refreshed access token or void if an error occurs.
     */
    static async refreshAccessToken(): Promise<ZohoIntegrationSettings | void> {
        try {
            const zohoSettings: ZohoIntegrationSettings | null =
                await ZohoIntegrationSettings.findOne();
            if (zohoSettings == null) throw Error("Empty Zoho Setting");
            const apiresponse = await fetch(
                `https://accounts.zoho.com/oauth/v2/token?refresh_token=${zohoSettings?.refreshtoken}&grant_type=refresh_token&client_id=${zohoSettings?.clientid}&client_secret=${zohoSettings?.clientsecret}&redirect_uri=${zohoSettings?.redirecturl}`,
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const apidata = await apiresponse.json();

            if (apidata?.error) {
                throw Error(apidata?.error);
            }

            await zohoSettings.update({
                accesstoken: apidata.access_token || "",
            });

            return zohoSettings;
        } catch (err: any) {
            logger.error(`Error Refreshing Access Token ${err.stack}`);
            throw err;
        }
    }

    /**
     * Makes an API call to a Zoho endpoint.
     * @param url The URL of the Zoho endpoint.
     * @param zohoSettings The Zoho integration settings containing authentication and organization information.
     * @param method The HTTP method to use for the API call (default is 'GET').
     * @param body The request body data (optional).
     * @param contentType the content type of the api call by default "application/json"
     * @returns A Promise resolving to the response data from the API call.
     * @throws Throws an error if the API call fails.
     */

    static async zohoAPICall(
        url: string,
        zohoSettings: ZohoIntegrationSettings,
        method: string | "GET" = "GET",
        body: Object | undefined = undefined,
        contentType: string = "application/json"
    ) {
        try {
            let url_body: Object;
            console.log('called ----->');
            if (body) {
            // if (body as { [key: string]: any }) {
                if (contentType === "multipart/form-data") {
                    // console.log(body, '++++++++');
                    const formData = new FormData()
                    const newBody : { [key: string]: any } = {...body}
                    for(let key in newBody){
                        const _value: any = newBody[key] 
                        
                        if(key === "file"){ 
                          // console.log(_value , "file ++++ uploading now ")
                          formData.append(key,_value.buffer, _value.originalname)
                        }
                        else formData.append(key, _value)
                    }

                    console.log(formData,contentType)
                    
                    url_body = {
                        method,
                        mode: "no-cors",
                        headers: {
                            "Content-Type": contentType,
                            Authorization: `Zoho-oauthtoken ${zohoSettings.accesstoken}`,
                            Orgid: zohoSettings.organizationId,
                        },
                        body: formData
                    };
                } else {
                    url_body = {
                        method,
                        mode: "no-cors",
                        headers: {
                            "Content-Type": contentType,
                            Authorization: `Zoho-oauthtoken ${zohoSettings.accesstoken}`,
                            Orgid: zohoSettings.organizationId,
                        },
                        body: JSON.stringify(body),
                    };
                }
            } else {
                url_body = {
                    method,
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Zoho-oauthtoken ${zohoSettings.accesstoken}`,
                        Orgid: zohoSettings.organizationId,
                    },
                };
            }
            console.log(ZOHO_BASE_URL + url);
            const apiresponse = await fetch(ZOHO_BASE_URL + url, url_body);
            if (contentType === "multipart/form-data") {
              const apidata = await apiresponse.text()
              console.log(apidata)
              return apidata;
            }else{
              const apidata = await apiresponse.json();
              console.log(apidata)
              return apidata;
            }
              
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sends a request to a Zoho API endpoint, handling access token authentication and refreshing if necessary.
     * @param url The URL of the Zoho API endpoint.
     * @param method The HTTP method to use for the request (default is 'GET').
     * @param body The request body data (optional).
     * @param contentType the content type of the api call by default "application/json"
     * @returns A Promise resolving to the response data from the Zoho API endpoint.
     * @throws Throws an error if the request fails or if the access token is invalid or expired.
     */

    static async zohoEndpoint(
        url: string,
        method: string | "GET" = "GET",
        body: Object | undefined = undefined,
        contentType: string = "application/json"
    ) {
        try {
            const zohoSettings: ZohoIntegrationSettings | null =
                await ZohoIntegrationSettings.findOne();
            if (zohoSettings == null) throw Error("Empty Zoho Setting");

            if (
                zohoSettings.accesstoken === "" ||
                zohoSettings.refreshtoken === "" ||
                zohoSettings.accesstoken === " " ||
                zohoSettings.refreshtoken === " "
            ) {
                await this.generateAccessToken();
            }

            const apidata = await this.zohoAPICall(
                url,
                zohoSettings,
                method,
                body,
                contentType
            );

            if (apidata?.error) {
                throw Error(apidata?.error);
            }
            if (apidata?.errorCode === "INVALID_OAUTH")
                throw new Error("Expired Authetication token");

            return apidata;
        } catch (error: any) {
            try {
                // check if the  token has expired
                if (error?.message === "Expired Authetication token") {
                    const updatedSetting: ZohoIntegrationSettings | void =
                        await this.refreshAccessToken();

                    if (updatedSetting == null)
                        throw Error("Empty Zoho Setting");

                    const apidata = await this.zohoAPICall(
                        url,
                        updatedSetting,
                        method,
                        body
                    );
                    if (apidata?.error) {
                        throw Error(apidata?.error);
                    }

                    return apidata;
                } else {
                    logger.error(`Error Occured getting zoho access zoho Endpoint
           ${error.stack}`);
                    throw error;
                }
            } catch (error: any) {
                logger.error(`Error Occured refreshing token for Zoho
        ${error.stack}`);
                throw error;
            }
        }
    }
}
