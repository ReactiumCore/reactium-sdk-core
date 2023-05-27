import { useState, useRef } from 'react';
import op from 'object-path';
import _ from 'underscore';
import { ComponentEvent, useEventEffect } from './event-handle';
import { Hook } from '../sdks';
import uuid from 'uuid/v4';

const INITIAL_STATE = Symbol('INITIAL_STATE');
const STATE = Symbol('STATE');

class ReactiumSyncState extends EventTarget {
    constructor(initialState, options = {}) {
        super();
        this[INITIAL_STATE] = this[STATE] = initialState;
        this.listeners = {};
        this.options = options;
        this._addEventListener = this.addEventListener.bind(this);
        this.addEventListener = (type, listener, third, id = uuid()) => {
            if (!this.listeners[type]) this.listeners[type] = {};
            if (this.listeners[type][id]) {
                this.removeEventListener(type, this.listeners[type][id]);
                console.warn &&
                    console.warn(`Duplicate ${type} event with id ${id}`);
            }

            this.listeners[type][id] = listener;
            this._addEventListener(type, listener, third);
            return () =>
                this.removeEventListener(type, this.listeners[type][id]);
        };
    }

    get stateObj() {
        console.warn('Use this.state or this.get() instead.');
        return { state: this.state };
    }

    get state() {
        return this[STATE];
    }

    set state(value) {
        return (this[STATE] = value);
    }

    get initial() {
        return this[INITIAL_STATE];
    }

    reset = () => {
        return (this[STATE] = this.initial);
    };

    removeEventListenerById = (type, id) => {
        if (op.has(this.listeners, [type, id])) {
            this.removeEventListener(type, this.listeners[type][id]);
            op.del(this.listeners, [type, id]);
        }
    };

    removeAllEventListeners = (type) => {
        if (op.has(this.listeners, [type])) {
            Object.entries(this.listeners[type]).forEach(([id, listener]) => {
                this.removeEventListener(type, listener);
                op.del(this.listeners, [type, id]);
            });
        }
    };

    get = (path, defaultValue) => {
        if (typeof path == 'string' || Array.isArray(path)) {
            return op.get(this.state, path, defaultValue);
        } else {
            return this.state;
        }
    };

    _setArgs = (path, value) => {
        // path looks like object path or is explicitly false
        if (
            (path === false ||
                typeof path == 'string' ||
                Array.isArray(path)) &&
            typeof value != 'undefined'
        ) {
            return [path, value];
        }

        // path looks like the value
        return [false, path];
    };

    _conditionallyMerge = (previous, next) => {
        const noMergeConditions = [
            (p, n) => !_.isObject(p) || !_.isObject(n),
            (p, n) => typeof p != typeof n,
            (p, n) => _.isElement(n),
            (p, n) => _.isBoolean(n),
            (p, n) => _.isArray(n),
            (p, n) => _.isString(n),
            (p, n) => _.isNumber(n),
            (p, n) => _.isDate(n),
            (p, n) => _.isError(n),
            (p, n) => _.isRegExp(n),
            (p, n) => _.isNull(n),
            (p, n) => _.isSymbol(n),
        ];

        Hook.runSync(
            'use-sync-state-merge-conditions',
            noMergeConditions,
            this,
        );

        // merge not possible or necessary
        if (
            op.get(this.options, 'noMerge', false) ||
            !_.isEmpty(
                noMergeConditions.filter((condition) =>
                    condition(previous, next),
                ),
            )
        ) {
            return next;
        }

        return {
            ...previous,
            ...next,
        };
    };

    extend = (prop, method) => {
        if (typeof method == 'function') {
            this[prop] = method.bind(this);
        }
    };

    del = (path, update = true) => {
        if (update) this.dispatch('before-del', { path });

        let changed = false;
        if (path) {
            const currentValue = op.get(this.state, path);
            op.del(this.state, path);
            const nextValue = op.get(this.state, path);
            changed = !_.isEqual(currentValue, nextValue);
        } else {
            this.state = undefined;
            changed = true;
        }

        if (update) {
            this.dispatch('del', { path });
            if (changed) this.dispatch('change', { path });
        }

        return this;
    };

    set = (pathArg, valueArg, update = true, forceMerge = false) => {
        const [path, value] = this._setArgs(pathArg, valueArg);

        if (update) this.dispatch('before-set', { path, value });

        let changed = false;
        if (path) {
            const currentValue = op.get(this.state, path);
            const nextValue = this._conditionallyMerge(
                op.get(this.state, path),
                value,
                forceMerge,
            );
            changed = !_.isEqual(currentValue, nextValue);
            op.set(this.state, path, nextValue);
        } else {
            changed = !_.isEqual(this.state, value);
            this.state = this._conditionallyMerge(this.state, value);
        }

        if (update) {
            this.dispatch('set', { path, value });
            if (changed) this.dispatch('change', { path, value });
        }

        return this;
    };

