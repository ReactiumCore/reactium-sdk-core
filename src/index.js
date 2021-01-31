import './node-polyfill';
import Cache from './cache';
import Component from './component';
import Enums from './enums';
import Handle from './handle';
import Hook from './hook';
import Pulse from './pulse';
import Plugin from './plugin';
import Utils from './utils';
import Zone from './zone';
import Prefs from './prefs';
import Server from './server';
import pkgjson from '../package';

export * from './named-exports';

export { default as Cache } from './cache';
export { default as Component } from './component';
export { default as Enums } from './enums';
export { default as Handle } from './handle';
export { default as Hook } from './hook';
export { default as Pulse } from './pulse';
export { default as Plugin } from './plugin';
export { default as Utils } from './utils';
export { default as Registry } from './utils/registry';
export { default as ZoneRegistry } from './zone';
export { default as Prefs } from './prefs';
export { default as Server } from './server';

export default {
    Cache,
    Component,
    Enums,
    Handle,
    Hook,
    Pulse,
    Utils,
    Plugin,
    Zone,
    Prefs,
    Server,
    version: pkgjson.version,
};
