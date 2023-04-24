/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from 'classnames';
import NextLink from 'next/link';
import React from 'react';
import { SectionHead } from '../../helpers/mdast-compile-toc';
import { useCurrentPath } from '../../hooks';
import { SideBar } from '../Layout';
import { Stack } from '../UI';
import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  currentSection: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, currentSection } = props;
  const currentPath = useCurrentPath();

  return (
    <Stack
      type='vertical'
      spacing='none'
      as={SideBar}
      side='right'
      className={styles.tableOfContents}>
      <NextLink
        href='#'
        title='Back to top'
        replace
        as={currentPath}
        className={styles.linkItem}>
        <h2>In This Article</h2>
      </NextLink>
      <ul>
        {tableOfContents
          .filter(({ tagName }) => tagName !== 'h1')
          .map(({ title, id, tagName }, index) => (
            <li
              key={index}
              className={cx(
                styles[tagName],
                id === currentSection && styles.currentSection
              )}>
              <NextLink href={`#${id}`} replace className={styles.linkItem}>
                {title}
              </NextLink>
            </li>
          ))}
      </ul>
    </Stack>
  );
};

export default TableOfContents;
