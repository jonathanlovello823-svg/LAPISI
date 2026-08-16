const GAS_URL =
  "https://script.google.com/macros/s/AKfycby79xI5AR_R4XD5xSU7D_Qyr-0Je9y7HoQZqJp7VDqRPl3Wnbp1MYXd62OQ1UrVz5l0/exec";

export async function onRequest(context) {
  const incomingUrl = new URL(context.request.url);

  const targetUrl = new URL(GAS_URL);

  // Teruskan query parameter
  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const request = new Request(targetUrl.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
    redirect: "manual"
  });

  const response = await fetch(request);

  const headers = new Headers(response.headers);

  // Jangan biarkan redirect Google Apps Script
  // langsung mengubah URL browser.
  headers.delete("location");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
