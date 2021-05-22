import { useState, useRef } from 'react';
import op from 'object-path';
import _ from 'underscore';
import { ComponentEvent } from './event-handle';

class ReactiumSyncState extends EventTarget {
    constructor(initialState) {
        super();
        this.stateObj = { state: initialState };
    }

    get = (path, defaultValue) => {
        if (typeof path == 'string' || Array.isArray(path)) {
            return op.get(this.stateObj.state, path, defaultValue);
        } else {
            return this.stateObj.state;
        }
    };

    _setArgs = (path, value) => {
        // path looks like object path
        if (
            typeof path == 'string' ||
            (Array.isArray(path) &&
                typeof value != 'undefined' &&
                value !== null)
        ) {
            return [path, value];
        }

        // path looks like the value
        return [false, path];
    };

    _mergeValue = (previous, next) => {
        // merge not possible or necessary
        if (
            typeof previous != typeof next ||
            Array.isArray(next) ||
            !previous
        ) {
            return next;
        } else {
            // merge non null objects
            if (_.isObject(previous) && _.isObject(next)) {
                return {
                    ...previous,
                    ...next,
                };
            }
        }

        return next;
    };

    set = (pathArg, valueArg, update = true) => {
        const [path, value] = this._setArgs(pathArg, valueArg);

        if (path) {
            op.set(
                this.stateObj.state,
                path,
                this._mergeValue(op.get(this.stateObj.state, path), value),
            );
        } else {
            this.stateObj.state = this._mergeValue(this.stateObj.state, value);
        }

        if (update) {
            this.dispatchEvent(new ComponentEvent('set', { path, value }));
            this.updater(new Date());
        }

        return this;
    };
}

/**
 * @api {ReactHook} useSyncState(initialState) useSyncState()
 * @apiDescription Intended to provide an object to get and set state synchrounously, while providing a EventTarget object that can dispatch a 'set' event when
 * the state is updated.
 * @apiParam {Mixed} initialState The initial state.
 * @apiName useSyncState
 * @apiGroup ReactHook
 * @apiExample SimpleExample
 * import React from 'react';
 * import { useSyncState } from 'reactium-core/sdk';
 * export const SimpleExample = () => {
    const clickState = useSyncState({ clicks: 1 });
    const clicks = clickState.get('clicks');
    return (
        <div>Clicked {clicks} times <button
            onClick={() => clickState.set('clicks', clicks + 1)}>Click Me</button>
        </div>
    );
 };
 * @apiExample EventTarget
 * import React from 'react';
 * import { useSyncState, useRegisterHandle } from 'reactium-core/sdk';
 * export const Clicker = () => {
    const clickState = useSyncState({ clicks: 1 });
    const clicks = clickState.get('clicks');
    useRegisterHandle('ClickState', () => clickState);

    return (
        <div>Clicked {clicks} times <button
            onClick={() => clickState.set('clicks', clicks + 1)}>Click Me</button>
        </div>
    );
 };
 * @apiExample Consumer
 * import React, { useState, useEventEffect } from 'react';
 * import { useHandle } from 'reactium-core/sdk';
 * // communicate state with other components
 * export const Listener = () => {
    const [clicked, setClicked] = useState(false);
    const handle = useHandle('ClickState')
    const numClicks = handle.get('clicks');

    const remoteClicked = e => {
        if (numClicks < e.get('clicks')) {
            setClicked(true);
        }
    };

    useEventEffect(handle, { set: remoteClicked }, []);

    return (
        <div>Clicker {clicked ? 'unclicked' : 'clicked'}</div>
    );
 };
 */
export const useSyncState = initialState => {
    const stateRef = useRef(new ReactiumSyncState(initialState));
    const [, updater] = useState(new Date());
    stateRef.current.updater = updater;
    return stateRef.current;
};
