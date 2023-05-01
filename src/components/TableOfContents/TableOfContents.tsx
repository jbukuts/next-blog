'use client';

/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from 'classnames';
import React, { useContext, useEffect } from 'react';
import { SectionHead } from '@/data-layer/index';
import useCurrentHeading from '@/hooks/useCurrentHeading';
import TitleContext from 'src/state/TitleContext';
import { SmartLink } from '../article-helpers';
import { SideBar } from '../Layout';
import { Stack } from '../UI';
import styles from './TableOfContents.module.scss';

interface TableOfContentsProps {
  tableOfContents: SectionHead[];
  articleTitle: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { tableOfContents, articleTitle } = props;

  const currentSection = useCurrentHeading(
    'h1[id],h2[id],h3[id],h4[id],h5[id]',
    {
      threshold: [0, 1],
      rootMargin: `-${styles.headerHeight} 0px -90% 0px`
    }
  );

  const [_, setTitle] = useContext(TitleContext);

  useEffect(() => {
    setTitle(articleTitle);
  }, [articleTitle, setTitle]);

  return (
    <Stack
      type='vertical'
      spacing='none'
      as={SideBar}
      side='right'
      className={styles.tableOfContents}>
      <SmartLink href='#' title='Back to top' className={styles.linkItem}>
        <h2>In This Article</h2>
      </SmartLink>
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
              <SmartLink href={`#${id}`} className={styles.linkItem}>
                {title}
              </SmartLink>
            </li>
          ))}
      </ul>
    </Stack>
  );
};

export default TableOfContents;
