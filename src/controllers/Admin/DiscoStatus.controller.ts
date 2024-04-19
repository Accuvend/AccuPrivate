import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import DiscoStatusService from "../../services/DiscoStatus.service";

export default class discoStatusController {
    static async getDiscoStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const discoStatus = await DiscoStatusService.viewDiscoStatuses();

        res.status(200).send({
            success: true,
            message: "Disco status fetched successfully",
            data: { discoStatus },
        });
    }
}
