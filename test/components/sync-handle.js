import React, { createRef, forwardRef } from 'react';
import CommonSDK, { useRegisterSyncHandle, useSelectHandle } from '../../lib';

// handle tests
export const someHandleState = 'some state';
export const SyncHandleRegisterer = () => {
    const handle = useRegisterSyncHandle('SyncHandleComponent', {
        foo: {
            bar: someHandleState,
        },
    });
    return handle.get('foo.bar', '');
};

export const SyncHandleConsumer = () => {
    const { handle, selected } = useSelectHandle(
        'SyncHandleComponent',
        'foo.bar',
        '',
    );
    return selected;
};

export const SyncHandleTester = () => {
    return (
        <>
            <SyncHandleRegisterer />
            <SyncHandleConsumer />
        </>
    );
};
