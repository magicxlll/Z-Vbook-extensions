var BASE_URL = "https://truyensac.buzz";
var API_URL = "https://api.truyensac.buzz";
var CDN_URL = "https://file.truyensac.buzz/files/";

try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {}

function getHeaders(extraHeaders) {
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Origin": BASE_URL,
        "Referer": BASE_URL + "/"
    };
    if (extraHeaders) {
        for (var key in extraHeaders) {
            headers[key] = extraHeaders[key];
        }
    }
    return headers;
}

function fetchJson(url, options) {
    options = options || {};
    options.headers = getHeaders(options.headers);
    var res = fetch(url, options);
    if (!res || !res.ok) return null;
    try {
        return res.json();
    } catch (e) {
        return null;
    }
}

function fetchBook(url, options) {
    options = options || {};
    options.headers = getHeaders(options.headers);
    return fetch(url, options);
}

function resolveCover(cover, slug) {
    if (!cover || cover.indexOf("logo.webp") > -1 || cover.indexOf("no-image.webp") > -1) {
        if (slug) {
            return CDN_URL + "covers/" + slug + ".webp";
        }
        return "";
    }
    cover = (cover + "").replace(/files\/\/+covers\//g, "files/covers/");
    if (cover.indexOf("http") === 0) return cover;
    if (cover.indexOf("/") === 0) return BASE_URL + cover;
    return CDN_URL + cover;
}

function parseStories(arr) {
    var r = [];
    if (!arr || !Array.isArray(arr)) return r;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (!item) continue;
        var name = (item.name || "").trim();
        var slug = (item.slug || "").trim();
        if (!name || !slug) continue;

        var link = BASE_URL + "/truyen/" + slug;
        var cover = resolveCover(item.coverUrl, slug);
        var desc = "";
        if (item.authorName) {
            desc = "Tác giả: " + item.authorName;
        } else if (item.description) {
            desc = item.description;
        } else if (item.latestChapter && item.latestChapter.name) {
            desc = "Mới nhất: " + item.latestChapter.name;
        }

        r.push({
            name: name,
            link: link,
            cover: cover,
            description: desc,
            host: BASE_URL
        });
    }
    return r;
}
