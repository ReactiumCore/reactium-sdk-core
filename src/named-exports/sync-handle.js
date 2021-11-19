import { Handle } from '../sdks';
import op from 'object-path';
import { useEffect, useRef, useState } from 'react';
import  { useSyncState, ReactiumSyncState } from './useSyncState';
import { useHandle } from './handle';
import { useEventEffect } from './event-handle';

/**
* @api {ReactHook} useRegisterSyncHandle(id,cb,deps) useRegisterSyncHandle()
* @apiDescription React hook to create a new imperative handle reference, similar to `useRegisterHandle()`
except that it returns a sync state object (see useSyncState) and will cause rerenders in the controlled component.
* @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.
* @apiParam {Mixed} initial value of the state handle.
* @apiName useRegisterSyncHandle
* @apiGroup ReactHook
* @apiExample Counter.js
import React, { useState } from 'react';
import { useRegisterSyncHandle } from 'reactium-core/sdk';

const Counter = ({id = 1}) => {
    const state = useRegisterSyncHandle('counter', {
        foo: {
            count: Number(id)
        },
    });

    state.extend('incrementCount', () => {
        state.set('foo.count', state.get('foo.count', id) + 1);
    });

    return (
        <div>
            <h1>Counter {id}</h1>
            Count: {state.get('foo.count', id)}
        </div>
    );
};

export default Counter;
* @apiExample CounterControl.js
import React from 'react';
import { useSelectHandle } from 'reactium-core/sdk';

const noop = () => {};
const CounterControl = () => {
    const { handle, count } = useSelectHandle('counter', 'foo.count', 1);

    // set state for Counter, as well as cause this component to rerender

    return (
        <div>
            <h1>CounterControl</h1>
            <button onClick={handle.incrementCount}>
              Increment Counter ({count})
            </button>
        </div>
    );
};

export default CounterControl;
 */
export const useRegisterSyncHandle = (ID, ...syncStateArgs) => {
    const ref = useRef(useSyncState(...syncStateArgs));

    Handle.register(ID, ref);
    useEffect(() => {
        Handle.register(ID, ref);
        return () => Handle.unregister(ID);
    }, [ID]);

    return ref.current;
};

/**
* @api {ReactHook} useSelectHandle(id,cb,deps) useSelectHandle()
* @apiDescription React hook to subscribe to updates to state on an imperative handle created by useRegisterSyncHandle. See useRegisterSyncHandle for full example.
* @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.
* @apiParam {String|Array|Function} selector object path string or array, or selector function passed the sync state object (see useSyncState); returns seleted state
* @apiParam {Mixed} [default] default selected value (if selector is String or Array)
* @apiName useSelectHandle
* @apiGroup ReactHook
 */
const noop = () => {};
export const useSelectHandle = (ID, ...selectorArgs) => {
    const [ ,update ] = useState(new Date);
    const handle = useHandle(ID, {
        get: (...getArgs) => op.get({}, ...getArgs),
        addEventListener: noop,
        removeEventListener: noop,
    });

    const selectedRef = useRef();

    const selector = (selectorArgs, state) => {
        const cb = op.get(selectorArgs, [0]);
        return typeof cb === 'function' ? cb(state) : state.get(...selectorArgs);
    }

    selectedRef.current = selector(selectorArgs, handle);

    useEventEffect(handle, {
        set: e => {
            const newSelected = selector(selectorArgs, e.currentTarget);
            if (selectedRef.current !== newSelected) {
                selectedRef.current = newSelected;
                update(new Date);
            }
        },
    }, [ID, handle]);

    return { handle, selected: selectedRef.current };
};

/**
* @api {ReactHook} useSyncHandle(id) useSyncHandle()
* @apiDescription React hook to subscribe to updates for a registered sync handle.
* @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.
* @apiName useSyncHandle
* @apiGroup ReactHook
 */
const useSyncHandle = (ID) => {
    const [ ,update ] = useState(new Date);
    const updater = () => update(new Date);
    const handle = useHandle(ID, new ReactiumSyncState({}));
    useEffect(() => {
        handle.addEventListener('set', updater);
        return () => handle.removeEventListener('set', updater);
    }, [ID, handle]);

    return handle;
}
