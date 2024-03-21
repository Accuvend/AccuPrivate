import { Request, Response, NextFunction } from 'express';
import { CustomAPIError, CustomError, } from '../utils/Errors';
import logger, { Logger } from '../utils/Logger';
require('newrelic');

function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): Response {
    console.error(err)
    logger.error(err.stack);
    if (err instanceof CustomAPIError && err.statusCode !== 500) {
        Logger.apiResponse.error(err.message, err.meta)
        return res.status(err.statusCode).send({
            status: 'error',
            error: true,
            message: err.message,
        });
    } else if (err instanceof CustomError) {
        Logger.kafkaFailure.error(err.message, err.meta)
    }

    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', error: true, message: 'Ops, Something went wrong' });
}

export default errorHandler;
