/**
 * git-api-calls.ts
 * Hosts the functions meant to be used in order to actually
 * pull the raw content from a Github repository
 */
import nodeFetch from 'node-fetch';

const GIT_API_URL = 'https://api.github.com';

export interface GetRepoContentOptions {
  owner: string;
  repo: string;
  path: string;
  apiKey: string;
  ref?: string;
}

export interface GetRepoContentByFileTypeOptions
  extends Omit<GetRepoContentOptions, 'ref'> {
  type?: string;
}

export interface RepositoryContent {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content?: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: {
    git: string;
    self: string;
    html: string;
  };
}

/**
 * Returns object data sourced from the Github repository contents REST API.
 * Meant to be used in the case for a single file of folder of files.
 * @param {GetRepoContentOptions} options - Options to get content for file from Github rrepository
 * @param {string} options.owner - Owner of the Github repository, usually username.
 * @param {string} options.repo - Name of the Github repository.
 * @param {string} options.path - Path of file you want contents for in repository.
 * @param {string} options.apiKey - API Key for Github REST API.
 * @param {string} options.ref - File extension to pull from the Github repository.
 */
export async function getRepositoryContent(
  options: GetRepoContentOptions
): Promise<RepositoryContent | RepositoryContent[]> {
  const { owner, repo, path, apiKey } = options;
  const apiURL = `${GIT_API_URL}/repos/${owner}/${repo}/contents/${path}`;

  return nodeFetch(apiURL, {
    headers: {
      authorization: `Bearer ${apiKey}`,
      contentType: 'application/vnd.github.v3+json'
    }
  }).then((r) => r.json()) as Promise<RepositoryContent | RepositoryContent[]>;
}
