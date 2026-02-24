/**
 * Route Barrel Export
 */

export { default as authRoutes } from './authRoutes.js';
export { default as leadRoutes } from './leadRoutes.js';
export { default as userRoutes } from './userRoutes.js';
export { default as dashboardRoutes, analyticsRouter as analyticsRoutes } from './dashboardRoutes.js';
export {
    opportunitiesRouter,
    partnersRouter,
    vendorsRouter,
    propertiesRouter,
    ticketsRouter,
    campaignsRouter,
} from './entityRoutes.js';
export * from './loanRoutes.js';
export { default as surveyRoutes } from './surveyRoutes.js';
