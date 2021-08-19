import _ from 'underscore';
import op from 'object-path';
import Hook from '../hook';
import Enums from '../enums';

const plugins = {};
const Plugin = {};
const prematureCallError = Enums.Plugin.prematureCallError;

Plugin.ready = false;

Plugin.callbacks = ID => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Plugin.callbacks()')));
        return;
    }

    if (ID && ID in plugins) {
        plugins[ID].callback();
    } else {
        _.sortBy(Object.values(plugins), 'order').forEach(({ callback }) =>
            callback(),
        );
    }
    return Promise.resolve();
};

/**
 * @api {Function} Plugin.register(ID,order) Plugin.register()
 * @apiName Plugin.register
 * @apiDescription Register a Reactium plugin.
 * @apiParam {String} ID the plugin id
 * @apiParam {Integer} [order=Enums.priority.neutral] Priority of the plugin initialization respective to other existing plugins.
 * @apiGroup Reactium.Plugin
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';

const newReducer = (state = { active: false }, action) => {
    if (action.type === 'ACTIVATE') {
        return {
            ...state,
            active: true,
        };
    }
    return state;
};

const register = async () => {
    await Reactium.Plugin.register('myPlugin');
    Reactium.Reducer.register('myPlugin', newReducer);
};

register();
 */
Plugin.register = (ID, order = Enums.priority.neutral) => {
    if (ID) {
        return new Promise(resolve => {
            plugins[ID] = {
                callback: resolve,
                order,
            };

            if (Plugin.ready) Plugin.callbacks(ID);
        });
    }

    return Promise.reject(new Error('No ID provided for plugin.'));
};

/**
 * @api {Function} Plugin.isActive(ID) Plugin.isActive()
 * @apiGroup Reactium.Plugin
 * @apiName Plugin.isActive
 * @apiDescription Determine if a plugin ID is active.
 * @apiParam {String} ID the plugin id.
 * @apiExample Example Usage:
 Reactium.Plugin.isActive('Media');
 */
Plugin.isActive = ID => {
    const plugin = _.findWhere(Plugin.list(), { ID }) || {};
    return op.get(plugin, 'active', false);
};

/**
 * TODO: Refactor this stuff out. It's used in the most awkward of ways only in the admin, and it is redux behavior. It's just all wrong.
 * 
 * @api {Function} Plugin.list() Plugin.list()
 * @apiGroup Reactium.Plugin
 * @apiName Plugin.list
 * @apiDescription Return the list of registered plugins.
 */
Plugin.list = () => op.get(Plugin.redux.store.getState(), 'PluginManager.plugins', []);

/**
 * @api {Function} Plugin.unregister(ID) Plugin.unregister()
 * @apiName Plugin.unregister
 * @apiDescription Unregister a Reactium plugin by unique id. This can only be called prior to the `plugin-dependencies` hook, or `Reactium.Plugin.ready === true`.
 * @apiParam {String} ID the plugin id
 * @apiGroup Reactium.Plugin
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';

// Before Reactium.Plugin.ready
Reactium.Hook.register('plugin-dependencies', () => {
    // Prevent myPlugin registration callback from occurring
    Reactium.Plugin.unregister('myPlugin');
    return Promise.resolve();
}, Enums.priority.highest)
 */
Plugin.unregister = ID => {
    if (Plugin.ready) {
        console.error(
            new Error(
                'Plugin.unregister() called too late. Reduce the order of your Plugin.register() call.',
            ),
        );
        return;
    }

    if (ID && ID in plugins) {
        Hook.run('plugin-unregister', { ID });
        delete plugins[ID];
    }
};

export default Plugin;

Hook.register('plugin-init', Plugin.callbacks, Enums.priority.highest);

Hook.register(
    'plugin-dependencies',
    ({ deps }) => {
        Plugin.deps = deps;
        Plugin.ready = true;
        Hook.run('plugin-init');
        return Promise.resolve();
    },
    Enums.priority.high,
);

Hook.register(
    'store-created',
    redux => {
        Plugin.redux = redux;
        return Promise.resolve();
    },
    Enums.priority.high,
);
