export const fetchData = async (endpoint: string) => {
  const res = await fetch(`http://localhost:8000/api/dboard/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return res.json();
};


export const fetchDataCount = async () => {
  const res = await fetch("http://localhost:8000/api/data-total-count-dboard/");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
