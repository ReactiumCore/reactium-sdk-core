/**
 * @api {Object} Cache Cache
 * @apiVersion 3.0.3
 * @apiName Cache
 * @apiGroup Reactium.Cache
 * @apiDescription Cache allows you to easily store application data in memory.
 */
import memory from 'memory-cache';
import op from 'object-path';
import _ from 'underscore';
import uuid from 'uuid/v4';

const denormalizeKey = keyString => {
    return Array.isArray(keyString) ? keyString : keyString.split('.');
};

const normalizeKey = key => {
    return Array.isArray(key) ? key.join('.') : key;
};

const getKeyRoot = key => {
    const k = denormalizeKey(key)[0];
    return k;
};

const getValue = key => {
    const v = memory.get(getKeyRoot(key));
    return v;
};

class Cache {
    _subscribers = {};
    _subscribedPaths = {};

    /**
     * @api {Function} Cache.subscribe(key,cb) Cache.subscribe()
     * @apiGroup Reactium.Cache
     * @apiName Cache.subscribe
     * @apiDescription Subscribe to cache changes that impact a particular key. Returns an unsubscribe function.
     * @apiParam {Mixed} key object path of the cache value (array or string)
     * @apiParam {Function} cb The callback function to call when impacting changes have been made to the subscribed cache. Changes include
     any set/put, delete, clear, merge, or expiration that *may* impact the value you care about.
     *
     * @apiExample Example Usage:
const foo = Reactium.Cache.get('values.foo');
Reactium.Cache.subscribe('values.foo', ({op, ...params}) => {
    switch(op) {
        case 'set': {
            const { key, value } = params;
            // do something with new value if applicable
            // you can see the key that impacted the cache value
            break;
        }

        case 'del': {
            // the key that was deleted
            const { key } = params;
            // do something about the deletion
            break;
        }

        case 'expire': {
            // do something about expiration (which will have impacted your value for sure)
            // this will never be called if your value doesn't expire
            break;
        }

        case 'merge': {
            // complete cache object after merge
            // may impact you, you'll have to check
            const { obj } = params;
            if (op.get(obj, 'values.foo') !== foo) {
                // do something
            }
            break;
        }

        default:
        break;
    }
});
     */
    subscribe(key, cb) {
        const id = uuid();
        const keyParts = denormalizeKey(normalizeKey(key));

        this._subscribers[id] = cb;
        for (let i = 0; i < keyParts.length; i++) {
            const partial = keyParts.slice(0, i + 1);
            const key = normalizeKey(partial);
            if (!(key in this._subscribedPaths)) {
                this._subscribedPaths[key] = {};
            }

            op.set(this._subscribedPaths[key], id, id);
        }

        return () => {
            delete this._subscribers[id];
            for (let i = 0; i < keyParts.length; i++) {
                const partial = keyParts.slice(0, i + 1);
                const key = normalizeKey(partial);
                op.del(this._subscribedPaths[key], id);
            }
        };
    }

    keySubscribers(key) {
        const keyParts = denormalizeKey(normalizeKey(key));
        let keySubs = [];
        for (let i = 0; i < keyParts.length; i++) {
            const partial = keyParts.slice(0, i + 1);
            const key = normalizeKey(partial);
            if (key in this._subscribedPaths) {
                keySubs = _.uniq(keySubs.concat(Object.keys(this._subscribedPaths[key])))
            }
        }

        return keySubs.reduce((subs, id) => subs.concat([this._subscribers[id]]), []);
    }
}

// Statics
Cache.denormalizeKey = denormalizeKey;
Cache.normalizeKey = normalizeKey;
Cache.getKeyRoot = getKeyRoot;

/**
 * @api {Function} Cache.clear() Cache.clear()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.clear
 * @apiDescription Delete all cached values.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * Reactium.Cache.clear();
 */
Cache.prototype.clear = () => {
    memory.clear();
    const subscribers = Object.values(this._subscribers);
    subscribers.forEach(cb => {
        cb({op: 'clear'});
    });
};

/**
 * @api {Function} Cache.size() Cache.size()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.size
 * @apiDescription Returns the current number of entries in the cache.
 */
Cache.prototype.size = memory.size;

/**
 * @api {Function} Cache.memsize() Cache.memsize()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.memsize
 * @apiDescription Returns the number of entries taking up space in the cache.
 */
Cache.prototype.memsize = memory.memsize;

/**
 * @api {Function} Cache.keys() Cache.keys()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.keys
 * @apiDescription Returns an array of the cached keys.
 */
Cache.prototype.keys = memory.keys;

/**
 * @api {Function} Cache.get(key) Cache.get()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.get
 * @apiDescription Retrieves the value for a given key. If the value is not cached `null` is returned.
 *
 * @apiParam {String} [key] The key to retrieve. If the value is an `{Object}` you can use an object path for the key. If no key is specified the entire cache is returned.
 * @apiParam {Mixed} [default] The default value to return if key is not found.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123 } }
 * Reactium.Cache.get('foo.bar'); // returns: 123;
 * Reactium.Cache.get('foo');     // returns: { bar: 123 }
 */
