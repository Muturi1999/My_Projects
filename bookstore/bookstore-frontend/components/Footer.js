export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <div className="text-center text-sm text-gray-600">
        © {new Date().getFullYear()} BookStore. Built with ❤️ by Mike Muturi.
      </div>
    </footer>
  );
}
