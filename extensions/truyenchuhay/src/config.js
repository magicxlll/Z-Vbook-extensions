var BASE_URL = "https://truyenchuhay.org";

function cleanUrl(url) {
    if (!url) return BASE_URL;
    url = url.trim();
    if (url.indexOf("http") !== 0) {
        if (url.indexOf("/") === 0) {
            url = BASE_URL + url;
        } else {
            url = BASE_URL + "/" + url;
        }
    }
    // Cắt bỏ trailing slash nếu không phải root
    if (url.length > 8 && url.slice(-1) === "/") {
        url = url.slice(0, -1);
    }
    return url;
}

function fetchBook(url, options) {
    url = cleanUrl(url);
    options = options || {};
    var headers = options.headers || {};
    if (!headers["User-Agent"]) {
        headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    }
    if (!headers["Accept"]) {
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
    }
    if (!headers["Accept-Language"]) {
        headers["Accept-Language"] = "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7";
    }
    return fetch(url, {
        headers: headers,
        method: options.method || "GET"
    });
}

function fetchJson(url) {
    try {
        var res = fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*"
            }
        });
        if (res && res.ok) {
            var text = res.text();
            if (text) {
                return JSON.parse(text);
            }
        }
    } catch (e) {}
    return null;
}

function resolveCover(coverUrl, storySlug) {
    if (coverUrl) {
        coverUrl = coverUrl.trim();
        if (coverUrl.indexOf("/images/logo") !== -1 || coverUrl.indexOf("no-image") !== -1 || coverUrl.indexOf(".svg") !== -1) {
            coverUrl = "";
        }
    }
    if (coverUrl) {
        if (coverUrl.indexOf("//") === 0) {
            return "https:" + coverUrl;
        }
        if (coverUrl.indexOf("http") === 0) {
            return coverUrl;
        }
        if (coverUrl.indexOf("/") === 0) {
            return BASE_URL + coverUrl;
        }
        return BASE_URL + "/" + coverUrl;
    }
    if (storySlug) {
        storySlug = storySlug.replace(/^https?:\/\/[^\/]+\//i, "").replace(/[\/\?#].*$/, "").trim();
        if (storySlug) {
            return "https://static2.truyenchuhay.org/images/" + storySlug + ".jpg";
        }
    }
    return "";
}

function extractStoryId(html) {
    if (!html) return null;
    var match = html.match(/idStory[^0-9]{1,10}(\d+)/i)
        || html.match(/id_story[^0-9]{1,10}(\d+)/i)
        || html.match(/"id"\s*:\s*(\d+)[^}]*urlStory/i);
    if (match) {
        return match[1];
    }
    return null;
}
