/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import cx from 'classnames';
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
      <a href='#' title='Back to Top'>
        <h2>Table of Contents</h2>
      </a>
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
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
      </ul>
    </SideBar>
  );
};

export default TableOfContents;
