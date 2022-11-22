import React from 'react';
import helpers from '../../helpers';
import styles from './TagButton.module.scss';
import cx from 'classnames';

const TagButton = (props) => {
    const { text, isActive = false, onClick = undefined } = props;

    const background = helpers.hashAColor(text);
    const color = helpers.getAccentColor(background);
    const classes = cx(styles['tag-button'], isActive && styles['tag-button__active'])

    return <button
        onClick={onClick}
        className={classes}
        style={{ background, color }}>
            <small>{text}</small>
    </button>
}

export default TagButton;