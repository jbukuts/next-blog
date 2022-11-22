import React from "react";
import styles from './Footer.module.scss';
import helpers from "../../helpers";

const STAR_CHARS = ["★", " ", "°", ".", " ", "*", "　", "☆", "●", ".", ":", "•", "○", "   "];
const SKYLINE_LENGTH = 50;

const Footer = () => {
    const createSkyline = (word = '') => {
        const sky = [...new Array(SKYLINE_LENGTH)].map(() => STAR_CHARS[helpers.getRandomInt(0, STAR_CHARS.length)]);
        !!word && sky.splice(SKYLINE_LENGTH/2, 0, word);
        return sky.join('');
    };

    return <footer className={styles['blog-footer']}>
      <h2>Thanks for reading</h2>
    </footer>
}

export default Footer;