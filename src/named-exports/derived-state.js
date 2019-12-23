import React, { useState, useRef, useEffect } from 'react';
import op from 'object-path';
import _ from 'underscore';
const shallowEquals = require('shallow-equals');

export const useDerivedState = (props, subscriptions = {}) => {
    const getDerivedState = fromValues =>
        Object.entries(subscriptions).reduce((values, [path, defaultValue]) => {
            values[path] = op.get(fromValues, path, defaultValue);
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
        if (!shallowEquals(
            currentValue,
            value,
        )) {
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
        Object.keys(subscriptions).forEach(path => {
            const oldVal = op.get(subscribedRef.current, [path]);
            const newVal = op.get(fromValues, [path]);

            if (
                typeof oldVal !== typeof newVal ||
                !shallowEquals(
                    oldVal,
                    newVal,
                )
            ) {
                changed.push(path);
            }
        });
        return changed;
    };

    // only trigger useEffect if subscriptions have changed or subscribed prop values have changed
    const changedDerived = getChanges(derivedState);
    const hash = changedDerived.sort().concat(changedDerived.length > 0 ? [propsVersion.current + 1] : []).join('|');
    useEffect(() => {
        if (changedDerived.length > 0) {
            changedDerived.forEach(path => internalPropSetState(path, op.get(derivedState, [path])));
            propsVersion.current = propsVersion.current + 1;
        }
    }, [
        Object.keys(subscriptions)
            .sort()
            .join('|'),
            hash,
    ]);

    // full derived state, public setState, and method to force refresh without changing anything
    return [ derivedStateRef.current, setState, forceRefresh ];
};
