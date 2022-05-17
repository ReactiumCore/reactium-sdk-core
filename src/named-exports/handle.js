import { Handle } from '../sdks';
import op from 'object-path';
import { useRef, useState, useEffect } from 'react';

/**
* @api {ReactHook} useRegisterHandle(id,cb,deps) useRegisterHandle()
* @apiDescription React hook to create a new imperative handle reference, similar to `useImperativeHandle()`
except that instead of using `React.forwardRef()` to attach the handle to a parent compenent ref. A ref is generated
for you and is assigned the current value of the callback `cb`, is registered with `Reactium.Handle`, and made
available to all other components at the object path `id`.
* @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.
* @apiParam {Function} cb Function that returns value to be assigned to the imperative handle reference.
* @apiParam {Array} deps Array of values to watch for changes. When changed, your reference will be updated by calling `cb` again. All
`Reactium.Handle.subscribe()` subscribers will be called on updates, and relevant `useHandle()` hooks will trigger
rerenders.
* @apiName useRegisterHandle
* @apiGroup ReactHook
 */
export const useRegisterHandle = (ID, cb, deps = []) => {
    const ref = useRef(cb());
    Handle.register(ID, ref, false);

    useEffect(() => {
        ref.current = cb();
        Handle.register(ID, ref);
        return () => Handle.unregister(ID);
    }, [ID].concat(deps));
};

/**
* @api {ReactHook} useHandle(id,defaultValue) useHandle()
* @apiDescription React hook to subscribe to a specific imperative handle reference. Useful for having one functional
component control another.
* @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.
* @apiParam {Mixed} [defaultValue] the value to use for the handle if it does not exist.
* @apiName useHandle
* @apiGroup ReactHook
* @apiExample Counter.js
import React, { useState } from 'react';
import { useRegisterHandle } from 'reactium-core/sdk';

const Counter = ({id = 1}) => {
    const [count, setCount] = useState(Number(id));

    // id 'counter.1' by default
    useRegisterHandle(['counter', id], () => ({
        increment: () => setCount(count + 1),
    }), [count]);

    return (
        <div>
            <h1>Counter {id}</h1>
            Count: {count}
        </div>
    );
};

export default Counter;
* @apiExample CounterControl.js
import React from 'react';
import { useHandle } from 'reactium-core/sdk';

const noop = () => {};
const CounterControl = () => {
    // Get increment control on handle identified at path 'counter.1'
    const { increment } = useHandle('counter.1', { increment: noop }});

    return (
        <div>
            <h1>CounterControl</h1>
            <button onClick={increment}>Increment Counter</button>
        </div>
    );
};

export default CounterControl;
 */
export const useHandle = (ID, defaultValue = {}) => {
    const getHandle = () => op.get(Handle.get(ID), 'current', defaultValue);
    const ref = useRef(getHandle());
    const [, update] = useState(new Date);

    const setHandle = handle => {
        if (handle && handle !== ref.current) {
            ref.current = handle;
            update(new Date);
        }
    };

    useEffect(() => {
        setHandle(getHandle())
        return Handle.subscribe(() => {
            setHandle(getHandle());
        });
    }, [ID]);

    return ref.current;
};
