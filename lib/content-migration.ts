import type { PageContent, Section, ContentBlock, ImageBlock, VideoBlock } from '@/types/page-builder';
import { generateId, createSection, createColumn } from './page-builder-utils';

/**
 * Migrate legacy content_html to PageContent block structure.
 * Parses HTML and converts elements into blocks within single-column sections.
 */
export function migrateHtmlToBlocks(html: string): PageContent {
    if (!html || !html.trim()) {
        return { version: 1, sections: [createSection('100')] };
    }

    // Use DOMParser if available (browser), otherwise return a single text block
    if (typeof DOMParser === 'undefined') {
        return {
            version: 1,
            sections: [{
                ...createSection('100'),
                columns: [createColumn(100, [{ id: generateId(), type: 'text', content_html: html }])],
            }],
        };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const children = Array.from(doc.body.children);

    if (children.length === 0) {
        return { version: 1, sections: [createSection('100')] };
    }

    const sections: Section[] = [];
    let currentTextHtml = '';

    function flushText() {
        if (!currentTextHtml.trim()) return;
        const section = createSection('100');
        section.columns[0].blocks.push({
            id: generateId(),
            type: 'text',
            content_html: currentTextHtml,
        });
        sections.push(section);
        currentTextHtml = '';
    }

    for (const el of children) {
        const tagName = el.tagName.toUpperCase();

        // Handle figures (images)
        if (tagName === 'FIGURE' && el.querySelector('img')) {
            flushText();
            const imageBlock = parseFigureElement(el);
            if (imageBlock) {
                const section = createSection('100');
                section.columns[0].blocks.push(imageBlock);
                sections.push(section);
            }
            continue;
        }

        // Handle videos
        if (tagName === 'VIDEO') {
            flushText();
            const videoBlock = parseVideoElement(el);
            if (videoBlock) {
                const section = createSection('100');
                section.columns[0].blocks.push(videoBlock);
                sections.push(section);
            }
            continue;
        }

        // Handle tables (may be wrapped in table-scroll-wrapper)
        if (tagName === 'TABLE' || (tagName === 'DIV' && el.classList.contains('table-scroll-wrapper'))) {
            flushText();
            const tableEl = tagName === 'TABLE' ? el : el.querySelector('table');
            if (tableEl) {
                const section = createSection('100');
                section.columns[0].blocks.push({
                    id: generateId(),
                    type: 'table',
                    content_html: tableEl.outerHTML,
                });
                sections.push(section);
            }
            continue;
        }

        // Handle pre/code blocks
        if (tagName === 'PRE') {
            flushText();
            const section = createSection('100');
            section.columns[0].blocks.push({
                id: generateId(),
                type: 'code',
                content_html: el.outerHTML,
            });
            sections.push(section);
            continue;
        }

        // Everything else is text content
        currentTextHtml += el.outerHTML;
    }

    flushText();

    if (sections.length === 0) {
        return { version: 1, sections: [createSection('100')] };
    }

    return { version: 1, sections };
}

function parseFigureElement(el: Element): ImageBlock | null {
    const img = el.querySelector('img');
    if (!img) return null;

    const figcaption = el.querySelector('figcaption');
    const classes = (el.getAttribute('class') || '').split(' ').filter(Boolean);

    let size: ImageBlock['size'] = 'l';
    let rounded: ImageBlock['rounded'] = 'md';
    let shadow: ImageBlock['shadow'] = 'md';

    for (const cls of classes) {
        if (cls.startsWith('img-size-')) {
            const val = cls.replace('img-size-', '');
            if (['xl', 'l', 'm', 's'].includes(val)) size = val as ImageBlock['size'];
        }
        if (cls.startsWith('img-rounded-')) {
            const val = cls.replace('img-rounded-', '');
            if (['none', 'sm', 'md', 'lg'].includes(val)) rounded = val as ImageBlock['rounded'];
        }
        if (cls.startsWith('img-shadow-')) {
            const val = cls.replace('img-shadow-', '');
            if (['none', 'sm', 'md', 'lg'].includes(val)) shadow = val as ImageBlock['shadow'];
        }
    }

    const widthAttr = img.getAttribute('width');
    const heightAttr = img.getAttribute('height');

    return {
        id: generateId(),
        type: 'image',
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        width: widthAttr ? parseInt(widthAttr, 10) : undefined,
        height: heightAttr ? parseInt(heightAttr, 10) : undefined,
        size,
        rounded,
        shadow,
        caption: figcaption?.textContent || undefined,
    };
}

function parseVideoElement(el: Element): VideoBlock | null {
    const src = el.getAttribute('src');
    if (!src) return null;

    const widthAttr = el.getAttribute('width');
    const heightAttr = el.getAttribute('height');

    return {
        id: generateId(),
        type: 'video',
        src,
        width: widthAttr ? parseInt(widthAttr, 10) : undefined,
        height: heightAttr ? parseInt(heightAttr, 10) : undefined,
        autoplay: el.hasAttribute('autoplay'),
        loop: el.hasAttribute('loop'),
        muted: el.hasAttribute('muted'),
        controls: el.hasAttribute('controls'),
    };
}
