import React, { useCallback, useEffect, useRef, useState, forwardRef } from 'react';
import CommonSDK, {
    useHandle,
    useRegisterHandle,
    useEventHandle,
    useEventEffect,
} from '../../lib';
import op from 'object-path';
import CustomEvent from '../../src/node-polyfill/custom-event';

export const EventHandleComponent = () => {
    const [value, setValue] = useState(1);
    const createHandle = () => ({
        value,
        setValue,
    });

    const [handle, setHandle] = useEventHandle(createHandle());

    useEffect(() => {
        setHandle(createHandle());
    }, [value]);

    useRegisterHandle('EventHandleComponent', () => handle);

    const onClick = () => {
        if (handle) {
            handle.dispatchEvent(new CustomEvent('do-something'));
        }
    };

    return (
        <button id='click-me' onClick={onClick}>
            Click Me
        </button>
    );
};

export const EventHandleParent = () => {
    const [state, setState] = useState(1);
    const handle = useHandle('EventHandleComponent');

    const somethingDone = useCallback((e) => {
        const { value, setValue } = e.target;
        setValue(value + 1);
        setState(value);
    });

    useEventEffect(handle, { 'do-something': somethingDone }, [handle]);
    // useEffect(() => {
    //     if (handle) {
    //         setState(handle.value);
    //         handle.addEventListener('do-something', somethingDone);
    //     }

    //     return () => {
    //         handle.removeEventListener('do-something', somethingDone);
    //     }
    // }, [handle])

    return <>{state}</>;
};
