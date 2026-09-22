var BASE_URL = "https://khotruyenchu.fun";
var DEFAULT_COVER = "https://khotruyenchu.fun/wp-content/uploads/2025/12/cropped-Logo-2-300x300.png";

var DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": BASE_URL + "/"
};

function cleanUrl(url) {
    if (!url) return "";
    url = url.trim();
    if (url.indexOf("//") === 0) {
        return "https:" + url;
    }
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
        return url;
    }
    if (url.indexOf("/") === 0) {
        return BASE_URL + url;
    }
    return BASE_URL + "/" + url;
}

function resolveCover(cover) {
    if (!cover) return DEFAULT_COVER;
    cover = cover.trim();
    if (cover.indexOf("data:image") === 0) return DEFAULT_COVER;
    return cleanUrl(cover);
}

function fetchBook(url, options) {
    var fullUrl = cleanUrl(url);
    var opts = options || {};
    var headers = opts.headers || DEFAULT_HEADERS;
    var method = opts.method || "GET";
    var body = opts.body || null;

    if (body) {
        return fetch(fullUrl, {
            method: method,
            headers: headers,
            body: body
        });
    }

    return fetch(fullUrl, {
        method: method,
        headers: headers
    });
}

function fetchJson(url, options) {
    var fullUrl = cleanUrl(url);
    var opts = options || {};
    var headers = opts.headers || {
        "User-Agent": DEFAULT_HEADERS["User-Agent"],
        "Accept": "application/json, text/plain, */*",
        "Referer": BASE_URL + "/"
    };

    var res = fetch(fullUrl, {
        method: opts.method || "GET",
        headers: headers
    });

    if (res && res.status === 200) {
        try {
            return JSON.parse(res.text());
        } catch (e) {
            return null;
        }
    }
    return null;
}
