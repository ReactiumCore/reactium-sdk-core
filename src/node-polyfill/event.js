class Event {
    type = null;
    bubbles = false;
    cancelBubble = false;
    cancelable = true;
    composed = false;
    defaultPrevented = false;
    target = null;

    constructor(type) {
        this.type = type;
    }

    preventDefault() {
        if (cancelable) this.defaultPrevented = true;
    }

    stopPropagation() {}

    stopImmediatePropagation() {}
}

Event.createEvent = type => new Event(type);

export default Event;
