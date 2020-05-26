
import SDK from '../lib';
import { expect } from 'chai';

describe('hotkeys', () => {
    const { Registry } = SDK.Utils;

    const Hotkeys = new Registry('Hotkeys', 'id');

    it('register', () => {
        Hotkeys.register('media-save', {
            callback: () => {},
            key: 'mod+s',
            order: 0,
            //scope: document,
        });

        Hotkeys.register('content-save', {
            callback: () => {},
            key: 'mod+s',
            order: 0,
            //scope: document,
        });

        Hotkeys.register('shortkey-save', {
            callback: () => {},
            key: 'mod+s',
            order: 0,
            //scope: document,
        });

        expect(Hotkeys.list).to.have.lengthOf(3);
    });

    it ('unregister', () => {
        Hotkeys.unregister('media-save');
        Hotkeys.unregister('content-save');
        Hotkeys.unregister('shortkey-save');
        
        expect(Hotkeys.list).to.have.lengthOf(0);
    });
});
