import { HStack, Heading, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import TagBadge from './Badge';

export type RelatedPost = Pick<
  ProcessedContent,
  'title' | 'slug' | 'date' | 'tags'
>;

interface RelatedArticlesProps {
  currentSlug: string;
  postList: RelatedPost[];
}

const RelatedPostItem = (props: RelatedPost) => {
  const { title, slug, tags, date } = props;
  return (
    <VStack
      align='left'
      borderRadius='lg'
      borderWidth='1px'
      borderColor='brand.outline'
      p={3}>
      <Link as={NextLink} href={`/post/${slug}`}>
        <Heading as='h2' size='sm' fontWeight='semibold'>
          {title}
        </Heading>
      </Link>
      <HStack justifyContent='space-between'>
        <Text fontSize='sm' color='gray.600'>
          {new Date(date).toLocaleDateString('en-US', {
            year: '2-digit',
            month: 'numeric',
            day: 'numeric'
          })}
        </Text>
        <HStack spacing={1}>
          {tags.map((t, index) => (
            <TagBadge key={index} size='sm'>
              {t}
            </TagBadge>
          ))}
        </HStack>
      </HStack>
    </VStack>
  );
};

const RelatedArticles = (props: RelatedArticlesProps) => {
  const { postList } = props;

  return (
    <VStack
      display={['none', 'none', 'none', 'block']}
      spacing={2}
      align='left'
      gridRow='content'
      gridColumn='left-side'
      position='sticky'
      height='fit-content'
      top={5}>
      <Heading as='h1' size='lg' mb={1}>
        Recent Articles
      </Heading>
      {postList.map((post, index) => (
        <RelatedPostItem key={index} {...post} />
      ))}
    </VStack>
  );
};

export default RelatedArticles;
