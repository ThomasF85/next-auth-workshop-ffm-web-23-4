import GlobalStyles from "../styles/GlobalStyles";
import { StyledContainer } from "../components/StyledContainer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <StyledContainer>
        <h1>🐬 Next Auth Demo 🐬</h1>
        <Component {...pageProps} />
      </StyledContainer>
    </>
  );
}

export default MyApp;
