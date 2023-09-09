/* eslint-disable camelcase */
import { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import React from 'react';
import { PrettyCode, SmartLink } from '@/components/article-helpers';
import Hello from '@/components/Hello';
import { Main } from '@/components/Layout/index';
import { Stack, Window } from '@/components/UI';
import TagBadge from '@/components/UI/Badge/Badge';
import dbConnection from '@/data-layer/db-connection';
import styles from '@/styles/pages/about.module.scss';
import profile from 'profile';

const { siteURI } = profile;

export const revalidate = 86400;
export const dynamic = 'force-static';

interface ProjectEntry {
  id: number;
  title: string;
  desc: string;
  url?: string;
  tags?: string[];
  langs?: string[];
  homepage_url?: string;
}

const pageTitle = 'Personal Projects';
const pageDescription = 'List of my personal projects';
const origin = `https://${siteURI}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/projects',
    types: {
      'application/rss+xml': `${origin}/rss.xml`
    }
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/projects'
  },
  twitter: {
    title: pageTitle,
    description: pageDescription
  }
};

const Projects = async () => {
  const projectRows = await dbConnection
    .selectFrom('personal_projects')
    .selectAll()
    .execute();

  return (
    <Stack as={Main} type='vertical' spacing='xxl'>
      <Hello />
      <Stack type='vertical' spacing='xxl'>
        <h1>Personal Projects</h1>
        {projectRows.map(async (row: ProjectEntry) => {
          const { title, desc, langs, url, homepage_url } = row;

          const windowTitle = `${title}.txt`.replaceAll(' ', '_').toLowerCase();
          const { content } = await compileMDX({
            source: desc,
            components: {
              a: SmartLink,
              code: PrettyCode
            }
          });

          return (
            <Window
              title={windowTitle}
              contentClassName={styles.workCard}
              key={title}>
              <Stack type='vertical'>
                <Stack
                  type='horizontal'
                  responsive
                  className={styles.cardHeadline}>
                  <Stack type='vertical' spacing='xxs'>
                    <h2>{title}</h2>
                  </Stack>
                  <Stack type='horizontal' spacing='xs'>
                    {langs?.map((lang) => (
                      <TagBadge size='sm' key={lang}>
                        {lang}
                      </TagBadge>
                    ))}
                  </Stack>
                </Stack>

                <div className={styles.description}>{content}</div>
                <Stack>
                  {url && (
                    <SmartLink href={url} title='Open GitHub link'>
                      GitHub Link
                    </SmartLink>
                  )}
                  {homepage_url && (
                    <SmartLink href={homepage_url} title='Open GitHub link'>
                      Project Home Page
                    </SmartLink>
                  )}
                </Stack>
              </Stack>
            </Window>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Projects;
