import op from 'object-path';

/**
 * @api {Function} Prefs.clear(key) Prefs.clear()
 * @apiVersion 0.0.17
 * @apiDescription Clear one or more preferences.
 * @apiParam {String} [key] If specified as an object-path, will unset a specific preference path. Otherwise, all preferences will be cleared.
 * @apiName Prefs.clear
 * @apiGroup Reactium.Prefs
 * @apiExample Example
 import Reactium from 'reactium-core/sdk';

 Reactium.Prefs.clear();
 */
const clear = key => {
    if (typeof window !== 'undefined') {
        if (!key) {
            localStorage.setItem('ar-prefs', '{}');
            return {};
        } else {
            let prefs = get();

            if (key) {
                op.del(prefs, key);
            } else {
                op.set(prefs, {});
            }

            localStorage.setItem('ar-prefs', JSON.stringify(prefs));
            return prefs;
        }
    }
};

/**
 * @api {Function} Prefs.get(key,defaultValue) Prefs.get()
 * @apiVersion 0.0.17
 * @apiDescription Get one or more preferences by object path.
 * @apiParam {String} [key] If specified as an object-path, will get a specific preference by this path. Otherwise, all preferences will be returned.
 * @apiParam {String} [defaultValue] The value to return if the preference has not been set.
 * @apiName Prefs.get
 * @apiGroup Reactium.Prefs
 * @apiExample Example
 import Reactium from 'reactium-core/sdk';

 const myPref = Reactium.Prefs.get('my.object.path', { someDefault: 'foo' });
 */
const get = (key, defaultValue) => {
    if (typeof window !== 'undefined') {
        let ls = localStorage.getItem('ar-prefs') || {};
        ls = typeof ls === 'string' ? JSON.parse(ls) : ls;
        return key ? op.get(ls, key, defaultValue) : ls;
    }

    return key ? defaultValue : {};
};

/**
 * @api {Function} Prefs.set(key,value) Prefs.set()
 * @apiVersion 0.0.17
 * @apiDescription Get one or more preferences by object path.
 * @apiParam {String} key The object-path to use to set the value.
 * @apiParam {String} [value] The value to set to the key.
 * @apiName Prefs.set
 * @apiGroup Reactium.Prefs
 * @apiExample Example
 import Reactium from 'reactium-core/sdk';

 Reactium.Prefs.set('my.object.path', { value: 'foo' });
 */
const set = (key, value) => {
    if (typeof window !== 'undefined') {
        let prefs = get();
        op.set(prefs, key, value);
        localStorage.setItem('ar-prefs', JSON.stringify(prefs));
        return prefs;
    }
};

export default {
    clear,
    get,
    set,
};
