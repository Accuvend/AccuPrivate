type HttpStatusCode = 400 | 401 | 403 | 404 | 407 | 408 | 500 | 504;

type ErrorMeta = {
    transactionId?: string;
} & Record<string, any>;
export class CustomError extends Error {
    meta?: ErrorMeta;

    constructor(
        message: string,
        meta?: { transactionId?: string } & Record<string, any>,
    ) {
        super(message);
        this.meta = meta;
    }
}

export class CustomAPIError extends CustomError {
    statusCode: HttpStatusCode;

    constructor(
        message: string,
        statusCode: HttpStatusCode,
        meta: ErrorMeta | undefined = undefined,
    ) {
        super(message, meta);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 400, meta);
    }
}

export class UnauthenticatedError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 401, meta);
    }
}

export class ForbiddenError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 403, meta);
    }
}

export class NotFoundError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 404, meta);
    }
}

export class InternalServerError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 500, meta);
    }
}

export class GateWayTimeoutError extends CustomAPIError {
    constructor(message: string, meta?: ErrorMeta) {
        super(message, 504, meta);
    }
}

