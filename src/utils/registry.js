import _ from 'underscore';
import op from 'object-path';
import uuid from 'uuid/v4';

/**
 * @api {Object} Registry Registry
 * @apiGroup Reactium
 * @apiName Registry
 * @apiDescription Reactium uses a number of registry objects used to registering
 * all sorts of objects that will be used elsewhere in the framework. New registry
 * objects are generally instanciated as singletons on the overall SDK.
 *
 * There are many registry objects attached by default to the SDK, and developers can
 * create new ones using `Utils.registryFactory()`.
 * @apiParam listById {Getter} get Object keyed by id of most recent (or highest order) registered objects, filtering out unregistered or banned objects.
 * @apiParam list {Getter} get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.
 * @apiParam registered {Getter} get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).
 * @apiParam protected {Getter} get list of protected registrations ids
 * @apiParam unregistered {Getter} get list of all existing registered objects ids that have been subsequently unregistered.
 * @apiParam banned {Getter} get list of all banned objects ids.
 * @apiParam mode {Getter} get current mode (Default Utils.Registry.MODES.HISTORY)
 * @apiParam mode {Setter} set current mode (Default Utils.Registry.MODES.HISTORY)
 * @apiParam get {Method} pass the identifier of an object get that object from the registry
 * @apiParam isProtected {Method} pass the identifier of an object to see if it has been protected
 * @apiParam isRegistered {Method} pass the identifier of an object to see if it has been registered
 * @apiParam isUnRegistered {Method} pass the identifier of an object to see is NOT registered.
 * @apiParam isBanned {Method} pass the identifier of an object to see if it has been banned
 * @apiParam ban {Method} pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code
 * that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality
 * @apiParam cleanup {Method} pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN
 * @apiParam protect {Method} pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.
 * @apiParam register {Method} pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.
 * @apiParam unprotect {Method} pass an identifier to unprotect an object
 * @apiParam unregister {Method} pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.
 * @apiParam flush {Method} clear all registrations. Resets registry to newly constructed state.
 */

export default class Registry {
    constructor(name, idField, mode = Registry.MODES.HISTORY) {
        this.__name = name || 'Registry';
        this.__idField = idField || 'id';
        this.__registered = [];
        this.__protected = {};
        this.__unregister = {};
        this.__banned = {};
        this.__mode = mode in Registry.MODES ? mode : Registry.MODES.HISTORY;
    }

    get protected() {
        return Object.values(this.__protected);
    }

    get registered() {
        return this.__registered;
    }

    get unregistered() {
        return Object.values(this.__unregister);
    }

    get banned() {
        return Object.values(this.__banned);
    }

    get listById() {
        const unregister = this.__unregister;
        const banned = this.__banned;
        const registered = Array.from(this.__registered).filter(
            item =>
                !(item[this.__idField] in unregister) &&
                !(item[this.__idField] in banned),
        );

        return _.chain(registered)
            .sortBy('order')
            .indexBy(this.__idField)
            .value();
    }

    get list() {
        return Object.values(this.listById);
    }

    set mode(newMode = Registry.MODES.HISTORY) {
        this.__mode =
            newMode in Registry.MODES ? newMode : Registry.MODES.HISTORY;
    }

    get mode() {
        return this.__mode;
    }

    get(id) {
        return op.get(this.listById, [id]);
    }

    isProtected(id) {
        return id in this.__protected;
    }

    isRegistered(id) {
        return !!_.findWhere(this.__registered, { id });
    }

    isUnRegistered(id) {
        return !(id in this.listById);
    }

    isBanned(id) {
        return id in this.__banned;
    }

    ban(id) {
        const ids = _.flatten([id]);
        ids.forEach(id => op.set(this.__banned, [id], id));

        if (this.__mode === Registry.MODES.CLEAN) {
            this.cleanup(id);
        }

        return this;
    }

    cleanup(id) {
        const [remove] = _.flatten([id]);
        if (this.isProtected(remove)) return this;

        this.__registered = this.__registered.filter(
            item => item[this.__idField] !== remove,
        );

        return this;
    }

    flush() {
        this.__registered = [];
        this.__protected = {};
        this.__unregister = {};
        this.__banned = {};
    }

    protect(id) {
        const ids = _.flatten([id]);
        ids.forEach(id => op.set(this.__protected, [id], id));
        return this;
    }

    register(id, data = {}) {
        // one argument register
        if (typeof id === 'object' && this.__idField in id) {
            data = id;
            id = data[this.__idField];
        }

        if (!id) id = uuid();
        if (this.isBanned(id)) {
            return new Error(
                `${this.__name} unable to register banned item ${id}`,
            );
        }

        if (this.isProtected(id) && this.isRegistered(id)) {
            return new Error(
                `${this.__name} unable to replace protected item ${id}`,
            );
        }

        data['order'] = op.get(data, 'order', 100);
        const item = { ...data, [this.__idField]: id };

        if (this.__mode === Registry.MODES.CLEAN) {
            this.cleanup(id);
        }

        this.__registered.push(item);
        op.del(this.__unregister, [id]);

        return this;
    }

    unprotect(id) {
        const ids = _.flatten([id]);
        ids.forEach(id => op.del(this.__protected, id));
        return this;
    }

    unregister(id) {
        if (!id) return this;

        const ids = _.chain([id])
            .flatten()
            .uniq()
            .value();

        ids.forEach(id => {
            if (id in this.__protected) return;

            if (this.__mode === Registry.MODES.CLEAN) {
                this.cleanup(id);
                return;
            }

            op.set(this.__unregister, [id], id);
        });

        return this;
    }
}

Registry.MODES = {
    HISTORY: 'HISTORY',
    CLEAN: 'CLEAN',
};
