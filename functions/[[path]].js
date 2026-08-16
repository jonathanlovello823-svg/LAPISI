const GAS_ORIGIN =
  "https://script.google.com";

const GAS_APP =
  "/macros/s/AKfycby79xI5AR_R4XD5xSU7D_Qyr-0Je9y7HoQZqJp7VDqRPl3Wnbp1MYXd62OQ1UrVz5l0/exec";

export async function onRequest(context) {

  const incoming = new URL(context.request.url);

  let target;

  /*
   * Halaman utama Apps Script
   */
  if (
    incoming.pathname === "/" ||
    incoming.pathname === ""
  ) {
    target = new URL(GAS_ORIGIN + GAS_APP);

    incoming.searchParams.forEach((value, key) => {
      target.searchParams.append(key, value);
    });
  }

  /*
   * Resource internal Apps Script:
   * /static/...
   */
  else {
    target = new URL(
      GAS_ORIGIN + incoming.pathname
    );

    incoming.searchParams.forEach((value, key) => {
      target.searchParams.append(key, value);
    });
  }

  const request = new Request(
    target.toString(),
    {
      method: context.request.method,
      headers: context.request.headers,
      body:
        context.request.method === "GET" ||
        context.request.method === "HEAD"
          ? undefined
          : context.request.body,

      redirect: "follow"
    }
  );

  const response = await fetch(request);

  const headers = new Headers(response.headers);

  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("content-security-policy");

  return new Response(
    response.body,
    {
      status: response.status,
      headers
    }
  );
}
