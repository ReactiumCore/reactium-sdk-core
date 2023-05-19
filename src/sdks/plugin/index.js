import Hook from '../hook';
import Enums from '../enums';

export const Plugin = {};

Plugin.register = (ID, priority = Enums.priority.neutral) => {
    console.warn(
        'Reactium.Plugin.register is deprecated. Just register a plugin-init hook instead.',
    );
    return new Promise((resolve) => {
        Hook.register(
            'plugin-init',
            resolve,
            priority,
            ID,
            `LEGACY_PLUGIN_REGISTER_${ID}`,
        );
    });
};

Plugin.unregister = (ID) => Hook.unregister('plugin-init', ID);

export default Plugin;