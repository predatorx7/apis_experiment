import express = require('express');
import { ApplicationErrors, makeError } from '../../commons/errors';

export const login = (req: express.Request, res: express.Response) => {
    if (req.body.username == 'admin' && req.body.password == 'password') {
        return res.status(200).json({ "token": "33zzkh1em7PMHXOaXRdDvIouuvuzIDdCig8kyVvLTh7ioGub2ZSr229Cw4zZXASV" });
    }

    return res.status(401).json(makeError(ApplicationErrors.INVALID_CREDENTIALS, 'Username or password is incorrect'))
};

export const authorize = (req: express.Request, res: express.Response) => {
    if (req.headers.authorization == "Bearer 33zzkh1em7PMHXOaXRdDvIouuvuzIDdCig8kyVvLTh7ioGub2ZSr229Cw4zZXASV" ) {
        return res.status(200).send({"message": "User authorized"});
    }

    return res.status(403).json(makeError(ApplicationErrors.NOT_ALLOWED, 'You are not allowed to use this resource'))
};
