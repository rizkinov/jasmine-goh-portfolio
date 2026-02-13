'use client';

import Image from 'next/image';
import type { PageContent, Section, Column, ContentBlock, ImageBlock, VideoBlock } from '@/types/page-builder';

interface BlockRendererProps {
  content: PageContent;
}

// Process table HTML to wrap in scroll container
function processTableHtml(html: string): string {
  return html
    .replace(/<table/g, '<div class="table-scroll-wrapper"><table')
    .replace(/<\/table>/g, '</table></div>');
}

export function BlockRenderer({ content }: BlockRendererProps) {
  return (
    <div className="block-content">
      {content.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-0">
      {section.columns.map((column) => (
        <ColumnRenderer key={column.id} column={column} />
      ))}
    </div>
  );
}

function ColumnRenderer({ column }: { column: Column }) {
  return (
    <div
      className="w-full md:min-w-0"
      style={{ flex: `0 0 ${column.widthPercent}%` }}
    >
      {column.blocks.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div
          className="project-content"
          dangerouslySetInnerHTML={{ __html: block.content_html }}
        />
      );
    case 'image':
      return <ImageBlockRenderer block={block} />;
    case 'video':
      return <VideoBlockRenderer block={block} />;
    case 'spacer':
      return <div style={{ height: `${block.height}px` }} />;
    case 'table':
      return (
        <div
          className="project-content"
          dangerouslySetInnerHTML={{ __html: processTableHtml(block.content_html) }}
        />
      );
    case 'code':
      return (
        <div
          className="project-content"
          dangerouslySetInnerHTML={{ __html: block.content_html }}
        />
      );
  }
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  if (!block.src) return null;

  const figureClasses = [
    `img-size-${block.size}`,
    `img-rounded-${block.rounded}`,
    `img-shadow-${block.shadow}`,
  ].join(' ');

  return (
    <div className="project-content">
      <figure className={figureClasses}>
        <Image
          src={block.src}
          alt={block.alt || ''}
          width={block.width || 1200}
          height={block.height || 800}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        {block.caption && (
          <figcaption>{block.caption}</figcaption>
        )}
      </figure>
    </div>
  );
}

function VideoBlockRenderer({ block }: { block: VideoBlock }) {
  if (!block.src) return null;

  return (
    <div className="project-content">
      <video
        src={block.src}
        width={block.width}
        height={block.height}
        autoPlay={block.autoplay}
        loop={block.loop}
        muted={block.muted}
        controls={block.controls}
        playsInline
        preload="metadata"
      />
    </div>
  );
}
