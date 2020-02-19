import React, { useEffect, useState, useRef } from 'react';
import op from 'object-path';

class AsyncUpdate {
    constructor(update) {
        this.mounted = true;
        this.update = update;
    }

    getMounted = () => op.get(this, 'mounted', false);

    update = (...params) => {
        if (this.mounted) {
            this.update(...params);
        }
    };

    unmount = () => {
        this.mounted = false;
        this.update = () => {};
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
export const useAsyncEffect = (cb, ...params) => {
    const updater = useRef(new AsyncUpdate(cb));
    const doEffect = async () => {
        const update = op.get(updater.current, 'update', () => {});
        return update(op.get(updater.current, 'getMounted', () => false));
    };

    useEffect(() => {
        const effectPromise = doEffect();
        return () => {
            updater.current.unmount();
            effectPromise.then(unmountCB => {
                if (typeof unmountCB === 'function') {
                    unmountCB();
                }
            });
        };
    }, ...params);
};
