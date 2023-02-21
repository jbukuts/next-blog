import { Tag, TagProps } from '@chakra-ui/react';
import React from 'react';
import { colorsMemo } from '../helpers/colors';

interface TagBadgeProps {
  children: React.ReactNode;
  emoji?: string;
  addColor?: boolean;
  size?: TagProps['size'];
}

const TagBadge = (props: TagBadgeProps) => {
  const { children, size, emoji, addColor } = props;

  return (
    <Tag
      bg='brand.barColor'
      {...(addColor &&
        (() => {
          const { color, compliment } = colorsMemo[children as string];

          return {
            bg: color,
            color: compliment
          };
        })())}
      size={size}
      whiteSpace='nowrap'>
      {children}
      {emoji && ` ${emoji}`}
    </Tag>
  );
};

TagBadge.defaultProps = {
  emoji: undefined,
  addColor: false,
  size: 'md'
};

export default TagBadge;
