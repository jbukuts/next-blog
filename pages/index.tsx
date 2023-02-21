import {
  Box,
  GridItem,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  VStack
} from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import { PostCard } from '../src/components';
import { SharedHeader } from '../src/components/SEO';
import { ProcessedContent } from '../src/data-layer/pull-blog-data';

interface HomeProps {
  postList: ProcessedContent[];
}

const components = {
  h1: ({ children }: any) => (
    <Heading as='h1' size='xl' mb={3}>
      {children}
    </Heading>
  ),
  h2: ({ children }: any) => (
    <Heading as='h2' size='lg' mb={2}>
      {children}
    </Heading>
  ),
  h3: ({ children }: any) => (
    <Heading as='h3' size='md' mb={1}>
      {children}
    </Heading>
  ),
  p: ({ children }: any) => <Text mb={4}>{children}</Text>,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem
} as any;

const Home = (props: HomeProps) => {
  const { postList } = props;

  return (
    <>
      <Head>
        <title>Blog @ jbukuts</title>
        <meta name='description' content="Jake Bukuts' Blog" />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:url' content='https://jbukuts.com' />
        <meta property='og:title' content='Home' />
      </Head>
      <SharedHeader />
      <GridItem gridRow='content' gridColumn='middle' as='main'>
        <VStack spacing={8} align='stretch'>
          <Box
            display='flex'
            flexDirection={['column', 'row']}
            width='100%'
            alignItems='center'
            gap={6}>
            <Box
              flexShrink={0}
              position='relative'
              borderRadius='lg'
              overflow='hidden'
              borderWidth='2px'
              height='200px'
              width='200px'
              borderColor='black'>
              <Image
                src='/me.png'
                alt='This is me'
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Box flexShrink='2'>
              <components.h1>Hello ✌</components.h1>
              <components.p>Hi, I&apos;m Jake Bukuts.</components.p>
              <components.p>
                I graduated from the University of South Carolina with a
                Bachelor&apos;s Degree in Computer Science. Most of my day to
                day work revolves around front-end and back-end web development.
              </components.p>
            </Box>
          </Box>

          <Heading size='2xl'>Recent Posts</Heading>
          {postList.map((postItem: ProcessedContent, i: number) => (
            <PostCard key={i} {...postItem}>
              <MDXRemote components={components} {...postItem.content} lazy />
            </PostCard>
          ))}
        </VStack>
      </GridItem>
    </>
  );
};

export async function getStaticProps() {
  const { getProcessedPostList } = await import(
    '../src/data-layer/pull-blog-data'
  );

  const testPostList: ProcessedContent[] = await getProcessedPostList({});

  return {
    props: { postList: testPostList } as HomeProps
  };
}

export default Home;
