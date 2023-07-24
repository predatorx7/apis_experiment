import express = require('express');
import { RoutesConfig } from './config/routes_config';
import { AuthRoutes } from './app/auth/auth';

export const getRoutes = (
    router: express.Router,
): RoutesConfig[] => {
    return [
        new AuthRoutes(router),
    ]
}
