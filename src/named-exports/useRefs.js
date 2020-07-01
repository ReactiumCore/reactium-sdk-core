import op from 'object-path';
import { useEffect, useRef } from 'react';

export const useRefs = (initialRefs = {}) => {
    const ref = useRef(initialRefs);

    const get = (key, defaultValue) => {
        if (!key) {
            return ref.current;
        }
        return op.get(ref.current, key, defaultValue);
    };

    const set = (key, value) => {
        if (!ref.current) return;
        op.set(ref.current, key, value);
    };

    const del = key => {
        if (!ref.current) return;
        op.del(ref.current, key);
    };

    const clear = () => {
        if (!ref.current) return;
        ref.current = null;
    };

    return { get, set, del, clear, ...ref.current };
};

/**
 * @api {ReactHook} useRefs() useRefs()
 * @apiGroup ReactHook
 * @apiName useRefs
 * @apiDescription Creates a single reference object that can be managed using the `get`/`set`/`del`/`clear` functions.
 * @apiExample Usage
import React, { useEffect, useState } from 'react';
import { useRefs } from '@atomic-reactor/reactium-sdk-core';

const MyComponent = () => {
    const refs = useRefs();
    const [state, setState] = useState({ input: null });

    const onClick = () => {
        const inputElm = refs.get('input');
        setState({ ...state, input: inputElm.value });
        inputElm.value = '';
    };

    return (
        <div ref={elm => refs.set('container', elm)}>
            {state.input && <div>{state.input}</div>}
            <input type='text' ref={elm => refs.set('input', elm)} />
            <button onClick={onClick}>Update</button>
        </div>
    );
};
 */
