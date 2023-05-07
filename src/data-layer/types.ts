import { JSXElementConstructor, ReactElement } from 'react';

export interface SectionHead {
  tagName: string;
  title: string;
  id: string;
  depth: number;
}

export interface RepositoryContent {
  type: 'dir' | 'file' | 'submodule' | 'symlink';
  size: number;
  name: string;
  path: string;
  content?: string;
  encoding?: string;
  sha: string;
  url: string;
  git_url?: string;
  html_url?: string;
  download_url?: string;
  _links: Record<string, string>;
}

export interface ProcessedContent {
  title: string;
  tags: string[];
  content: ReactElement<any, string | JSXElementConstructor<any>>;
  date: string;
  tableOfContents: SectionHead[];
  desc: string;
  slug: string;
  path: string;
  timeToRead: number;
  hash: string;
}

export type MinContent = Omit<ProcessedContent, 'content' | 'tableOfContents'>;
