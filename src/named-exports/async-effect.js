import op from 'object-path';
import React, { useState, useEffect } from 'react';

class AsyncUpdate {
    constructor() {
        this.mounted = true;
    }
    isMounted = () => !!this.mounted;
    unmount = () => {
        this.mounted = false;
    };
}

/**
 * @api {ReactHook} useAsyncEffect(cb,dependencies) useAsyncEffect()
 * @apiDescription Just like React's built-in `useEffect`, but can use async/await.
If the return is a promise for a function, the function will be used as the unmount
callback.
 * @apiParam {Function} cb Just like callback provided as first argument of `useEffect`, but takes
 as its own first argument a method to see if the component is mounted. This is
 useful for deciding if your async response (i.e. one that would attempt to change state)
 should happen.
 * @apiParam {Array} [deps] Deps list passed to `useEffect`
 * @apiName useAsyncEffect
 * @apiGroup ReactHook
 * @apiExample Reactium Usage
import React, { useState } from 'react';
import { useAsyncEffect } from 'reactium-core/sdk';

const MyComponent = props => {
    const [show, setShow] = useState(false);

    // change state allowing value to show
    // asynchrounously, but only if component is still mounted
    useAsyncEffect(async isMounted => {
        setShow(false);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (isMounted()) setShow(true);

        // unmount callback
        return () => {};
    }, [ props.value ]);

    return (
        {show && <div>{props.value}</div>}
    );
};
* @apiExample StandAlone Import
import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';
 */
export const useAsyncEffect = (cb, deps) => {
    const [updater] = useState(new AsyncUpdate());

    const doEffect = async () => {
        return cb(updater.isMounted);
    }

    useEffect(() => {
        const effectPromise = doEffect();
        return () => {
            updater.unmount();
            effectPromise.then(unmountCB => {
                if (typeof unmountCB === 'function') {
                    unmountCB();
                }
            });
        };
    }, deps);
};
