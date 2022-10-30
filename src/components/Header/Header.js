import Image from "next/image";
import Link from "next/link";
import React from "react"
import styles from './Header.module.scss';

const Header = (props) => {
    const { previousPage } = props;

    return (<header className={styles['blog-header']}>
        <Link href={previousPage.slice(-2)[0]}>
            <a>
                <Image width={240} height={100} alt='Bukut Blog' src='/name-chrome.webp'/>
            </a>
        </Link>
    </header>);
}

export default Header;