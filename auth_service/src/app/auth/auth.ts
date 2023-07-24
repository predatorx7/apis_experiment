import express = require('express');
import { RoutesConfig } from "../../config/routes_config";
import * as controllers from './controllers';
import { loginSchema, tokenSchema } from './schema';
import { bodyValidator } from '../../utils/validators';
import { safeResponse } from '../../utils/safe_response';

export class AuthRoutes extends RoutesConfig {
    constructor(router: express.Router) {
        super(router, 'AuthRoutes', '/auth');
    }

    build(router: express.Router) {
        router.post('/login', bodyValidator(loginSchema), controllers.login);
        router.get('/authorize', controllers.authorize);
        // this.app.post(`/auth`, [
        //     authMiddleware.validateBodyRequest,
        //     authMiddleware.verifyUserPassword,
        //     authController.createJWT,
        // ]);
        // this.app.post(`/auth/refresh-token`, [
        //     jwtMiddleware.validJWTNeeded,
        //     jwtMiddleware.verifyRefreshBodyField,
        //     jwtMiddleware.validRefreshNeeded,
        //     authController.createJWT,
        // ]);
    }
}
