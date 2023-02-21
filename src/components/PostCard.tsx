import { Box, HStack, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import TagBadge from './Badge';
import Window from './Window';

const MASK_GRADIENT =
  'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 1) 100%)';

const CARD_SPACING = 1.5;

interface PostCardProps
  extends Partial<
    Pick<ProcessedContent, 'tags' | 'slug' | 'date' | 'timeToRead'>
  > {
  children: React.ReactNode;
  tagLine?: string;
  restrictHeight?: boolean;
}

const PostCard = (props: PostCardProps) => {
  const { slug, tags, timeToRead, date, children, tagLine, restrictHeight } =
    props;

  return (
    <Window
      title={`${slug}.md`}
      as={NextLink}
      asProps={{
        transition: 'all .15s linear',
        _hover: {
          textDecoration: 'none',
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.5)'
        },
        href: `/post/${slug}`,
        position: 'relative'
      }}>
      <Box
        {...(restrictHeight && {
          height: '10rem',
          style: { WebkitMaskImage: MASK_GRADIENT, maskImage: MASK_GRADIENT }
        })}>
        {children}
      </Box>

      <VStack position='absolute' bottom={4} right={4} spacing={CARD_SPACING}>
        <HStack spacing={CARD_SPACING} justifyContent='flex-end' width='100%'>
          {tagLine && <TagBadge>{tagLine}</TagBadge>}
          {tags && tags.map((t, index) => <TagBadge key={index}>{t}</TagBadge>)}
        </HStack>
        <HStack spacing={CARD_SPACING} justifyContent='flex-end' width='100%'>
          {date && (
            <TagBadge emoji='🗓'>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </TagBadge>
          )}
          {timeToRead && <TagBadge emoji='⏰'>{timeToRead} min</TagBadge>}
        </HStack>
      </VStack>
    </Window>
  );
};

PostCard.defaultProps = {
  tagLine: undefined,
  restrictHeight: true
};

export default PostCard;
