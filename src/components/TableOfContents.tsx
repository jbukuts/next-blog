/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import cx from 'classnames';
import React from 'react';
import { SectionHead } from '../helpers/mdast-compile-toc';
import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  currentSection: string;
}

const DEPTH_STYLES = [
  {},
  { marginLeft: '.5rem', fontSize: '.875rem' },
  { marginLeft: '.75rem', fontSize: '.75rem' }
];

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, currentSection } = props;

  return (
    <div className={styles.tableOfContents}>
      <a href='#' title='Back to Top'>
        <h1>Table of Contents</h1>
      </a>
      <ul>
        {tableOfContents
          .filter(({ tagName }) => tagName !== 'h1')
          .map(({ title, id, depth }, index) => (
            <li
              style={DEPTH_STYLES[depth - 2]}
              key={index}
              className={cx(id === currentSection && styles.currentSection)}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
