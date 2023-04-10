/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from 'classnames';
import NextLink from 'next/link';
import React from 'react';
import { SectionHead } from '../helpers/mdast-compile-toc';
import styles from '../styles/components/TableOfContents.module.scss';
import { SideBar } from './Layout';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  currentSection: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, currentSection } = props;

  return (
    <SideBar side='right' className={styles.tableOfContents}>
      <NextLink href='#' title='Back to Top' replace>
        <h2>Table of Contents</h2>
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
              <NextLink href={`#${id}`} replace>
                {title}
              </NextLink>
            </li>
          ))}
      </ul>
    </SideBar>
  );
};

export default TableOfContents;
