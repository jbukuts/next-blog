/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import cx from 'classnames';
import React from 'react';
import { SectionHead } from '../../helpers/mdast-compile-toc';
import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  currentSection: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, currentSection } = props;

  return (
    <div className={styles.toc}>
      <h1>
        <a href='#' title='Back to Top'>
          Table of Contents
        </a>
      </h1>
      {tableOfContents
        .filter(({ tagName }) => tagName !== 'h1')
        .map(({ title, id, tagName }, index) =>
          React.createElement(
            tagName,
            {
              key: index,
              className: cx(id === currentSection && styles.activeSection)
            },
            <a href={`#${id}`}>{title}</a>
          )
        )}
    </div>
  );
};

export default TableOfContents;
