import EventPolyfill from './event';

let EventOrPolyfill = Event;
if (typeof EventOrPolyfill === 'undefined') EventOrPolyfill = EventPolyfill;

export class CustomEvent extends EventOrPolyfill {
    constructor(type) {
        super(type);
    }
}

export default CustomEvent;
