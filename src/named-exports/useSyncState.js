import { useState, useRef } from 'react';
import op from 'object-path';
import _ from 'underscore';
import { ComponentEvent, useEventEffect } from './event-handle';
import { Hook } from '../sdks';

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
        // path looks like object path or is explicitly false
        if (
            (path === false || typeof path == 'string' || Array.isArray(path)) &&
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

    set = (pathArg, valueArg, update = true) => {
        const [path, value] = this._setArgs(pathArg, valueArg);

        if (update) this.dispatchEvent(new ComponentEvent('before-set', { path, value }));

        let changed = false;
        if (path) {
            const currentValue = op.get(this.stateObj.state, path);
            const nextValue = this._conditionallyMerge(
                op.get(this.stateObj.state, path),
                value,
            );
            changed = !_.isEqual(currentValue, nextValue)
            op.set(
                this.stateObj.state,
                path,
                nextValue,
            );
        } else {
            changed = !_.isEqual(this.stateObj.state, value)
            this.stateObj.state = this._conditionallyMerge(
                this.stateObj.state,
                value,
            );
        }

        if (update) {
            this.dispatchEvent(new ComponentEvent('set', { path, value }));
            if (changed) this.dispatchEvent(new ComponentEvent('change', { path, value }));
        }

        return this;
    };
}

export { ReactiumSyncState };

/**
 * @api {ReactHook} useSyncState(initialState,updateEvent) useSyncState()
 * @apiDescription Intended to provide an object to get and set state synchrounously, while providing a EventTarget object that can dispatch a 'set' event when
 * the state is updated. Dispatches 'before-set' before changing the state, and 'change' event if any shallow changes are detected.
 * @apiParam {Mixed} initialState The initial state.
 * @apiParam {String} [updateEvent=set] Trigger update of the consuming component when EventTarget event of this type is dispatched. Defaults tot 'set'.
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
export const useSyncState = (initialState, updateEvent = 'set') => {
    const stateRef = useRef(new ReactiumSyncState(initialState));
    const [, update] = useState(new Date());
    const updater = () => update(new Date());
    useEventEffect(stateRef.current, { [updateEvent]: updater });

    return stateRef.current;
};
