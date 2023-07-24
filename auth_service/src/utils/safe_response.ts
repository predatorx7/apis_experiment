import express = require('express');

//* Include joi to check error type 
import Joi from 'joi';
import { ApplicationErrors, makeError } from '../commons/errors';
import pino from 'pino';

export const safeResponse = (handler: any) => {
    return async (req: express.Request, res: express.Response) => {
        try {
            return await handler(req, res);
        } catch (err) {
            pino().error({error: err});
            return res.status(500).json(makeError(ApplicationErrors.UNEXPECTED_ERROR))
        }
    }
}
