import Utils from '../utils';

const Server = {};

Server.Middleware = Utils.registryFactory('ExpressMiddleware', 'name', Utils.Registry.MODES.CLEAN);

export default Server;
