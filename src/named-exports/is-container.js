export const useIsContainer = () => (element, match) => {
    let isContainer = false;
    const nodes = [element];

    while (nodes.length > 0) {
        const node = nodes.shift();

        isContainer = node === match ? true : isContainer;

        if (isContainer === true) break;
        if (node.parentNode) nodes.push(node.parentNode);
    }

    return isContainer;
};

/**
 * @api {ReactHook} useIsContainer(element,container) useIsContainer()
 * @apiName useIsContainer
 * @apiGroup ReactHook
 * @apiDescription React hook that determines if the element is a child of the
container. Useful for traversing the DOM to find out if an event or action
happened within the specified container.

 * @apiParam {Node} element The inner most element. Consider this the starting point.
 * @apiParam {Node} container The outer most element. Consider this the destination.
 * @apiExample Example
import { useIsContainer } from 'reactium-core/sdk';
import React, { useEffect, useRef, useState } from 'react';

export const Dropdown = props => {
    const container = useRef();

    const [expanded, setExpanded] = useState(props.expanded || false);

    const isContainer = useIsContainer();

    const dismiss = e => {
        // already dismissed? -> do nothing!
        if (!expanded) return;

        // e.target is inside container.current? -> do nothing!
        if (isContainer(e.target, container.current)) return;

        // e.target is outside container.current? -> collapse the menu
        setExpanded(false);
    };

    const toggle = () => setExpanded(!expanded);

    useEffect(() => {
        if (!container.current || typeof window === 'undefined') return;

        window.addEventListener('mousedown', dismiss);
        window.addEventListener('touchstart', dismiss);

        return () => {
            window.removeEventListener('mousedown', dismiss);
            window.removeEventListener('touchstart', dismiss);
        }

    }, [container.current]);

    return (
        <div ref={container}>
            <button onClick={toggle}>Toggle Dropdown</button>
            {expanded && (
                <ul>
                    <li><a href='#item-1' onClick={toggle}>Item 1</a></li>
                    <li><a href='#item-2' onClick={toggle}>Item 2</a></li>
                    <li><a href='#item-3' onClick={toggle}>Item 3</a></li>
                </ul>
            )}
        </div>
    );
};
 */
