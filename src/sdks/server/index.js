import { Registry, registryFactory } from '../utils';

export * from './annotation';

const Server = {};
Server.Middleware = registryFactory('ExpressMiddleware', 'name', Registry.MODES.CLEAN);

export { Server as default, Server };
