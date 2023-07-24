import express = require('express');

//* Include joi to check error type 
import Joi from 'joi';
import { ApplicationErrors, makeError } from '../commons/errors';
import pino from 'pino';

export const bodyValidator = (schema: Joi.ObjectSchema<any>) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body)
            req.body = validated
            return next()
        } catch (err) {
            pino().error({error: err});
            if (Joi.isError(err)) {
                return res.status(422).json(makeError(ApplicationErrors.VALIDATION_ERROR, err.message));
            }
            return res.status(500).json(makeError(ApplicationErrors.UNEXPECTED_ERROR))
        }
    }
}
