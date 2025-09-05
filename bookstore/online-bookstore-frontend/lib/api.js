export const fetchAllBooks = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
};
