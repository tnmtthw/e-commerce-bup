// Function to fetch data count
export const fetchDataCount = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/data-total-count`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data count");
  }
  return res.json();
};
