import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import '../styles/globals.scss';
import Main from '../src/components/Main/Main';
import React, { useEffect, useState } from 'react';

export const HeaderContext = React.createContext([{}, () => {}]);

function MyApp({ Component, pageProps, router }) {
  const [headerState, setHeaderState] = useState({
    route: ['/'],
    tags: []
  });

  useEffect(() => {
    const { asPath, route } = router;

    setHeaderState(old => ({
      ...old,
      route: [...old.route.slice(-1), route === '/' ? asPath : '/']
    }));
  }, [router.asPath]);

  return <HeaderContext.Provider value={[headerState, setHeaderState]}>
    <Header/>
    <Main>
      <Component {...pageProps} />
    </Main>
    <Footer/>
  </HeaderContext.Provider>;
}

export default MyApp
