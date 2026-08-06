var BASE_URL = "https://storya.click";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

function fetchBook(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
    options.headers["Referer"] = BASE_URL + "/";
    return fetch(url, options);
}

function fixCover(cover) {
    if (!cover) return "";
    if (cover.indexOf("http") === 0) return cover;
    if (cover.indexOf("url=") !== -1) {
        try {
            var rawUrl = cover.split("url=")[1].split("&")[0];
            return BASE_URL + decodeURIComponent(rawUrl);
        } catch (e) {}
    }
    if (cover.indexOf("/") === 0) return BASE_URL + cover;
    return BASE_URL + "/" + cover;
}