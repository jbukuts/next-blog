/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import { Box, Heading, Link, List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { SectionHead } from '../helpers/mdast-compile-toc';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  currentSection: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, currentSection } = props;

  const sizeMap = ['md', 'sm', 'xs'];

  return (
    <Box
      display={['none', 'none', 'none', 'block']}
      gridRow='content'
      gridColumn='right-side'
      position='sticky'
      height='fit-content'
      top={5}>
      <Link href='#' title='Back to Top'>
        <Heading as='h1' size='sm'>
          Table of Contents
        </Heading>
      </Link>
      <List>
        {tableOfContents
          .filter(({ tagName }) => tagName !== 'h1')
          .map(({ title, id, depth }, index) => (
            <ListItem
              ml={(depth - 2) * 3}
              fontSize={sizeMap[depth - 2]}
              color='gray.500'
              key={index}
              {...(id === currentSection && {
                textDecoration: 'underline',
                color: 'gray.900'
              })}>
              <Link href={`#${id}`}>{title}</Link>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default TableOfContents;
