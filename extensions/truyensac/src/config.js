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

function resolveCover(cover, name, slug) {
    if (cover && cover.indexOf("logo.webp") === -1 && cover.indexOf("no-image.webp") === -1) {
        var clean = (cover + "").replace(/files\/\/+covers\//g, "files/covers/");
        if (clean.indexOf("http") === 0) return clean;
        if (clean.indexOf("/") === 0) return BASE_URL + clean;
        return CDN_URL + clean;
    }

    var palettes = [
        { bg: "1e1b4b", text: "e0e7ff" },
        { bg: "4c0519", text: "ffe4e6" },
        { bg: "14532d", text: "dcfce7" },
        { bg: "3b0764", text: "f3e8ff" },
        { bg: "701a75", text: "fdf4ff" },
        { bg: "0f172a", text: "f8fafc" },
        { bg: "7c2d12", text: "ffedd5" }
    ];

    var hash = 0;
    var str = slug || name || "novel";
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    var p = palettes[Math.abs(hash) % palettes.length];
    var shortTitle = (name || "Truyen").replace(/[\r\n\t]+/g, " ").trim();
    if (shortTitle.length > 35) {
        shortTitle = shortTitle.slice(0, 32) + "...";
    }

    return "https://placehold.co/400x600/" + p.bg + "/" + p.text + ".png?text=" + encodeURIComponent(shortTitle);
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
        var cover = resolveCover(item.coverUrl, name, slug);
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
