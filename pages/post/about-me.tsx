import Head from 'next/head';
import React from 'react';
import { Window } from '../../src/components';
import { SharedHeader } from '../../src/components/SEO';
import styles from '../../styles/pages/post/about-me.module.scss';

const employment = [
  {
    name: 'Software Developer, IBM',
    date: 'May 2021 - Current',
    desc: 'Currently tasked as a general software developer working on projects like Red Hat Marketplace and DSCE. Areas of work include both back-end and front-end development using technologies such as React, NodeJS, MongoDB, and NextJS.'
  },
  {
    name: 'Intern Backend Developer, RCI @ UofSC',
    date: 'May 2019 - May 2021',
    desc: 'Worked with other undergraduate interns to create a user interface for a computer vision project called SnowVision. Work entailed the use of various technologies with Java Play Framework, Apache Thrift, Angular, and PostgreSQL being among them.'
  },
  {
    name: 'Lab Assistant, CSCE @ UofSC',
    date: 'Jan 2019 - Jan 2020',
    desc: 'Conducted a lab for undergraduate students instructing on both the basics of Java programming along with intermediate concepts such as basic data structures (stacks, queues, binary trees, heaps) and recursion.'
  }
];

const skills = [
  'Experience with various programming languages',
  ['Javascript / Typescript', 'Java', 'Rust', 'C / C++'],
  'Databases (SQL / NoSQL)',
  ['Postgres', 'MongoDB'],
  'Containerization',
  ['Docker', 'Kubernetes'],
  'DevOps knowledge',
  ['Travis', 'Github Actions'],
  'General OS knowledge'
];

const EmploymentSection = (props: any) => {
  const { name, date, desc } = props;

  return (
    <div className={styles.employment}>
      <h3>
        <i>{name}</i>
      </h3>
      <p>
        <i>{date}</i>
      </p>
      <p>{desc}</p>
    </div>
  );
};

interface NestedListProps {
  listItems: Array<string[] | string>;
}

const NestedList = (props: NestedListProps) => {
  const { listItems } = props;

  return (
    <ul>
      {listItems.map((s, i) =>
        typeof s === 'string' ? (
          <li key={i}>{s}</li>
        ) : (
          <NestedList key={i} listItems={s} />
        )
      )}
    </ul>
  );
};

const TITLE = 'About me';
const DESC = 'Resume and other stuff';

const ResumePage = () => (
  <>
    <Head>
      <title>{TITLE}</title>
      <meta property='og:title' content={TITLE} />
      <meta property='og:type' content='article' />
      <meta property='og:url' content='https://jbukuts.com/post/about-me' />
      <meta name='description' content={DESC} />
      <meta property='og:description' content={DESC} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={TITLE} />
      <meta name='twitter:description' content={DESC} />
    </Head>
    <SharedHeader />
    <Window
      title='resume.md'
      as='main'
      className={styles.aboutMeWrapper}
      contentClassName={styles.aboutMeContent}>
      <article>
        <h2>Education</h2>

        <p>
          Bachelor of Computer Science
          <br />
          Columbia, SC
          <br />
          August 2017 - May 2021
          <br />
          GPA: 3.89
        </p>

        <h2>Employment</h2>
        {employment.map((e, i) => (
          <EmploymentSection key={i} {...e} />
        ))}

        <h2>Skills</h2>
        <NestedList listItems={skills} />
      </article>
    </Window>
  </>
);

export default ResumePage;
