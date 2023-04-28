/**
 * git-api-calls.ts
 * Hosts the functions meant to be used in order to actually
 * pull the raw content from a Github repository
 */
import { Octokit } from 'octokit';
import { RepositoryContent } from './types';

interface CMSOptions {
  token: string;
  owner: string;
  repo: string;
  path: string;
}

interface GetPostListOptions {
  fileExt?: string;
  path?: string;
}

class GitHubCMS {
  private octokit: Octokit;

  private owner: string;

  private repo: string;

  private path: string;

  private lastSha: string = '';

  // eslint-disable-next-line no-use-before-define
  private static instance: GitHubCMS;

  private constructor(options: CMSOptions) {
    const { token, owner, repo, path } = options;
    this.owner = owner;
    this.repo = repo;
    this.path = path;
    this.octokit = new Octokit({ auth: token });
  }

  public static createInstance(options: CMSOptions) {
    try {
      GitHubCMS.instance = new GitHubCMS(options);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('There was an error creating the instance', err);
    }
  }

  public static getInstance(): GitHubCMS {
    if (GitHubCMS.instance === undefined) {
      // eslint-disable-next-line no-console
      console.error('Need to call createInstance first!');
    }

    return GitHubCMS.instance;
  }

  // pulls content from repository by path
  public async getRepoContent(
    options: GetPostListOptions | void
  ): Promise<RepositoryContent[] | RepositoryContent> {
    const { path, fileExt = '.md' } = options || {};

    const repoContent = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: path ? `${this.path}/${path}` : this.path
    });

    const { status, data } = repoContent;

    if (status !== 200) throw new Error('There was an error pulling content');

    let responseData = data;
    if (Array.isArray(responseData))
      responseData = responseData.filter(
        (item) => item.type === 'file' && item.name.endsWith(fileExt)
      );

    return responseData;
  }

  // gets a list of most recently changed files by path in a repository
  public async getChangedFiles(
    options: Omit<GetPostListOptions, 'fileExt'> | void
  ): Promise<string[]> {
    const { path = this.path } = options || {};

    const commitList = await this.octokit.rest.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
      path
    });

    const { status: listStatus, data: commits } = commitList;

    if (listStatus !== 200 || commits.length === 0)
      throw new Error('There was an error pulling commit data');

    const newSha = commits[0].sha;

    if (newSha === this.lastSha) return [];

    const recentCommit = await this.octokit.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: newSha
    });

    const { status: commitStatus, data: commit } = recentCommit;

    if (commitStatus !== 200 || !commit.files)
      throw new Error('There was an error pulling commit data');

    this.lastSha = newSha;

    return commit.files.map(({ filename }) => {
      const slug = filename.split('/').slice(-1)[0].split('.')[0];
      return `/post/${slug}`;
    });
  }

  public async clearSha() {
    this.lastSha = '';
  }
}

export default GitHubCMS;