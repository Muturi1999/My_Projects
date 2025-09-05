import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../store/auth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
