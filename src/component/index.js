import Registry from '../utils/registry';
import op from 'object-path';

class Component extends Registry {
    constructor(name, idField, mode) {
        super(name, idField, mode);
    }

    get(id, defaultComponent) {
        const obj = Registry.prototype.get.call(this, id);
        return op.get(obj, 'component', defaultComponent);
    }

    register(id, component) {
        return Registry.prototype.register.call(this, id, { component });
    }
}

export default new Component('Component', 'id', Registry.MODES.CLEAN);
