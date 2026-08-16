const GAS_URL =
  "https://script.google.com/macros/s/AKfycby79xI5AR_R4XD5xSU7D_Qyr-0Je9y7HoQZqJp7VDqRPl3Wnbp1MYXd62OQ1UrVz5l0/exec";

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  const targetUrl = new URL(GAS_URL);

  // Teruskan query parameter dari domain kita
  requestUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const response = await fetch(targetUrl.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,

    // IKUTI redirect Google Apps Script
    redirect: "follow"
  });

  const headers = new Headers(response.headers);

  // Jangan teruskan header yang bisa membuat masalah
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    headers
  });
}
