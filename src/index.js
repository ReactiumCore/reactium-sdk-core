import './node-polyfill';
import pkgjson from '../package';
import {
    Cache,
    Component,
    Enums,
    Handle,
    Hook,
    Pulse,
    Plugin,
    Utils,
    ZoneRegistry,
    Prefs,
    Server,
} from './sdks';

export * from './sdks';
export * from './named-exports';

export {
    Cache,
    Component,
    Enums,
    Handle,
    Hook,
    Pulse,
    Plugin,
    Utils,
    ZoneRegistry,
    Prefs,
    Server,
};

export default {
    Cache,
    Component,
    Enums,
    Handle,
    Hook,
    Pulse,
    Utils,
    Plugin,
    Zone: ZoneRegistry,
    Prefs,
    Server,
    version: pkgjson.version,
};