    dispatch = (type, payload = {}) => {
        this.dispatchEvent(new ComponentEvent('type', payload));
        return this;
    };
}

export { ReactiumSyncState };

/**
 * @api {ReactHook} useSyncState(initialState,updateEvent) useSyncState()
 * @apiName useSyncState
 * @apiGroup ReactHook
 * @apiDescription Intended to provide an object to get and set state synchrounously, while providing a `EventTarget` object that can dispatch a `set` event whenever the state is changed. The hook will also dispatch a `change` event whenever the synced state changes. The hook can also listen for a specified event on the `EventTarget` object, and update the synced state with the `event.detail` property when the event is dispatched.
 * 
 * The hook uses the `ReactiumSyncState` class to implement the synced state and `EventTarget` behavior. The class uses the [`object-path`](https://github.com/mariocasciaro/object-path) module to manipulate the state object, and provides the following methods:
 * - `get(path, defaultValue)`: Gets the value at the specified path in the synced state, or the entire synced state if no path is provided. If the value at the specified path is `undefined`, returns the provided default value instead.
 * - `set(path, value)`: Sets the value at the specified path in the synced state, or replaces the entire synced state if no path is provided. The `path` parameter can be a string or array, representing a path in the object, or `undefined` to replace the entire object. Dispatches a `set` event. If the new value is different from the previous value, also dispatches a `change` event.
 * - `set(path, value, update)`: Sets the value at the specified path in the synced state, or replaces the entire synced state if no path is provided. If `update` is `true`, dispatches a `set` event. If the new value is different from the previous value and `update` is `true`, also dispatches a `change` event. The `path` parameter can be a string or array, representing a path in the object, or `undefined` to replace the entire object.
 * - `extend(prop, method)`: Extends the `ReactiumSyncState` instance with the provided method, bound to the instance.
 *
 * @apiParam {Object} initialState The initial state of the synced state.
 * @apiParam {string} [updateEvent=set] The event name to listen for on the `EventTarget` object. When the event is dispatched, the hook will update the synced state with the `event.detail` property, and trigger a rerender of the React component.
 * @apiExample Simple
import React from 'react';
import { useSyncState } from '@atomic-reactor/reactium-sdk-core';

const ExampleComponent = () => {
    const [syncState, setSyncState] = useSyncState({ count: 0 });

    return (
        <>
            <div>Count: {syncState.get('count')}</div>
            <button onClick={() => setSyncState({ count: syncState.get('count') + 1 })}>
                Increment
            </button>
        </>
    );
};
 * @apiExample get and set
import { useSyncState } from '@atomic-reactor/reactium-sdk-core';

function MyComponent() {
  const syncState = useSyncState({ foo: 'bar' });

  const handleClick = () => {
    // Get the entire synced state
    console.log(syncState.get()); // { foo: 'bar' }

    // Get a property of the synced state
    console.log(syncState.get('foo')); // 'bar'

    // Update a property of the synced state
    syncState.set('foo', 'baz');
    console.log(syncState.get('foo')); // 'baz'

    // Replace the entire synced state
    syncState.set({ foo: 'bar', baz: 'qux' });
    console.log(syncState.get()); // { foo: 'bar', baz: 'qux' }
  };

  return <button onClick={handleClick}>Update State</button>;
}

 * @apiExample Form Usage
import { useSyncState } from '@atomic-reactor/reactium-sdk-core';

function MyForm() {
  const syncState = useSyncState({
    user: {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
      },
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    syncState.set(name, value);
  };

  return (
    <form>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="user.name"
        value={syncState.get('user.name')}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="age">Age:</label>
      <input
        type="number"
        id="age"
        name="user.age"
        value={syncState.get('user.age')}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="street">Street:</label>
      <input
        type="text"
        id="street"
        name="user.address.street"
        value={syncState.get('user.address.street')}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="city">City:</label>
      <input
        type="text"
        id="city"
        name="user.address.city"
        value={syncState.get('user.address.city')}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="state">State:</label>
      <input
        type="text"
        id="state"
        name="user.address.state"
        value={syncState.get('user.address.state')}
        onChange={handleChange}
      />
      <br />
    </form>
  );
}

 * @apiSuccess {ReactiumSyncState} syncState The `ReactiumSyncState` instance returned by the hook.
 */
export const useSyncState = (initialState, updateEvent = 'set') => {
    const stateRef = useRef(new ReactiumSyncState(initialState));
    const [, update] = useState(new Date());
    const updater = () => update(new Date());
    useEventEffect(stateRef.current, { [updateEvent]: updater });

    return stateRef.current;
};
