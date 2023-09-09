import { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import React from 'react';
import Hello from '@/components/Hello';
import { Main } from '@/components/Layout/index';
import { Accordion, Stack, Window } from '@/components/UI';
import dbConnection from '@/data-layer/db-connection';
import styles from '@/styles/pages/about.module.scss';
import profile from 'profile';

const { siteURI } = profile;

export const revalidate = 86400;
export const dynamic = 'force-static';

const pageTitle = 'My Résumé';
const pageDescription = 'My education and work background';
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

const createDateSpan = (startDate: Date, endDate: Date | undefined) =>
  `${startDate.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short'
  })} - ${
    endDate?.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short'
    }) || 'Current'
  }`;

const Resume = async () => {
  const educationRows = await dbConnection
    .selectFrom('education')
    .selectAll()
    .orderBy('start_date', 'desc')
    .execute();

  const workRows = await dbConnection
    .selectFrom('work_history')
    .selectAll()
    .orderBy('start_date', 'desc')
    .execute();

  return (
    <Stack as={Main} type='vertical' spacing='xxl'>
      <Hello />

      <Stack type='vertical' spacing='xxl'>
        <h1>Education</h1>
        {educationRows.map(async (row) => {
          const {
            school,
            study,
            city,
            state,
            start_date: startDate,
            end_date: endDate,
            notes
          } = row;

          const windowTitle = `${school}.txt`
            .replaceAll(' ', '_')
            .toLowerCase();

          const { content } = await compileMDX({
            source: notes
          });

          return (
            <Window
              title={windowTitle}
              contentClassName={styles.workCard}
              key={school}>
              <Stack type='vertical'>
                <Stack
                  type='horizontal'
                  responsive
                  className={styles.cardHeadline}>
                  <Stack type='vertical' spacing='xxs'>
                    <h2>{school}</h2>
                    <h4 className={styles.organization}>{study}</h4>
                  </Stack>
                  <Stack
                    type='vertical'
                    spacing='xxs'
                    className={styles.justifyRight}>
                    <p>{createDateSpan(startDate, endDate)}</p>
                    <p>{`${city}, ${state}`}</p>
                  </Stack>
                </Stack>

                <div className={styles.description}>{content}</div>
              </Stack>
            </Window>
          );
        })}

        <h1>Work History</h1>
        {workRows.map(async (row) => {
          const {
            title,
            city,
            state,
            company,
            start_date: startDate,
            end_date: endDate,
            desc
          } = row;

          const windowTitle = `${title}_${company}.txt`
            .replaceAll(' ', '_')
            .toLowerCase();

          const { content } = await compileMDX({
            source: desc
          });

          return (
            <Window
              title={windowTitle}
              contentClassName={styles.workCard}
              key={windowTitle}>
              <Stack type='vertical'>
                <Stack
                  type='horizontal'
                  responsive
                  className={styles.cardHeadline}>
                  <Stack type='vertical' spacing='xxs'>
                    <h2>{title}</h2>
                    <h4 className={styles.organization}>{company}</h4>
                  </Stack>
                  <Stack
                    type='vertical'
                    spacing='xxs'
                    className={styles.justifyRight}>
                    <p>{createDateSpan(startDate, endDate)}</p>
                    <p>{`${city}, ${state}`}</p>
                  </Stack>
                </Stack>

                <Accordion showText='More details' minText='Less details'>
                  <div className={styles.description}>{content}</div>
                </Accordion>
              </Stack>
            </Window>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Resume;
