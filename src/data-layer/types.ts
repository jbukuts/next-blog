import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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
  content?: string | undefined;
  encoding?: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
  _links: object | null;
}

export interface ProcessedContent {
  date: string;
  title: string;
  slug: string;
  timeToRead: number;
  tags: string[];
  content: MDXRemoteSerializeResult;
  tableOfContents: SectionHead[];
  desc: string;
}

export type MinContent = Omit<ProcessedContent, 'content' | 'tableOfContents'>;
