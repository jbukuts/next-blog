import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import '../styles/globals.scss';
import Main from '../src/components/Main/Main';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps, router }) {
  const [previousPage, setPreviousPage] = useState(['/']);

  useEffect(() => {
    const { asPath, route } = router;
    setPreviousPage(old => [...old.slice(-1), route === '/' ? asPath : '/']);
  }, [router.asPath]);

  return <>
    <Header previousPage={previousPage}/>
    <Main>
      <Component {...pageProps} />
    </Main>
    <Footer/>
  </>;
}

export default MyApp
