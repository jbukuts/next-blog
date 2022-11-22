import React from "react";
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { withRouter } from "next/router";
import styles from './Main.module.scss';

const ANIMATIONS = {
    className: 'animation-wrapper',
    initial:{ opacity: 0 },
    animate :{ opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
}
// TODO: fix issue around css modules unloading too quick
const AnimationWrapper = withRouter(({children, router}) => {
    return <LazyMotion features={domAnimation}>
        <AnimatePresence mode='wait'>
            <m.div key={router.route} {...ANIMATIONS}>
                {children}
            </m.div>
        </AnimatePresence>
  </LazyMotion>
})

const Main = ({children}) => {
    return (<main className={styles['blog-main']}>
        {children}
    </main>) 
}

export default Main;