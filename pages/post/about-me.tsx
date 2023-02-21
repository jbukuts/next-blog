import {
  GridItem,
  Heading,
  ListItem,
  Text,
  UnorderedList
} from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { Window } from '../../src/components';
import { SharedHeader } from '../../src/components/SEO';

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

const SectionHeading = (props: any) => {
  const { children } = props;

  return (
    <Heading
      as='h2'
      size='xl'
      mt={4}
      mb={2}
      borderBottom='1px solid'
      borderColor='gray.500'
      pb={2}>
      {children}
    </Heading>
  );
};

const EmploymentSection = (props: any) => {
  const { name, date, desc } = props;

  return (
    <>
      <Heading as='h3' size='md'>
        <i>{name}</i>
      </Heading>
      <Text color='gray.500' mb={2}>
        <i>{date}</i>
      </Text>
      <Text mb={4}>{desc}</Text>
    </>
  );
};

interface NestedListProps {
  listItems: Array<string[] | string>;
}

const NestedList = (props: NestedListProps) => {
  const { listItems } = props;

  return (
    <UnorderedList>
      {listItems.map((s, i) =>
        typeof s === 'string' ? (
          <ListItem key={i}>{s}</ListItem>
        ) : (
          <NestedList key={i} listItems={s} />
        )
      )}
    </UnorderedList>
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
      <SharedHeader />
    </Head>
    <GridItem gridRow='content' gridColumn='middle'>
      <Window title='resume.md' as='main'>
        <article>
          <Heading as='h1' size='2xl' mb={6}>
            My Resume
          </Heading>

          <SectionHeading>Education 🎓</SectionHeading>

          <Text>Bachelor of Computer Science</Text>
          <Text>Columbia, SC</Text>
          <Text>August 2017 - May 2021</Text>
          <Text>GPA: 3.89</Text>

          <SectionHeading>Employment ✍</SectionHeading>
          {employment.map((e, i) => (
            <EmploymentSection key={i} {...e} />
          ))}

          <SectionHeading>Skills 🧠</SectionHeading>

          <NestedList listItems={skills} />
        </article>
      </Window>
    </GridItem>
  </>
);

export default ResumePage;
