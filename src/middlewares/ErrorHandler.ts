import { Request, Response, NextFunction } from 'express';
import { CustomAPIError, } from '../utils/Errors';
import logger from '../utils/Logger';
require("newrelic");``

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response {
    console.error(err)
    logger.error(err.stack);
    if (err instanceof CustomAPIError && err.statusCode !== 500) {
        return res.status(err.statusCode).send({
            status: 'error',
            error: true,
            message: err.message,
        });
    }

    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', error: true, message: 'Ops, Something went wrong' });
}

export default errorHandler;
