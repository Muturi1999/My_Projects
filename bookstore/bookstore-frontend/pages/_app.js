import '../styles/globals.css';
import { AuthProvider } from '../store/auth';
import { ThemeProvider } from '../store/theme';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
