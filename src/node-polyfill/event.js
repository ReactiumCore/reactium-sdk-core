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
        if (this.cancelable) this.defaultPrevented = true;
    }

    stopPropagation() {
        this.cancelBubble = true;
    }

    stopImmediatePropagation() {}
}

Event.createEvent = type => new Event(type);

export default Event;
