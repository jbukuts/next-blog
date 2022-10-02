import Image from 'next/image';
import Link from 'next/link';
import '../styles/globals.scss';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';

function MyApp({ Component, pageProps, router  }) {
  return <>
    <header>
      <Link href='/'>
        <a>
          <Image width={2000} height={836} alt='Bukut Blog' src='/name-chrome.png'/>
        </a>
      </Link>
    </header>
    <main>
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode='wait'>
          <m.div
            key={router.route}
            className="animation-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...pageProps} />
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </main>
    <footer>★ ° . *　　　°　.　°☆ 　. * ● ¸ . 　　　★ 　° :. ★　 * • ○ ° ★　 * 　.　 　　　　　. 　 ° 　. ● . ★ ° . *　　　°　.　°☆ 　. * ● ¸ . 　　　★ 　° :●. 　 * • ○ ° ★　 .　 * 　.　 　　　　　. 　 ° 　. ● . ★ ° . *　　　°　.　☆ 　. * ● ¸ . 　　　★ 　 ° :. 　 * • ○ ° ★　 .　 * 　.　 　★　　　　. 　 ° 　. . 　 ★　 　　° °☆ 　¸. ● . 　　★　★ ° . *　　　°　.　°☆ 　. * ● ¸ . ★ ° . *　　　°　.　°☆ 　. * ● ¸ 　　　★ 　° :. 　 * •</footer>
  </>;
}

export default MyApp
