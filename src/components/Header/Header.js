import Image from "next/image";
import Link from "next/link";
import { withRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react"
import { HeaderContext } from "../../../pages/_app";
import TagButton from "../TagButton/TagButton";
import styles from './Header.module.scss';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';

const ANIMATIONS = {
    initial:{ y: -100 },
    animate :{ y: 0 },
    exit: { y: 100 },
    transition: { duration: 0.25 },
}

const Header = (props) => {
    const { router } = props;
    const [{route, tags, title}] = useContext(HeaderContext);
    const titleRef = useRef();

    const [showTitle, setShowTitle] = useState(false);

    const goToTagSearch = (tag) => {
        router.push(`/?tags=${tag}`);
    }

    useEffect(() => {
        if (!titleRef.current) return;

        const callback = (entries) => {
            const { isIntersecting } = entries[0]
            setShowTitle(!isIntersecting);
        }

        const OBSERVER_OPTIONS = {
            rootMargin: '0px',
            threshold: 1.0
        }
        const observer = new IntersectionObserver(callback, OBSERVER_OPTIONS);
        observer.observe(titleRef.current)

    }, []);


    return (<>
        <header className={styles['blog-header']}>
            <Link href={route.slice(-2)[0]} className={styles['blog-header__link']}>
                <a>
                    <Image width={240} height={100} alt='Bukut Blog' src='/name-chrome.webp'/>
                </a>
            </Link>
        </header>
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                <h1 ref={titleRef} className={styles['blog-header__title']}>{title}</h1>
                {tags.length > 0 && <div className={styles['blog-header__article-info']}>
                    {showTitle && <m.h2 {...ANIMATIONS}>{title}</m.h2>}
                    <m.div className={styles['blog-header__tags']}>
                        {tags.map((tag, i) => <TagButton key={i} text={tag} onClick={() => goToTagSearch(tag)}/>)}
                    </m.div>
                </div>}
            </AnimatePresence>
        </LazyMotion>
    </>);
}

export default  withRouter(Header);