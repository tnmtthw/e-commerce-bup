export const fetchUserCartItemAndOrderCount = async () => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(
    `http://localhost:8000/api/getUserCartAndOrderCounts/${userId}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
