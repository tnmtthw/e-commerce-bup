export const fetchUserCartItemAndOrderCount = async () => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserCartAndOrderCounts/${userId}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
