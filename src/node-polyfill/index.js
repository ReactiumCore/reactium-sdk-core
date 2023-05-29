import EventPolyfill from './event';
import EventTargetPolyfill from './event-target';
import CustomEventPolyfill from './custom-event';

if (typeof window === 'undefined') {
    if (typeof Event === 'undefined') global.Event = EventPolyfill;
    if (typeof CustomEvent === 'undefined') global.CustomEvent = CustomEventPolyfill;
    if (typeof EventTarget === 'undefined') global.EventTarget = EventTargetPolyfill;
}
