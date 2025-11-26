import { AdminLayout } from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Guava Admin",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

