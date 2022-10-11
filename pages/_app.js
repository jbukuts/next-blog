import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import '../styles/globals.scss';
import Main from '../src/components/Main/Main';

function MyApp({ Component, pageProps }) {
  return <>
    <Header/>
      <Main>
        <Component {...pageProps} />
      </Main>
    <Footer/>
  </>;
}

export default MyApp
