import { HStack } from '@chakra-ui/react';
import React from 'react';
import { ProcessedContent } from '../data-layer/pull-blog-data';
import TagBadge from './Badge';

type ArticleTagsProps = Pick<ProcessedContent, 'tags' | 'timeToRead' | 'date'>;

const ArticleTags: React.FC<ArticleTagsProps> = (props) => {
  const { tags, timeToRead, date } = props;

  return (
    <HStack spacing={1.5} mb={4}>
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
      <TagBadge emoji='⏰'>{timeToRead} min</TagBadge>
      <TagBadge emoji='📅'>
        Published on{' '}
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TagBadge>
    </HStack>
  );
};

export default ArticleTags;
