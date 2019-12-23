import React, { useState, useRef, useEffect } from 'react';
import op from 'object-path';
import _ from 'underscore';
const shallowEquals = require('shallow-equals');

/**
 * @api {ReactHook} useDerivedState(props,subscriptions,updateAll) useDerivedState()
 * @apiDescription Sometimes you would like to derive state from you component props,
 * and allow either a prop change, or an internal state change either to take effect.
 * This hook will allow you to create a state object from your component props,
 * and subscribe by object-path, only to the prop changes you would like to see
 * reflected in a rendering update to your component state.
 * @apiParam {Object} props the component props
 * @apiParam {Array} [subscriptions] Array of string object-paths in your component
 props you would like to update your component state for. By default, this is empty,
 and if left empty you will get only the initial props, and no updates. Each selected
 property is shallow compared with the previous version of that prop (not the current state).
 Only a change of prop will trigger a prop-based update and rerender.
 * @apiParam {Boolean} [updateAll=false] When true, an update to any subscribed
 object-path on your props will cause *all* the props to imprint on your component
 state.
 * @apiVersion 0.0.14
 * @apiName useDerivedState
 * @apiGroup ReactHook
 * @apiExample Returns
// The hook returns an array containing [state, setState, forceRefresh]
const [state, setState, forceRefresh] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);
* @apiExample Usage
import React from 'react';
import { useDerivedState } from 'reactium-core/sdk';
import op from 'object-path';

const MyComponent = props => {
    const [state, setState] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);
    const value1 = op.get(state, 'path.to.value1', 'Default value 1');
    const value2 = op.get(state, 'path.to.value2', 'Default value 2');

    // setState merges this object with previous state
    const updateValue1 = () => setState({
        path: {
            to: {
                value1: 'foo',
            }
        }
    });

    return (<div>
        <div>Value 1: {value1}</div>
        <div>Value 2: {value2}</div>
        <button onClick={updateValue1}>Update Value 1</button>
    </div>);
}

export default MyComponent;
 */
export const useDerivedState = (props, subscriptions = [], updateAll = false) => {
    const getDerivedState = fromValues =>
        subscriptions.reduce((values, path) => {
            values[path] = op.get(fromValues, path);
            return values;
        }, {});

    // rerender trigger
    const [updated, setUpdated] = useState(1);
    const forceRefresh = () => {
        setUpdated(updated + 1);
    };

    // everything
    const derivedStateRef = useRef(props);

    // only what we care about in props
    const propsVersion = useRef(0);
    const derivedState = getDerivedState(props);
    const subscribedRef = useRef(derivedState);

    // ignores irrelevant prop changes
    const internalPropSetState = (path, value) => {
        const currentValue = op.get(subscribedRef.current, [path]);
        if (!shallowEquals(currentValue, value)) {
            const newSubscribed = { ...subscribedRef.current };
            const newDerivedState = { ...derivedStateRef.current };
            op.set(newSubscribed, [path], value);
            op.set(newDerivedState, path, value);
            subscribedRef.current = newSubscribed;
            derivedStateRef.current = newDerivedState;
            forceRefresh();
        }
    };

    // public setState always respected and merged everything
    const setState = newExternalState => {
        const newDerivedState = {
            ...derivedStateRef.current,
            ...newExternalState,
        };

        derivedStateRef.current = newDerivedState;
        forceRefresh();
    };

    // compare last knows subscribed prop values with current version
    const getChanges = fromValues => {
        const changed = [];
        subscriptions.forEach(path => {
            const oldVal = op.get(subscribedRef.current, [path]);
            const newVal = op.get(fromValues, [path]);

            if (
                typeof oldVal !== typeof newVal ||
                !shallowEquals(oldVal, newVal)
            ) {
                changed.push(path);
            }
        });
        return changed;
    };

    // only trigger useEffect if subscriptions have changed or subscribed prop values have changed
    const changedDerived = getChanges(derivedState);
    const hash = changedDerived
        .sort()
        .concat(changedDerived.length > 0 ? [propsVersion.current + 1] : [])
        .join('|');
    useEffect(() => {
        if (changedDerived.length > 0) {
            changedDerived.forEach(path =>
                internalPropSetState(path, op.get(derivedState, [path])),
            );

            if (updateAll) {
                setState({
                    ...derivedStateRef.current,
                    ...props,
                });
            }

            propsVersion.current = propsVersion.current + 1;
        }
    }, [subscriptions.sort().join('|'), hash]);

    // full derived state, public setState, and method to force refresh without changing anything
    return [derivedStateRef.current, setState, forceRefresh];
};
