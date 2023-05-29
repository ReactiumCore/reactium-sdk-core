import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    forwardRef,
} from 'react';
import CommonSDK, {
    useHandle,
    useEventEffect,
} from '../../lib';

import EventTargetPolyfill from '../../src/node-polyfill/event-target';

CommonSDK.Handle.register('EventEffectHandle', {
    current: new EventTargetPolyfill(),
});

export const EventEffectResponseComponent = () => {
    const [state, setState] = useState(1);
    const handle = useHandle('EventEffectHandle');

    const somethingDone = useCallback((e) => {
        console.log('Set state ', state + 1)
        setState(state + 1);
    });

    useEventEffect(handle, { 'do-something': somethingDone }, [handle]);

    return <>{state}</>;
};
