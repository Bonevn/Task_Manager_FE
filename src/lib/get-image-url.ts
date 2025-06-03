export default function getImageUrl(inputUrl: string): string {
    if (inputUrl.includes("https://")) {
        return inputUrl;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBase) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    }
  
    // 1. Split on "/"
    //    e.g. "http://localhost:38989/upload/image/foo.png".split("/")
    //    => ["http:", "", "localhost:38989", "upload", "image", "foo.png"]
    const parts = inputUrl.split("/");

    // 2. If it doesn't have at least 4 segments (protocol + "" + host + path),
    //    just return it unchanged. (Could also throw, if you prefer.)
    if (parts.length < 4) {
      console.warn("replaceDomainWithEnvUsingSplit: invalid URL =>", inputUrl);
      return inputUrl;
    }
  
    // 3. Re-assemble everything AFTER the domain:
    //    slice(3) => ["upload", "image", "foo.png", "…"]
    const pathAndBeyond = parts.slice(3).join("/"); // "upload/image/foo.png…"
  
    // 4. Normalize the base so we don't end up with double slashes:
    //    e.g. "https://api.example.com/" -> "https://api.example.com"
    const normalizedBase = apiBase.replace(/\/$/, "");
  
    // 5. Prepend and return:
    //    "https://api.example.com" + "/" + "upload/image/foo.png…"
    const result = `${normalizedBase}/${pathAndBeyond}`;
    return result;
}