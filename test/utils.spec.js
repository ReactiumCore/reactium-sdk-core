import { SDK } from './components';

describe('splitParts(original)', () => {
    const replacements = {
        subject: 'I',
        verb: 'see',
        adjective: 'little',
        object: 'silouette',
        noun: 'man',
    };

    const original = '%subject% %verb% a %adjective% %object% of a %noun%';
    const result = [
        { key: 'subject', value: 'I', type: 'replacement' },
        { key: ' ', value: ' ', type: 'part' },
        { key: 'verb', value: 'see', type: 'replacement' },
        { key: ' a ', value: ' a ', type: 'part' },
        { key: 'adjective', value: 'little', type: 'replacement' },
        { key: ' ', value: ' ', type: 'part' },
        { key: 'object', value: 'silouette', type: 'replacement' },
        { key: ' of a ', value: ' of a ', type: 'part' },
        { key: 'noun', value: 'man', type: 'replacement' },
    ];

    const parts = SDK.Utils.splitParts(original);
    describe('replace(key,value)', () => {
        parts.reset();
        Object.entries(replacements).forEach(([key, value]) =>
            parts.replace(key, value),
        );

        it('should replace tokens with objects', () => {
            expect(parts.value()).toEqual(result);
        });
    });

    describe('reset()', () => {
        it('should reset back to original', () => {
            parts.reset();
            expect(parts.value()).toEqual([
                { key: original, value: original, type: 'part' }
            ]);
        })
    })

    describe('reset(), replace(key,value), and value()', () => {
        it('should chain', () => {
            const value = parts
                .reset()
                .replace('subject', replacements.subject)
                .replace('verb', replacements.verb)
                .replace('adjective', replacements.adjective)
                .replace('object', replacements.object)
                .replace('noun', replacements.noun)
                .value();

            expect(value).toEqual(result);
        })
    })
});

describe('cxFactory()', () => {
    const cx = SDK.Utils.cxFactory('my-component');
    describe('used like classnames library', () => {
        it('should work just like classnames, but prefix the namespace', async () => {
            const isTrue = true;
            const isFalse = false;
            expect(cx('1', '2', '3')).toEqual('my-component-1 my-component-2 my-component-3');
            expect(cx({'something-true': isTrue, 'something-false': isFalse})).toEqual('my-component-something-true');
        })
    })
})