Cache.prototype.get = (key, defaultValue) => {
    key = normalizeKey(key);

    if (!key) {
        const keys = memory.keys();
        return keys.reduce((obj, key) => {
            obj[key] = memory.get(key);
            return obj;
        }, {});
    }

    const keyArray = String(key).split('.');

    if (keyArray.length > 1) {
        keyArray.shift();
        return op.get(getValue(key), keyArray.join('.'), defaultValue);
    } else {
        return memory.get(key) || defaultValue;
    }
};

/**
 * @api {Function} Cache.set(key,value,timeout,timeoutCallback) Cache.set()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.set
 * @apiDescription Sets the value for a given key. If the value is an `{Object}` and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.
 *
 * @apiParam {String} key The key to set. If the key is an object path and the key does not exist, it will be created.
 * @apiParam {Mixed} value The value to cache.
 * @apiParam {Number} [timeout] Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.
 * @apiParam {Function} [timeoutCallback] Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.
 *
 * @apiExample Example Usage:
 * // The following are equivalent
 * Reactium.Cache.set('foo', { bar: 123 });
 * Reactium.Cache.set('foo.bar', 123);
 *
 * // Set to expire in 5 seconds
 * Reactium.Cache.set('error', 'Ivnalid username or password', 5000);
 *
 * // Set to expire in 5 seconds and use a timeoutCallback
 * Reactium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));
 */
Cache.prototype.put = function(key, value, time, timeoutCallback) {
    key = normalizeKey(key);

    let curr = getValue(key);
    const keyArray = denormalizeKey(key);
    const keyRoot = keyArray[0];

    const subscribers = this.keySubscribers(key);

    const params = [time];
    const expireCallback = () => {
        const subscribers = this.keySubscribers(key);
        if (timeoutCallback) timeoutCallback();
        subscribers.forEach(cb => {
            cb({op: 'expire', key});
        });
    };
    if (time) params.push(expireCallback);

    if (keyArray.length > 1) {
        curr = curr || {};
        keyArray.shift();
        op.set(curr, keyArray.join('.'), value);
        memory.put(keyRoot, curr, ...params);
    } else {
        memory.put(key, value, ...params);
    }

    subscribers.forEach(cb => {
        cb({op: 'set', key, value});
    });
};
Cache.prototype.set = Cache.prototype.put;

/**
 * @api {Function} Cache.del(key) Cache.del()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.del
 * @apiDescription Delete the value for a given key. Returns `{Boolean}`.
 *
 * @apiParam {String} key The key to delete. If the value is an `{Object}` you can use an object path to delete a specific part of the value. The updated value is then returned.
 *
 * @apiExample Example Usage:
 * // Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }
 * Reactium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }
 * Reactium.Cache.del('foo');     // returns: true
 */
Cache.prototype.del = function (key, ...args) {
    key = normalizeKey(key);
    let curr = getValue(key);
    const keyRoot = getKeyRoot(key);
    const keyArray = denormalizeKey(key);
    const subscribers = this.keySubscribers(key);

    if (curr) {
        if (keyArray.length > 1) {
            curr = curr || {};
            keyArray.shift();
            op.del(curr, keyArray.join('.'));
            memory.put(keyRoot, curr, ...args);
        } else {
            memory.del(key);
        }
    }

    subscribers.forEach(cb => {
        cb({op: 'del', key});
    });
};

/**
 * @api {Function} Cache.merge(values) Cache.merge()
 * @apiVersion 3.0.3
 * @apiGroup Reactium.Cache
 * @apiName Cache.merge
 * @apiDescription Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless `option.skipDuplicates` is `true`. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.
 *
 * @apiParam {Object} values Key value pairs to merge into the cache.
 *
 * @apiExample Example Usage:
 * // Give the existing cache: { foo: 'bar' }
 *
 * Reactium.Cache.merge({
 *     test: {
 *         value: 123,
 *         expire: 5000,
 *     },
 * });
 *
 * Reactium.Cache.get()
 * // returns: { foo: 'bar', test: 123 }
 */
Cache.prototype.merge = (values, options) => {
    const dayjs = require('dayjs');
    options = options || { skipDuplicates: false };

    values = Object.keys(values).reduce((obj, key) => {
        const value = values[key];

        const expire = op.get(value, 'expire');

        if (typeof expire === 'number') {
            value.expire = dayjs(Date.now())
                .add(expire, 'milliseconds')
                .valueOf();
        }

        obj[key] = value;

        Object.values(subscribers).forEach(cb => {
            cb({ op: 'merge', obj })
        });

        return obj;
    }, {});

    return memory.importJson(JSON.stringify(values));
};

const ReactiumCache = new Cache();

export { ReactiumCache as default, ReactiumCache as Cache };
