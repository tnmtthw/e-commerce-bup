// Function to fetch data count
export const fetchDataCount = async () => {
  const res = await fetch("http://localhost:8000/api/data-total-count/");
  if (!res.ok) {
    throw new Error("Failed to fetch data count");
  }
  return res.json();
};
