// =============================================
// Page Builder Types
// =============================================

// Column layout presets (dash-separated width percentages)
export type ColumnLayout =
  | '100'
  | '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
  | '33-33-33' | '50-25-25' | '25-50-25' | '25-25-50'
  | '25-25-25-25';

// Block types
export type BlockType = 'text' | 'image' | 'video' | 'spacer' | 'divider' | 'table' | 'code';

export interface TextBlock {
  id: string;
  type: 'text';
  content_html: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  size: 'xl' | 'l' | 'm' | 's';
  rounded: 'none' | 'sm' | 'md' | 'lg';
  shadow: 'none' | 'sm' | 'md' | 'lg';
  caption?: string;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  src: string;
  width?: number;
  height?: number;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

export interface SpacerBlock {
  id: string;
  type: 'spacer';
  height: number;
}

export interface DividerBlock {
  id: string;
  type: 'divider';
}

export interface TableBlock {
  id: string;
  type: 'table';
  content_html: string;
}

export interface CodeBlock {
  id: string;
  type: 'code';
  content_html: string;
}

export type ContentBlock = TextBlock | ImageBlock | VideoBlock | SpacerBlock | DividerBlock | TableBlock | CodeBlock;

export interface Column {
  id: string;
  widthPercent: number;
  blocks: ContentBlock[];
}

// Section background color presets (maps to CSS custom properties)
export type SectionBgPreset = 'none' | 'muted' | 'primary' | 'secondary' | 'accent' | 'foreground';

export interface SectionStyle {
  bgPreset?: SectionBgPreset;
  bgCustom?: string;
  colorMode?: 'light' | 'dark';
}

export interface Section {
  id: string;
  layout: ColumnLayout;
  columns: Column[];
  style?: SectionStyle;
}

export interface PageContent {
  version: 1;
  sections: Section[];
}
