var BASE_URL = "http://vietnamthuquan.eu";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

function fetchBook(url, options) {
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers["Cookie"] = "AspxAutoDetectCookieSupport=1";
    options.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    return fetch(url, options);
}
