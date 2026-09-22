var BASE_URL = "https://tienhiep.vercel.app";

var DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
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
    if (!cover) {
        return "https://tienhiep.vercel.app/icon.svg";
    }
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
        return JSON.parse(res.text());
    }
    return null;
}

function extractBookId(html, url) {
    if (html) {
        var m = html.match(/bookId\\*":\s*\\*"?([a-zA-Z0-9_\-]+)\\*"?/);
        if (m && m[1]) {
            return m[1].replace(/\\/g, "").replace(/"/g, "").trim();
        }
    }
    if (url) {
        var uMatch = url.match(/\/books\/([0-9]+|new-[0-9]+)/);
        if (uMatch && uMatch[1]) {
            return uMatch[1];
        }
    }
    return null;
}

function extractBookSlug(url) {
    if (!url) return "";
    var m = url.match(/\/books\/([a-zA-Z0-9_\-]+)/);
    if (m && m[1]) {
        return m[1];
    }
    return "";
}
