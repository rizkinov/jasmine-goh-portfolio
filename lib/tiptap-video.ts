import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        video: {
            setVideo: (options: {
                src: string;
                width?: number;
                height?: number;
                autoplay?: boolean;
                loop?: boolean;
                muted?: boolean;
                controls?: boolean;
            }) => ReturnType;
        };
    }
}

export const Video = Node.create<VideoOptions>({
    name: 'video',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'rounded-xl max-w-full my-8',
            },
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: null,
            },
            height: {
                default: null,
            },
            autoplay: {
                default: false,
            },
            loop: {
                default: false,
            },
            muted: {
                default: false,
            },
            controls: {
                default: true,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        // Build attributes object, only including boolean attrs if true
        const attrs: Record<string, unknown> = {
            src: HTMLAttributes.src,
            width: HTMLAttributes.width,
            height: HTMLAttributes.height,
            playsinline: true,
            preload: 'metadata',
        };

        if (HTMLAttributes.autoplay) {
            attrs.autoplay = true;
        }
        if (HTMLAttributes.loop) {
            attrs.loop = true;
        }
        if (HTMLAttributes.muted) {
            attrs.muted = true;
        }
        if (HTMLAttributes.controls) {
            attrs.controls = true;
        }

        return ['video', mergeAttributes(this.options.HTMLAttributes, attrs)];
    },

    addCommands() {
        return {
            setVideo:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },
});

export default Video;
