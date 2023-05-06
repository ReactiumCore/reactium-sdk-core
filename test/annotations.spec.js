import { Hook, annotationsFactory } from '../lib';
import op from 'object-path';
import path from 'path';

const examples = `
/**
 * 
 * @reactium foo.bar Some content here.
 * @reactium Reactium.State.description global state object
 * @reactium Reactium.State.Tools collection of useful components <MyDemo> [file:example.md]
 * @reactium example.multiple.mds [file:example.md] [file:example2.md]
 */
`;

describe('When parsing a file with @reactium annotations', () => {
    let annotations;
    beforeEach(() => {
        Hook.registerSync('@reactium', (registry) => {
            registry.list.forEach(({ id }) => registry.unregister(id));
        });

        annotations = annotationsFactory();
    });

    it('returns a promise for an object', async () => {
        const obj = await annotations(examples);
        expect(typeof obj).toBe('object');
    });

    it('contains content in correct locations', async () => {
        const obj = await annotations(examples);
        expect(op.get(obj, 'foo.bar')).toBe('Some content here.');
        expect(op.get(obj, 'Reactium.State.description')).toBe(
            'global state object',
        );
        expect(op.get(obj, 'Reactium.State.Tools')).toBe(
            'collection of useful components <MyDemo> [file:example.md]',
        );
    });
});

describe('Processing @reactium annotations with registered processor', () => {
    let annotations;
    beforeEach(() => {
        Hook.registerSync('@reactium', (registry) => {
            registry.list.forEach(({ id }) => registry.unregister(id));
            registry.register('t1', {
                processor: async (content, originalContent) => {
                    return 'test1: ' + content;
                },
            });
        });

        annotations = annotationsFactory();
    });

    it('mutates the content added to the object', async () => {
        const obj = await annotations(examples);
        expect(op.get(obj, 'foo.bar')).toBe('test1: Some content here.');
        expect(op.get(obj, 'Reactium.State.description')).toBe(
            'test1: global state object',
        );
        expect(op.get(obj, 'Reactium.State.Tools')).toBe(
            'test1: collection of useful components <MyDemo> [file:example.md]',
        );
    });
});

describe('Processing @reactium annotations with [file:path/to/file] tags', () => {
    const annotations = annotationsFactory();
    it('includes the file in the contents', async () => {
        const obj = await annotations(examples, {
            rootPath: path.resolve(__dirname, 'fixtures'),
        });
        expect(op.get(obj, 'Reactium.State.Tools')).toBe(
            'collection of useful components <MyDemo> # Help Doc\n\nStuff here',
        );

        expect(op.get(obj, 'example.multiple.mds')).toBe(
            "# Help Doc\n\nStuff here ```\nconst stuff = {};\nstuff.foo = 'bar';\n```",
        );
    });
});
