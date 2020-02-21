import _ from 'underscore';
import op from 'object-path';
import { useEffect, useState } from 'react';

/**
 * @api {ReactHook} useFocusEffect(container,dependencies) useFocusEffect()
 * @apiGroup ReactHook
 * @apiName useFocusEffect
 * @apiParam {Element} container The DOM element to search for the 'data-focus' element.
 * @apiParam {Array} [dependencies] Dependencies list passed to `useEffect`.
 * @apiParam (Returns) {Boolean} focused If the 'data-focus' element was found.
 * @apiExample Reactium Usage
import cn from 'classnames';
import React, { useRef } from 'react';
import { useFocusEffect } from 'reactium-core/sdk';

const MyComponent = props => {
    const containerRef = useRef();

    const [focused] = useFocusEffect(containerRef.current);

    return (
        <form ref={containerRef}>
            <input className={cn({ focused })} type='text' data-focus />
            <button type='submit'>Submit</button>
        </form>
    );
};
 * @apiExample Returns
{Array} [focused:Element, setFocused:Function]
 */
export const useFocusEffect = (container, deps) => {
    const [focused, setFocused] = useState();

    useEffect(() => {
        container = op.has(container, 'current')
            ? container.current
            : container;

        const isEmpty = _.chain([container])
            .compact()
            .isEmpty()
            .value();

        if (focused || isEmpty) return;

        const elm = container.querySelector('*[data-focus]');

        if (elm) {
            try {
                elm.focus();
            } catch (err) {
                console.error(err);
            }

            setFocused(elm);
        }
    }, _.flatten([deps, focused]));

    return [focused, setFocused];
};
