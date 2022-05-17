import _ from 'underscore';

const splitter = (parts, key, value) => {
    const search = `%${key}%`;
    if (typeof parts === 'string' && parts.includes(search)) {
        parts = parts.replace(search, '|FOUND_IT|');
        return _.compact(
            parts.split('|').map(part => {
                if (part === 'FOUND_IT')
                    return {
                        key,
                        value,
                        type: 'replacement',
                    };

                if (part === '') return;

                return part;
            }),
        );
    } else if (Array.isArray(parts)) {
        return _.flatten(parts.map(part => splitter(part, key, value)));
    } else {
        return parts;
    }
};

class SplitParts {
    constructor(strVal) {
        this.original = strVal;
        this.reset();
    }

    get original() {
        return this._original;
    }

    set original(strVal) {
        this._original = strVal;
    }

    reset() {
        this.parts = [this.original];
        return this;
    }

    replace(key, value) {
        this.parts = splitter(this.parts, key, value);
        return this;
    }

    value() {
        return this.parts.map(part => {
            if (typeof part === 'string')
                return {
                    key: part,
                    value: part,
                    type: 'part',
                };

            return part;
        });
    }
}
SplitParts.splitter = splitter;

export { SplitParts as default, SplitParts };
