// pages/login.jsx
import Layout from '@/layouts/Layout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 px-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In to Your Account</h1>
        <LoginForm />
      </div>
    </Layout>
  );
}
