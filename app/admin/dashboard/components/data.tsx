// export const fetchData = async (endpoint: string) => {
//   const res = await fetch(`https://infinitech-testing5.online/api/dboard/${endpoint}`);
//   if (!res.ok) {
//     throw new Error(`Failed to fetch data from ${endpoint}`);
//   }
//   return res.json();
// };


export const fetchDataCount = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data-total-count-dboard`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
