var BASE_URL = "https://hachoangdaide.online";

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
    if (!cover) {
        return "https://hachoangdaide.online/stories/settings/J9QPNXzJKxrVjxZI5eSorlZWj1Jb3icOJQZD1Tth.png";
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
        "X-Requested-With": "XMLHttpRequest",
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

function extractStoryId(html, url) {
    if (html) {
        // Pattern 1: story_id: 1006
        var m1 = html.match(/story_id\s*:\s*([0-9]+)/i);
        if (m1 && m1[1]) return m1[1];

        // Pattern 2: itemDetail: JSON.parse('{\u0022id\u0022:1006
        var m2 = html.match(/itemDetail\s*:\s*JSON\.parse\('\{[^}]*\\u0022id\\u0022\s*:\s*([0-9]+)/i);
        if (m2 && m2[1]) return m2[1];

        // Pattern 3: \u0022id\u0022:1006
        var m3 = html.match(/\\u0022id\\u0022\s*:\s*([0-9]+)/i);
        if (m3 && m3[1]) return m3[1];

        // Pattern 4: "id": 1006
        var m4 = html.match(/"id"\s*:\s*([0-9]+)/i);
        if (m4 && m4[1]) return m4[1];
    }
    return null;
}
