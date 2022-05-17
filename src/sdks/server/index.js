import { Registry, registryFactory } from '../utils';

const Server = {};

Server.Middleware = registryFactory('ExpressMiddleware', 'name', Registry.MODES.CLEAN);

export { Server as default, Server };
