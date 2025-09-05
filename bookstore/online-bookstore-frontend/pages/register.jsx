// pages/register.jsx
import Layout from '@/layouts/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 px-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Create Your Account</h1>
        <RegisterForm />
      </div>
    </Layout>
  );
}
