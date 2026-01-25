import { Node, mergeAttributes } from '@tiptap/core';

export interface FigureOptions {
    HTMLAttributes: Record<string, unknown>;
}

export type FigureSize = 'xl' | 'l' | 'm' | 's';
export type FigureRounded = 'none' | 'sm' | 'md' | 'lg';
export type FigureShadow = 'none' | 'sm' | 'md' | 'lg';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        figure: {
            setFigure: (options: {
                src: string;
                alt?: string;
                width?: number;
                height?: number;
                size?: FigureSize;
                rounded?: FigureRounded;
                shadow?: FigureShadow;
                caption?: string;
            }) => ReturnType;
            updateFigure: (options: {
                src?: string;
                alt?: string;
                width?: number;
                height?: number;
                size?: FigureSize;
                rounded?: FigureRounded;
                shadow?: FigureShadow;
                caption?: string;
            }) => ReturnType;
        };
    }
}

export const Figure = Node.create<FigureOptions>({
    name: 'figure',

    group: 'block',

    // atom: true means the node is treated as a single unit (can't place cursor inside)
    atom: true,

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: '',
            },
            width: {
                default: null,
            },
            height: {
                default: null,
            },
            size: {
                default: 'l',
            },
            rounded: {
                default: 'md',
            },
            shadow: {
                default: 'md',
            },
            caption: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'figure',
                getAttrs: (node) => {
                    if (typeof node === 'string') return false;

                    const figure = node as HTMLElement;
                    const img = figure.querySelector('img');

                    // Skip figures without images (might be other types of figures)
                    if (!img) return false;

                    const figcaption = figure.querySelector('figcaption');

                    // Get classes from both figure and img to be robust
                    const figureClasses = (figure.getAttribute('class') || '').split(' ').filter(Boolean);
                    const imgClasses = (img.getAttribute('class') || '').split(' ').filter(Boolean);
                    const allClasses = [...figureClasses, ...imgClasses];

                    // Parse size, rounded, shadow from classes
                    // Default to 'l', 'md', 'md' if no classes found
                    let size: FigureSize = 'l';
                    let rounded: FigureRounded = 'md';
                    let shadow: FigureShadow = 'md';

                    for (const cls of allClasses) {
                        if (cls.startsWith('img-size-')) {
                            const val = cls.replace('img-size-', '');
                            if (['xl', 'l', 'm', 's'].includes(val)) {
                                size = val as FigureSize;
                            }
                        }
                        if (cls.startsWith('img-rounded-')) {
                            const val = cls.replace('img-rounded-', '');
                            if (['none', 'sm', 'md', 'lg'].includes(val)) {
                                rounded = val as FigureRounded;
                            }
                        }
                        if (cls.startsWith('img-shadow-')) {
                            const val = cls.replace('img-shadow-', '');
                            if (['none', 'sm', 'md', 'lg'].includes(val)) {
                                shadow = val as FigureShadow;
                            }
                        }
                    }

                    const widthAttr = img.getAttribute('width');
                    const heightAttr = img.getAttribute('height');

                    const result = {
                        src: img.getAttribute('src'),
                        alt: img.getAttribute('alt') || '',
                        width: widthAttr ? parseInt(widthAttr, 10) : null,
                        height: heightAttr ? parseInt(heightAttr, 10) : null,
                        size,
                        rounded,
                        shadow,
                        caption: figcaption?.textContent || '',
                    };
                    return result;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        // Build class string from attributes
        const classes = [
            `img-size-${HTMLAttributes.size || 'l'}`,
            `img-rounded-${HTMLAttributes.rounded || 'md'}`,
            `img-shadow-${HTMLAttributes.shadow || 'md'}`,
        ].join(' ');

        // Build image attributes
        const imgAttrs: Record<string, unknown> = {
            src: HTMLAttributes.src,
            alt: HTMLAttributes.alt || '',
        };

        if (HTMLAttributes.width) {
            imgAttrs.width = HTMLAttributes.width;
        }
        if (HTMLAttributes.height) {
            imgAttrs.height = HTMLAttributes.height;
        }

        // If there's a caption, include figcaption
        if (HTMLAttributes.caption) {
            return [
                'figure',
                mergeAttributes(this.options.HTMLAttributes, { class: classes }),
                ['img', imgAttrs],
                ['figcaption', {}, HTMLAttributes.caption],
            ];
        }

        // No caption - just figure with img
        return [
            'figure',
            mergeAttributes(this.options.HTMLAttributes, { class: classes }),
            ['img', imgAttrs],
        ];
    },

    // Custom NodeView for editor rendering with hover overlay
    addNodeView() {
        return ({ node }) => {
            // Create the main container
            const container = document.createElement('div');
            container.className = 'figure-node-view';
            container.style.cssText = 'position: relative; margin: 1.5rem 0; display: flex; flex-direction: column; align-items: center; cursor: pointer;';

            // Build class string from attributes
            const classes = [
                `img-size-${node.attrs.size || 'l'}`,
                `img-rounded-${node.attrs.rounded || 'md'}`,
                `img-shadow-${node.attrs.shadow || 'md'}`,
            ].join(' ');

            // Create the figure element
            const figure = document.createElement('figure');
            figure.className = classes;
            figure.style.cssText = 'margin: 0; display: flex; flex-direction: column; align-items: center; position: relative;';

            // Create the image
            const img = document.createElement('img');
            img.src = node.attrs.src || '';
            img.alt = node.attrs.alt || '';
            if (node.attrs.width) img.width = node.attrs.width;
            if (node.attrs.height) img.height = node.attrs.height;
            img.style.cssText = 'max-width: 100%; height: auto; display: block; transition: opacity 0.2s ease;';

            figure.appendChild(img);

            // Create figcaption if there's a caption
            if (node.attrs.caption) {
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = node.attrs.caption;
                figcaption.style.cssText = 'margin-top: 0.75rem; font-size: 0.8125rem; color: var(--muted-foreground); text-align: center; font-style: italic; opacity: 0.85;';
                figure.appendChild(figcaption);
            }

            // Create the hover overlay
            const overlay = document.createElement('div');
            overlay.className = 'figure-edit-overlay';
            overlay.textContent = 'Click to edit';
            overlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 0.75rem 1.5rem;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
                z-index: 20;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            container.appendChild(figure);
            container.appendChild(overlay);

            // Add hover event listeners
            container.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                img.style.opacity = '0.7';
            });

            container.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                img.style.opacity = '1';
            });

            return {
                dom: container,
                contentDOM: null, // atom node, no content editing
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'figure') return false;

                    // Update image attributes
                    img.src = updatedNode.attrs.src || '';
                    img.alt = updatedNode.attrs.alt || '';
                    if (updatedNode.attrs.width) {
                        img.width = updatedNode.attrs.width;
                    }
                    if (updatedNode.attrs.height) {
                        img.height = updatedNode.attrs.height;
                    }

                    // Update figure classes
                    figure.className = [
                        `img-size-${updatedNode.attrs.size || 'l'}`,
                        `img-rounded-${updatedNode.attrs.rounded || 'md'}`,
                        `img-shadow-${updatedNode.attrs.shadow || 'md'}`,
                    ].join(' ');

                    // Update caption
                    const existingCaption = figure.querySelector('figcaption');
                    if (updatedNode.attrs.caption) {
                        if (existingCaption) {
                            existingCaption.textContent = updatedNode.attrs.caption;
                        } else {
                            const figcaption = document.createElement('figcaption');
                            figcaption.textContent = updatedNode.attrs.caption;
                            figcaption.style.cssText = 'margin-top: 0.75rem; font-size: 0.8125rem; color: var(--muted-foreground); text-align: center; font-style: italic; opacity: 0.85;';
                            figure.appendChild(figcaption);
                        }
                    } else if (existingCaption) {
                        existingCaption.remove();
                    }

                    return true;
                },
            };
        };
    },

    addCommands() {
        return {
            setFigure:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: options.src,
                                alt: options.alt || '',
                                width: options.width || null,
                                height: options.height || null,
                                size: options.size || 'l',
                                rounded: options.rounded || 'md',
                                shadow: options.shadow || 'md',
                                caption: options.caption || '',
                            },
                        });
                    },
            updateFigure:
                (options) =>
                    ({ commands, state }) => {
                        const { selection } = state;
                        const node = state.doc.nodeAt(selection.from);

                        if (node?.type.name !== this.name) {
                            return false;
                        }

                        return commands.updateAttributes(this.name, options);
                    },
        };
    },
});

export default Figure;
