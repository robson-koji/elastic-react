export default async function runRequest(body) {
  // const response = await fetch("http://<server>/.netlify/functions/search", {
  const response = await fetch(process.env.REACT_APP_API_URL + ".netlify/functions/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
