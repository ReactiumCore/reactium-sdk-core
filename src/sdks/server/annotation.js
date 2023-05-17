import op from 'object-path';
import _ from 'underscore';
import { Hook } from '../hook';
import { Enums } from '../enums';
import Registry, { registryFactory } from '../utils/registry';
import fs from 'fs';
import path from 'path';

Hook.registerSync(
    '@reactium',
    (processors) => {
        processors.register('file-tag', {
            processor: async (content, original, config = {}) => {
                const rootPath = op.get(config, 'rootPath', __dirname);
                const encoding = op.get(config, 'encoding', 'utf-8');
                const replacementPattern = /\[file:(.*?)\]/g;

                if (replacementPattern.test(content)) {
                    const tags = content
                        .match(replacementPattern)
                        .map((tag) => ({
                            tag,
                            file: path.normalize(
                                path.resolve(
                                    rootPath,
                                    tag.replace(replacementPattern, '$1'),
                                ),
                            ),
                        }));

                    let updated = content;
                    tags.forEach(({ tag, file }) => {
                        if (fs.existsSync(file)) {
                            const fileContent = fs.readFileSync(file, encoding);
                            updated = updated.replace(tag, fileContent);
                        }
                    });

                    return updated;
                }

                return content;
            },
        });
    },
    Enums.priority.highest,
    `@reactium-file-tag`,
);

/**
 * @api {Utils.annotationsFactory} annotationsFactory(namespace,type) annotationsFactory()
 * @apiName annotationsFactory
 * @apiGroup Reactium.Utils
 * @apiDescription Tool for creating documentation objects from @<namespace> annotations.
 * @apiParam {string} [namespace=reactium] Default the annotation namepace.
 * @apiParam {string} [type=async] The annotation processors will be processed async or sync. Returns
 * annotations function.
 * @apiParam (annotations) {string} [string=''] the string to parse
 * @apiParam (annotations) {object} [options] the options used by processors
 *
 * @apiExample example.md
 * # Hello
 *
 * @apiExample Simple
 * import { annotationsFactory } from '@atomic-reactor/reactium-sdk-core/sdks/server';
 * import { dirname } from '@atomic-reactor/dirname';
 * import path from 'node:path';
 *
 * const rootPath = dirname(import.meta.url);
 *
 * const processAnnotations = async () => {
 *  const annotations = annotationsFactory();
 *
 *  // replaces file tag with markdown
 *  const output = annotations('@reactium apidoc.example some content [file:example.md]', { rootPath })
 *
 *  // output:
 *  // {
 *  //   "apidoc": {
 *  //      "example": "some content # Hello"
 *  //   }
 *  // }
 * }
 *
 */
export const annotationsFactory = (namespace = 'reactium', type = 'async') => {
    const annotationNS = `@${namespace}`;

    const processors = registryFactory(
        annotationNS,
        'id',
        Registry.MODES.CLEAN,
    );

    Hook.runSync(annotationNS, processors);
    const matcher = (str = '') => {
        const pattern = `${annotationNS} (.*)`;
        const reg = new RegExp(pattern, 'gi');
        return _.flatten(
            str
                .match(reg)
                .map((match) => match.split(reg))
                .map((arr) => arr.filter(Boolean)),
        );
    };

    const pathing = (matches = []) => {
        return matches.map((match) => {
            const [path, ...rest] = match.split(' ');
            return { path, content: rest.join(' ') };
        });
    };

    const handlers = {
        async: async (matches = [], config = {}) => {
            let processed = [];
            for (const { path, content: originalContent } of matches) {
                let content = originalContent;
                for (const { processor } of processors.list) {
                    if (_.isFunction(processor)) {
                        content = await processor(
                            content,
                            originalContent,
                            config,
                        );
                    }
                }

                processed.push({ path, content });
            }

            return processed;
        },

        sync: (matches = [], config = {}) => {
            let processed = [];
            for (const { path, content: originalContent } of matches) {
                let content = originalContent;
                for (const { processor } of processors.list) {
                    if (_.isFunction(processor)) {
                        content = processor(content, originalContent, config);
                    }
                }

                processed.push({ path, content });
            }

            return processed;
        },
    };

    return (
        str = '',
        config = {
            rootPath: __dirname,
        },
    ) => {
        const context = {};
        const unprocessed = pathing(matcher(str));

        if (type === 'async') {
            return handlers['async'](unprocessed, config).then((processed) => {
                processed.forEach(({ path, content }) => {
                    op.set(context, path, content);
                });

                return context;
            });
        } else {
            handlers['sync'](unprocessed, config).forEach(
                ({ path, content }) => {
                    op.set(context, path, content);
                },
            );
        }

        return context;
    };
};
