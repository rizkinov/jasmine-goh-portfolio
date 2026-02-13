import type {
  ColumnLayout,
  Column,
  Section,
  ContentBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,
  SpacerBlock,
  TableBlock,
  CodeBlock,
  PageContent,
  BlockType,
} from '@/types/page-builder';

// ---- ID Generation ----

let counter = 0;
export function generateId(): string {
  counter++;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---- Layout Width Maps ----

const LAYOUT_WIDTHS: Record<ColumnLayout, number[]> = {
  '100': [100],
  '50-50': [50, 50],
  '60-40': [60, 40],
  '40-60': [40, 60],
  '70-30': [70, 30],
  '30-70': [30, 70],
  '33-33-33': [33.33, 33.33, 33.34],
  '50-25-25': [50, 25, 25],
  '25-50-25': [25, 50, 25],
  '25-25-50': [25, 25, 50],
  '25-25-25-25': [25, 25, 25, 25],
};

export function getColumnWidths(layout: ColumnLayout): number[] {
  return LAYOUT_WIDTHS[layout];
}

export function getColumnCount(layout: ColumnLayout): number {
  return LAYOUT_WIDTHS[layout].length;
}

// ---- Block Factories ----

export function createTextBlock(content_html = '<p></p>'): TextBlock {
  return { id: generateId(), type: 'text', content_html };
}

export function createImageBlock(overrides: Partial<Omit<ImageBlock, 'id' | 'type'>> = {}): ImageBlock {
  return {
    id: generateId(),
    type: 'image',
    src: '',
    alt: '',
    size: 'xl',
    rounded: 'md',
    shadow: 'md',
    ...overrides,
  };
}

export function createVideoBlock(overrides: Partial<Omit<VideoBlock, 'id' | 'type'>> = {}): VideoBlock {
  return {
    id: generateId(),
    type: 'video',
    src: '',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
    ...overrides,
  };
}

export function createSpacerBlock(height = 48): SpacerBlock {
  return { id: generateId(), type: 'spacer', height };
}

export function createTableBlock(content_html = '<table><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'): TableBlock {
  return { id: generateId(), type: 'table', content_html };
}

export function createCodeBlock(content_html = '<pre><code></code></pre>'): CodeBlock {
  return { id: generateId(), type: 'code', content_html };
}

export function createBlock(type: BlockType): ContentBlock {
  switch (type) {
    case 'text': return createTextBlock();
    case 'image': return createImageBlock();
    case 'video': return createVideoBlock();
    case 'spacer': return createSpacerBlock();
    case 'table': return createTableBlock();
    case 'code': return createCodeBlock();
  }
}

// ---- Column & Section Factories ----

export function createColumn(widthPercent: number, blocks: ContentBlock[] = []): Column {
  return { id: generateId(), widthPercent, blocks };
}

export function createSection(layout: ColumnLayout = '100'): Section {
  const widths = getColumnWidths(layout);
  return {
    id: generateId(),
    layout,
    columns: widths.map(w => createColumn(w)),
  };
}

export function createEmptyPageContent(): PageContent {
  return {
    version: 1,
    sections: [createSection('100')],
  };
}

// ---- Column Redistribution ----

export function redistributeColumns(existingColumns: Column[], newLayout: ColumnLayout): Column[] {
  const newWidths = getColumnWidths(newLayout);
  const newCount = newWidths.length;
  const existingCount = existingColumns.length;

  if (newCount >= existingCount) {
    // Keep existing columns, add empty ones for new slots
    return newWidths.map((width, i) => ({
      id: existingColumns[i]?.id ?? generateId(),
      widthPercent: width,
      blocks: existingColumns[i]?.blocks ?? [],
    }));
  } else {
    // Merge overflow columns into the last remaining column
    const kept = existingColumns.slice(0, newCount);
    const overflow = existingColumns.slice(newCount);
    const mergedBlocks = overflow.flatMap(c => c.blocks);

    return newWidths.map((width, i) => ({
      id: kept[i].id,
      widthPercent: width,
      blocks: i === newCount - 1
        ? [...kept[i].blocks, ...mergedBlocks]
        : kept[i].blocks,
    }));
  }
}

// ---- Deep Clone Helpers ----

export function cloneSection(section: Section): Section {
  return {
    ...section,
    id: generateId(),
    columns: section.columns.map(col => ({
      ...col,
      id: generateId(),
      blocks: col.blocks.map(block => ({ ...block, id: generateId() })),
    })),
  };
}
