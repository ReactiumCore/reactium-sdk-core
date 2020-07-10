import Utils from '../utils';

const Server = {};

Server.Middleware = Utils.registryFactory('ExpressMiddleware', 'name', Utils.Registry.MODES.CLEAN);

Server.AppHeaders = Utils.registryFactory('AppHeaders', 'name', Utils.Registry.MODES.CLEAN);

Server.AppScripts = Utils.registryFactory('AppScripts', 'name', Utils.Registry.MODES.CLEAN);

Server.AppSnippets = Utils.registryFactory('AppSnippets', 'name', Utils.Registry.MODES.CLEAN);

Server.AppStyleSheets = Utils.registryFactory('AppStyleSheets', 'name', Utils.Registry.MODES.CLEAN);

Server.AppBindings = Utils.registryFactory('AppBindings', 'name', Utils.Registry.MODES.CLEAN);

Server.AppGlobals = Utils.registryFactory('AppGlobals', 'name', Utils.Registry.MODES.CLEAN);

export default Server;
