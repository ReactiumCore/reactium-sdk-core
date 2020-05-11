import Utils from '../utils';

const Server = {};

Server.Middleware = Utils.registryFactory('ExpressMiddleware', 'name');
Server.AppScripts = Utils.registryFactory('AppScripts', 'name');
Server.AppSnippets = Utils.registryFactory('AppSnippets', 'name');
Server.AppStyleSheets = Utils.registryFactory('AppStyleSheets', 'name');
Server.AppGlobals = Utils.registryFactory('AppGlobals', 'name');

export default Server;
