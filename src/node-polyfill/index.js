import EventTarget from './event-target';
import Event from './event';
import CustomEvent from './custom-event';

if (typeof window === 'undefined') {
    if (typeof global.EventTarget === 'undefined') global.EventTarget = EventTarget;
    if (typeof global.CustomEvent === 'undefined') global.CustomEvent = CustomEvent;
    if (typeof global.Event === 'undefined') global.Event = Event;
}
