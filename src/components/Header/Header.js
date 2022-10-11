import Image from "next/image";
import Link from "next/link";
import React from "react"
import styles from './Header.module.scss';

const Header = () => {
    return (<header className={styles['blog-header']}>
        <Link href='/'>
            <a>
                <Image width={2000} height={836} alt='Bukut Blog' src='/name-chrome.webp'/>
            </a>
        </Link>
    </header>);
}

export default Header;