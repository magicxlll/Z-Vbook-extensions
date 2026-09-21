var BASE_URL = "https://lacatruyen.fit";
var IMAGE_BASE = "https://cms.metruyen.com/storage/uploads/";

try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {}

function getHeaders(extraHeaders) {
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
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

function fetchBook(url, options) {
    options = options || {};
    options.headers = getHeaders(options.headers);
    return fetch(url, options);
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

function postJson(url, payload, options) {
    options = options || {};
    var extra = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
    };
    if (options.headers) {
        for (var k in options.headers) {
            extra[k] = options.headers[k];
        }
    }
    options.headers = getHeaders(extra);
    options.method = "POST";
    options.body = typeof payload === "string" ? payload : JSON.stringify(payload);
    var res = fetch(url, options);
    if (!res || !res.ok) return null;
    try {
        return res.json();
    } catch (e) {
        return null;
    }
}

function extractNextData(html) {
    if (!html) return null;
    var match = html.match(/<script id=\"__NEXT_DATA__\"[^>]*>(.*?)<\/script>/s);
    if (!match) return null;
    try {
        return JSON.parse(match[1]);
    } catch (e) {
        return null;
    }
}

function resolveCover(img, title, slug) {
    if (img && img.indexOf("logo") === -1 && img.indexOf("no-image") === -1) {
        img = (img + "").trim();
        if (img.indexOf("http") === 0) return img;
        if (img.indexOf("/") === 0) return BASE_URL + img;
        return IMAGE_BASE + img;
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
    var str = slug || title || "novel";
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    var p = palettes[Math.abs(hash) % palettes.length];
    var shortTitle = (title || "Truyen").replace(/[\r\n\t]+/g, " ").trim();
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
        var name = (item.story_title || item.title || "").trim();
        var slug = (item.story_slug || item.slug || "").trim();
        if (!name || !slug) continue;

        var link = BASE_URL + "/story/" + slug;
        var cover = resolveCover(item.story_image || item.image, name, slug);
        var author = item.pen_name_user || item.name_user || item.story_author || item.author || "";
        var desc = "";
        if (author) {
            desc = "Tác giả: " + author;
        } else if (item.story_description || item.description) {
            desc = item.story_description || item.description;
        } else if (item.count_chap || item.count_chapter) {
            desc = (item.count_chap || item.count_chapter) + " chương";
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
