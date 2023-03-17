import init, {
  remove_header_start_end,
} from "https://unpkg.com/rust-rewriter@1.4.0/rust_rewriter.js";

async function loadText(context) {
  const response = await context.next();

  if (response.headers.get("content-type")?.includes("text/html")) {
    // load text only if response is text/html
    const responseText = await response.text();
    return { responseText, response };
  } else {
    return { responseText: "", response };
  }
}

export default async (request, context) => {
  // 1. start loading response text and wasm in parallel
  const promises = [loadText(context), init()];
  // 2. while promises are loading, do some work

  const url = new URL(request.url);
  const isSimplabs = ["simplabs.com", "simplabs.de"].includes(url.hostname);

  // 3. wait for wasm and response text to load
  // eslint-disable-next-line prettier/prettier
  const [{ responseText, response }] = await Promise.all(promises);

  // if url has query parameter simplabs=true, set session cookie to show header
  if (url.searchParams.get("simplabs") === "true") {
    // eslint-disable-next-line no-undef
    if (Deno.env.get("NETLIFY_DEV") === "true") {
      // if running locally on http://, set cookie without secure flag
      response.headers.set("Set-Cookie", `simplabs=true; path=/; SameSite=Strict`);
    } else {
      response.headers.set("Set-Cookie", `simplabs=true; path=/; secure; SameSite=Strict`);
    }
  }

  const locationHeader = response.headers.get("location");
  if (isSimplabs && locationHeader) {
    // Parse location into a URL object
    const redirectUrl = new URL(locationHeader);

    // Add query parameters to the URL object
    redirectUrl.searchParams.append("simplabs", "true");

    // Set the new value of the location header
    response.headers.set("location", redirectUrl.toString());
  }

  if (!responseText) {
    //if there is not responseText, then it is not HTML, so just return the response
    return response;
  }

  // check if cookie is set to show header
  const showHeader =
    response.headers.get("Set-Cookie")?.includes("simplabs=true") ||
    request.headers.get("cookie")?.includes("simplabs=true");

  // 4. remove header if needed
  const newText = showHeader
    ? responseText
    : remove_header_start_end(
        responseText,
        "<!-- SIMPLABS_HEADER_START -->",
        "<!-- SIMPLABS_HEADER_END -->"
      );
  return new Response(newText, response);
};
