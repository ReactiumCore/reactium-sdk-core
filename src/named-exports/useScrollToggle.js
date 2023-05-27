import {  useCallback, useEffect } from 'react';
import { useRegisterSyncHandle } from './sync-handle';
import { isBrowserWindow } from '../sdks/utils';

/**
* @api {ReactHook} useScrollToggle() useScrollToggle()
* @apiDescription React hook to that returns a control allowing you to `enable`, `disable`, or `toggle` scroll locking on the body element. Also registers the
* returned handle as `BodyScroll`. To use the BodyScroll handle, you need only apply useSelectHandle() in one global component.
* See useSelectHandle() for information on using registered handles.
* @apiName useScrollToggle
* @apiGroup ReactHook
* @apiVersion 1.2.7
* @apiExample NPM Usage
import { useScrollToggle } from '@atomic-reactor/reactium-sdk-core';
* @apiExample Reactium Usage
import { useScrollToggle } from '@atomic-reactor/reactium-core/sdk';
* @apiExample Modal.js
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    cxFactory,
    useScrollToggle,
    useIsContainer,
    useEventEffect,
    useRegister
    HookComponent,
} from '@atomic-reactor/reactium-sdk-core';

 const Modal = () => {
    const bodyScroll = useScrollToggle();
    const handle = useRegisterSyncHandle('Modal', {
        open: false,
        Contents: {
            Component: () => null,
        },
    });

    // Close modal and disable scroll lock on body
    handle.extend('close', () => {
        handle.set('open', false);
        bodyScroll.enable();
    });

    // Open modal, showing component, and stop scroll on body
    handle.extend('open', Component => {
        handle.set('Contents', { Component });
        handle.set('open', true);
        bodyScroll.disable();
    });

    const isContainer = useIsContainer();
    const container = useRef();
    const content = useRef();
    const dismiss = e => {
        if (
            isContainer(e.target, container.current) &&
            !isContainer(e.target, content.current)
        ) {
            handle.close();
        }
    };

    useEventEffect(
        window,
        {
            mousedown: dismiss,
            touchstart: dismiss,
        },
        [container.current],
    );

    const cn = cxFactory('modal');
    const Component = handle.get('Contents.Component', () => null);

    return ReactDOM.createPortal(
        <div
            ref={container}
            className={`${cn()} ${cn({ open: handle.get('open', false) })}`}>
            <div ref={content} className={cn('contents')}>
                <Component modal={handle} />
            </div>
        </div>,
        document.querySelector('body'),
    );
};
* @apiExample LockToggle.js
import React from 'react';
import {
    useSelectHandle,
} from '@atomic-reactor/reactium-sdk-core';

// Somewhere else in the app, useScrollToggle() has been invoked.
const LockToggle = () => {
    const { handle: BodyScroll } = useSelectHandle('BodyScroll');
    return (
        <button onClick={BodyScroll.toggle}>
        {
            BodyScroll.get('enabled') ? 'Lock Scrolling' : 'Unlock Scrolling'
        }
        </button>
    );
};
 */
const useScrollToggle = () => {
    if (isBrowserWindow()) {
        window.useScrollTogglePOS = window.useScrollTogglePOS || {
            x: 0,
            y: 0,
        };
    }

    const setPos = value => {
        if (!isBrowserWindow()) return;
        window.useScrollTogglePOS = value;
    };

    const POS = () => (isBrowserWindow() ? window.useScrollTogglePOS : { x: 0, y: 0 });

    const X = useCallback(() => {
        if (!isBrowserWindow()) return 0;
        return window.scrollX || window.pageXOffset || document.body.scrollLeft;
    });

    const Y = useCallback(() => {
        if (!isBrowserWindow()) return 0;
        return window.scrollY || window.pageYOffset || document.body.scrollTop;
    });

    const disable = useCallback(() => {
        if (!isBrowserWindow()) return;

        setPos({ x: X(), y: Y() });

        const pos = POS();

        document.body.style.position = 'fixed';
        document.body.style.overflow = 'visible';
        document.body.style.marginTop = `-${pos.y}px`;
        document.body.style.marginleft = `-${pos.x}px`;
    });

    const enable = useCallback(() => {
        if (!isBrowserWindow()) return;

        const pos = POS();

        document.body.style.marginTop = '0';
        document.body.style.marginLeft = '0';
        document.body.style.position = 'relative';
        document.body.style.overflow = 'auto';
        window.scrollTo(pos.x, pos.y);
    });

    useEffect(() => {
        if (!isBrowserWindow()) return;

        setPos({ x: X(), y: Y() });
    }, []);

    const handle = useRegisterSyncHandle('BodyScroll', {
        enabled: false,
    });

    handle.extend('enable', () => {
        enable();
        handle.set('enabled', true);
    });

    handle.extend('disable', () => {
        disable();
        handle.set('enabled', false);
    });

    handle.extend('toggle', () => {
        if (handle.get('enabled', true)) {
            handle.disable();
            return;
        }
        handle.enable();
    });

    return handle;
};

export { useScrollToggle, useScrollToggle as default };
