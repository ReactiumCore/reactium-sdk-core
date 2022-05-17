import op from 'object-path';
import { useAsyncEffect } from './async-effect';
import { useRef, useState } from 'react';

/**
 * @api {ReactHook} useFulfilledObject(object,keys) useFulfilledObject()
 * @apiName useFulfilledObject
 * @apiGroup ReactHook
 * @apiDescription Asyncronous React hook that determines if the supplied object
 has values for the supplied keys. Useful when you have many `useEffect` calls
 and need to know if multiple pieces of the state are set and ready for rendering.
 * @apiParam {Object} object The object to check.
 * @apiParam {Array} keys List of object paths to validate.
 * @apiExample Example Usage:

import React, { useEffect, useState } from 'react';
import { useFulfilledObject } from 'reactium-core/sdk';

const MyComponent = () => {

    const [state, setNewState] = useState({});
    const [updatedState, ready, attempts] = useFulfilledObject(state, ['msg', 'timestamp']);

    const setState = newState => {
        newState = { ...state, ...newState };
        setNewState(newState);
    };

    useEffect(() => {
        if (!state.msg) {
            setState({ msg: 'ok'});
        }
    }, [state]);

    useEffect(() => {
        if (!state.timestamp) {
            setState({ timestamp: Date.now() });
        }
    }, [state]);

    const render = () => {
        return ready !== true ? null : <div>I'm READY!!</div>;
    };

    return render();
};
 */
export const useFulfilledObject = (obj = {}, keys = []) => {
    const [ready, setReady] = useState(false);
    const count = useRef(0);
    const ival = useRef();

    const clear = () => {
        clearInterval(ival.current);
        return () => {};
    };

    const validate = () =>
        new Promise(resolve => {
            clear();
            ival.current = setInterval(() => {
                count.current += 1;
                const completed = keys.filter(
                    key => typeof op.get(obj, key) !== 'undefined',
                );
                if (completed.length !== keys.length) return;
                clear();
                resolve(true);
            }, 1);
        });

    useAsyncEffect(
        async mounted => {
            if (ready === true) return clear();
            const results = await validate();
            if (mounted()) setReady(results);
            return clear();
        },
        [obj, keys, count.current],
    );

    return [ready, obj, count.current];
};
