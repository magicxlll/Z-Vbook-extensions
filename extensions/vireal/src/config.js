var BASE_URL = "https://vireal.vn";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

function fetchBook(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
    options.headers["Referer"] = BASE_URL + "/";
    return fetch(url, options);
}