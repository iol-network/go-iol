import { validationResult } from 'express-validator';

export const checkParams = async (req: any, res: any, next: any) => {

    let errors: any = validationResult(req);

    if (errors && errors.errors && errors.errors.length > 0) {

        res.send({
            success: false,
            error: "INVALID_PARAMS",
            metadata: errors.errors
        });
        return;

    }
    next();

}