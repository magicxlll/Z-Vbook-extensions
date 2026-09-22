var BASE_URL = "https://lacatruyen.fit";
var IMAGE_BASE = "https://cms.metruyen.com/storage/uploads/";

try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {}

function cleanUrl(url) {
    if (!url) return "";
    url = (url + "").replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    // Remove trailing slashes before query parameters or at end of string
    url = url.replace(/\/+(\?.*)?$/, "$1");
    return url;
}

function getHeaders(extraHeaders) {
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
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
    url = cleanUrl(url);
    options = options || {};
    options.headers = getHeaders(options.headers);
    return fetch(url, options);
}

function fetchJson(url, options) {
    url = cleanUrl(url);
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
    url = cleanUrl(url);
    options = options || {};
    var extra = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "Origin": BASE_URL,
        "Referer": BASE_URL + "/"
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

// =========================================================================
// ULTRA-FAST PURE ES5 AES-256-CBC & OPENSSL EVPKDF ENGINE (BUILT-IN)
// =========================================================================
var B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64Encode(bytes) {
    var out = [];
    var i = 0, len = bytes.length;
    while (i < len) {
        var b1 = bytes[i++] & 0xff;
        var b2 = i < len ? bytes[i++] & 0xff : -1;
        var b3 = i < len ? bytes[i++] & 0xff : -1;

        var e1 = b1 >> 2;
        var e2 = ((b1 & 3) << 4) | (b2 >= 0 ? b2 >> 4 : 0);
        var e3 = b2 >= 0 ? (((b2 & 15) << 2) | (b3 >= 0 ? b3 >> 6 : 0)) : 64;
        var e4 = b3 >= 0 ? (b3 & 63) : 64;

        out.push(B64_CHARS.charAt(e1), B64_CHARS.charAt(e2), B64_CHARS.charAt(e3), B64_CHARS.charAt(e4));
    }
    return out.join("");
}

function base64Decode(str) {
    str = (str + "").replace(/[^A-Za-z0-9+/=]/g, "");
    var bytes = [];
    var i = 0, len = str.length;
    while (i < len) {
        var e1 = B64_CHARS.indexOf(str.charAt(i++));
        var e2 = B64_CHARS.indexOf(str.charAt(i++));
        var e3 = B64_CHARS.indexOf(str.charAt(i++));
        var e4 = B64_CHARS.indexOf(str.charAt(i++));

        var c1 = (e1 << 2) | (e2 >> 4);
        var c2 = ((e2 & 15) << 4) | (e3 >> 2);
        var c3 = ((e3 & 3) << 6) | e4;

        bytes.push(c1);
        if (e3 !== 64 && e3 !== -1) bytes.push(c2);
        if (e4 !== 64 && e4 !== -1) bytes.push(c3);
    }
    return bytes;
}

function stringToUtf8Bytes(str) {
    str = unescape(encodeURIComponent(str));
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i) & 0xff);
    }
    return bytes;
}

function utf8BytesToString(bytes) {
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    try {
        return decodeURIComponent(escape(str));
    } catch (e) {
        return str;
    }
}

// --- MD5 (RFC 1321) ---
function md5Bytes(bytes) {
    function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }
    function bitRol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
        return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

    var len = bytes.length;
    var words = [];
    for (var i = 0; i < len; i++) {
        words[i >> 2] |= (bytes[i] & 0xff) << ((i % 4) * 8);
    }
    words[len >> 2] |= 0x80 << ((len % 4) * 8);
    var wordLen = (((len + 8) >> 6) + 1) * 16;
    while (words.length < wordLen) words.push(0);
    words[wordLen - 2] = (len * 8) & 0xffffffff;
    words[wordLen - 1] = Math.floor((len * 8) / 0x100000000);

    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (var i = 0; i < words.length; i += 16) {
        var olda = a, oldb = b, oldc = c, oldd = d;

        a = ff(a, b, c, d, words[i + 0], 7, -680876936);
        d = ff(d, a, b, c, words[i + 1], 12, -389564586);
        c = ff(c, d, a, b, words[i + 2], 17, 606105819);
        b = ff(b, c, d, a, words[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, words[i + 4], 7, -176418897);
        d = ff(d, a, b, c, words[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, words[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, words[i + 7], 22, -45705983);
        a = ff(a, b, c, d, words[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, words[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, words[i + 10], 17, -42063);
        b = ff(b, c, d, a, words[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, words[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, words[i + 13], 12, -40341101);
        c = ff(c, d, a, b, words[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, words[i + 15], 22, 1236535329);

        a = gg(a, b, c, d, words[i + 1], 5, -165796510);
        d = gg(d, a, b, c, words[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, words[i + 11], 14, 643717713);
        b = gg(b, c, d, a, words[i + 0], 20, -373897302);
        a = gg(a, b, c, d, words[i + 5], 5, -701558691);
        d = gg(d, a, b, c, words[i + 10], 9, 38016083);
        c = gg(c, d, a, b, words[i + 15], 14, -660478335);
        b = gg(b, c, d, a, words[i + 4], 20, -405537848);
        a = gg(a, b, c, d, words[i + 9], 5, 568446438);
        d = gg(d, a, b, c, words[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, words[i + 3], 14, -187363961);
        b = gg(b, c, d, a, words[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, words[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, words[i + 2], 9, -51403784);
        c = gg(c, d, a, b, words[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, words[i + 12], 20, -1926607734);

        a = hh(a, b, c, d, words[i + 5], 4, -378558);
        d = hh(d, a, b, c, words[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, words[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, words[i + 14], 23, -35309556);
        a = hh(a, b, c, d, words[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, words[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, words[i + 7], 16, -155497632);
        b = hh(b, c, d, a, words[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, words[i + 13], 4, 681279174);
        d = hh(d, a, b, c, words[i + 0], 11, -358537222);
        c = hh(c, d, a, b, words[i + 3], 16, -722521979);
        b = hh(b, c, d, a, words[i + 6], 23, 76029189);
        a = hh(a, b, c, d, words[i + 9], 4, -640364487);
        d = hh(d, a, b, c, words[i + 12], 11, -421815835);
        c = hh(c, d, a, b, words[i + 15], 16, 530742520);
        b = hh(b, c, d, a, words[i + 2], 23, -995338651);

        a = ii(a, b, c, d, words[i + 0], 6, -198630844);
        d = ii(d, a, b, c, words[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, words[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, words[i + 5], 21, -57434055);
        a = ii(a, b, c, d, words[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, words[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, words[i + 10], 15, -1051523);
        b = ii(b, c, d, a, words[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, words[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, words[i + 15], 10, -30611744);
        c = ii(c, d, a, b, words[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, words[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, words[i + 4], 6, -145523070);
        d = ii(d, a, b, c, words[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, words[i + 2], 15, 718787259);
        b = ii(b, c, d, a, words[i + 9], 21, -343485551);

        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
    }

    var result = [];
    var state = [a, b, c, d];
    for (var i = 0; i < 4; i++) {
        var w = state[i];
        result.push(w & 0xff, (w >> 8) & 0xff, (w >> 16) & 0xff, (w >> 24) & 0xff);
    }
    return result;
}

function evpBytesToKey(passwordBytes, saltBytes, keyLen, ivLen) {
    var d = [];
    var prevD = [];
    while (d.length < (keyLen + ivLen)) {
        var data = prevD.concat(passwordBytes).concat(saltBytes);
        prevD = md5Bytes(data);
        d = d.concat(prevD);
    }
    return {
        key: d.slice(0, keyLen),
        iv: d.slice(keyLen, keyLen + ivLen)
    };
}

// --- AES SBOX & Tables ---
var SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];
var INV_SBOX = [];
for (var i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;

var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

var MUL_2 = [], MUL_3 = [], MUL_9 = [], MUL_B = [], MUL_D = [], MUL_E = [];
function gmulInit(a, b) {
    var p = 0;
    for (var counter = 0; counter < 8; counter++) {
        if ((b & 1) !== 0) p ^= a;
        var hi = (a & 0x80) !== 0;
        a = (a << 1) & 0xff;
        if (hi) a ^= 0x1b;
        b >>= 1;
    }
    return p;
}
for (var i = 0; i < 256; i++) {
    MUL_2[i] = gmulInit(2, i);
    MUL_3[i] = gmulInit(3, i);
    MUL_9[i] = gmulInit(0x09, i);
    MUL_B[i] = gmulInit(0x0b, i);
    MUL_D[i] = gmulInit(0x0d, i);
    MUL_E[i] = gmulInit(0x0e, i);
}

function keyExpansion(keyBytes) {
    var keyWords = [];
    for (var i = 0; i < 8; i++) {
        keyWords[i] = (keyBytes[i * 4] << 24) | (keyBytes[i * 4 + 1] << 16) | (keyBytes[i * 4 + 2] << 8) | keyBytes[i * 4 + 3];
    }
    var w = [];
    for (var i = 0; i < 8; i++) w[i] = keyWords[i];

    for (var i = 8; i < 60; i++) {
        var temp = w[i - 1];
        if (i % 8 === 0) {
            var b0 = SBOX[(temp >> 16) & 0xff];
            var b1 = SBOX[(temp >> 8) & 0xff];
            var b2 = SBOX[temp & 0xff];
            var b3 = SBOX[(temp >>> 24) & 0xff];
            temp = ((b0 ^ RCON[i / 8]) << 24) | (b1 << 16) | (b2 << 8) | b3;
        } else if (i % 8 === 4) {
            var b0 = SBOX[(temp >>> 24) & 0xff];
            var b1 = SBOX[(temp >> 16) & 0xff];
            var b2 = SBOX[(temp >> 8) & 0xff];
            var b3 = SBOX[temp & 0xff];
            temp = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
        }
        w[i] = w[i - 8] ^ temp;
    }
    return w;
}

function cipherBlockFast(block, roundKeys) {
    var state = block.slice(0);
    for (var i = 0; i < 4; i++) {
        var rk = roundKeys[i];
        state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
        state[i * 4 + 1] ^= (rk >> 16) & 0xff;
        state[i * 4 + 2] ^= (rk >> 8) & 0xff;
        state[i * 4 + 3] ^= rk & 0xff;
    }

    for (var round = 1; round <= 13; round++) {
        for (var i = 0; i < 16; i++) state[i] = SBOX[state[i]];

        var t = state[1]; state[1] = state[5]; state[5] = state[9]; state[9] = state[13]; state[13] = t;
        t = state[2]; state[2] = state[10]; state[10] = t; t = state[6]; state[6] = state[14]; state[14] = t;
        t = state[15]; state[15] = state[11]; state[11] = state[7]; state[7] = state[3]; state[3] = t;

        for (var c = 0; c < 4; c++) {
            var i0 = c * 4, i1 = i0 + 1, i2 = i0 + 2, i3 = i0 + 3;
            var a0 = state[i0], a1 = state[i1], a2 = state[i2], a3 = state[i3];
            state[i0] = MUL_2[a0] ^ MUL_3[a1] ^ a2 ^ a3;
            state[i1] = a0 ^ MUL_2[a1] ^ MUL_3[a2] ^ a3;
            state[i2] = a0 ^ a1 ^ MUL_2[a2] ^ MUL_3[a3];
            state[i3] = MUL_3[a0] ^ a1 ^ a2 ^ MUL_2[a3];
        }

        for (var i = 0; i < 4; i++) {
            var rk = roundKeys[round * 4 + i];
            state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
            state[i * 4 + 1] ^= (rk >> 16) & 0xff;
            state[i * 4 + 2] ^= (rk >> 8) & 0xff;
            state[i * 4 + 3] ^= rk & 0xff;
        }
    }

    for (var i = 0; i < 16; i++) state[i] = SBOX[state[i]];
    var t = state[1]; state[1] = state[5]; state[5] = state[9]; state[9] = state[13]; state[13] = t;
    t = state[2]; state[2] = state[10]; state[10] = t; t = state[6]; state[6] = state[14]; state[14] = t;
    t = state[15]; state[15] = state[11]; state[11] = state[7]; state[7] = state[3]; state[3] = t;

    for (var i = 0; i < 4; i++) {
        var rk = roundKeys[14 * 4 + i];
        state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
        state[i * 4 + 1] ^= (rk >> 16) & 0xff;
        state[i * 4 + 2] ^= (rk >> 8) & 0xff;
        state[i * 4 + 3] ^= rk & 0xff;
    }

    return state;
}

function invCipherBlockFast(block, roundKeys) {
    var state = block.slice(0);

    for (var i = 0; i < 4; i++) {
        var rk = roundKeys[14 * 4 + i];
        state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
        state[i * 4 + 1] ^= (rk >> 16) & 0xff;
        state[i * 4 + 2] ^= (rk >> 8) & 0xff;
        state[i * 4 + 3] ^= rk & 0xff;
    }

    for (var round = 13; round >= 1; round--) {
        var t = state[13]; state[13] = state[9]; state[9] = state[5]; state[5] = state[1]; state[1] = t;
        t = state[2]; state[2] = state[10]; state[10] = t; t = state[6]; state[6] = state[14]; state[14] = t;
        t = state[3]; state[3] = state[7]; state[7] = state[11]; state[11] = state[15]; state[15] = t;

        for (var i = 0; i < 16; i++) state[i] = INV_SBOX[state[i]];

        for (var i = 0; i < 4; i++) {
            var rk = roundKeys[round * 4 + i];
            state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
            state[i * 4 + 1] ^= (rk >> 16) & 0xff;
            state[i * 4 + 2] ^= (rk >> 8) & 0xff;
            state[i * 4 + 3] ^= rk & 0xff;
        }

        for (var c = 0; c < 4; c++) {
            var i0 = c * 4, i1 = i0 + 1, i2 = i0 + 2, i3 = i0 + 3;
            var a0 = state[i0], a1 = state[i1], a2 = state[i2], a3 = state[i3];
            state[i0] = MUL_E[a0] ^ MUL_B[a1] ^ MUL_D[a2] ^ MUL_9[a3];
            state[i1] = MUL_9[a0] ^ MUL_E[a1] ^ MUL_B[a2] ^ MUL_D[a3];
            state[i2] = MUL_D[a0] ^ MUL_9[a1] ^ MUL_E[a2] ^ MUL_B[a3];
            state[i3] = MUL_B[a0] ^ MUL_D[a1] ^ MUL_9[a2] ^ MUL_E[a3];
        }
    }

    var t = state[13]; state[13] = state[9]; state[9] = state[5]; state[5] = state[1]; state[1] = t;
    t = state[2]; state[2] = state[10]; state[10] = t; t = state[6]; state[6] = state[14]; state[14] = t;
    t = state[3]; state[3] = state[7]; state[7] = state[11]; state[11] = state[15]; state[15] = t;

    for (var i = 0; i < 16; i++) state[i] = INV_SBOX[state[i]];

    for (var i = 0; i < 4; i++) {
        var rk = roundKeys[i];
        state[i * 4 + 0] ^= (rk >>> 24) & 0xff;
        state[i * 4 + 1] ^= (rk >> 16) & 0xff;
        state[i * 4 + 2] ^= (rk >> 8) & 0xff;
        state[i * 4 + 3] ^= rk & 0xff;
    }

    return state;
}

var AES_KEY = "T5Vv41K5zJBHhtODBnOTdrl3shZVEPqzb16Hzfuh4J5tWrb0";

function encryptAES(plainText, password) {
    if (!plainText && plainText !== 0) return "";
    password = password || AES_KEY;

    try {
        var passBytes = stringToUtf8Bytes(password + "");
        var plainBytes = stringToUtf8Bytes(plainText + "");

        var salt = [];
        for (var i = 0; i < 8; i++) {
            salt.push(Math.floor(Math.random() * 256));
        }

        var derived = evpBytesToKey(passBytes, salt, 32, 16);
        var roundKeys = keyExpansion(derived.key);

        var padLen = 16 - (plainBytes.length % 16);
        var padded = plainBytes.slice(0);
        for (var i = 0; i < padLen; i++) padded.push(padLen);

        var cipherBytes = [];
        var prev = derived.iv.slice(0);
        for (var i = 0; i < padded.length; i += 16) {
            var block = padded.slice(i, i + 16);
            for (var b = 0; b < 16; b++) block[b] ^= prev[b];
            var enc = cipherBlockFast(block, roundKeys);
            for (var b = 0; b < 16; b++) cipherBytes.push(enc[b]);
            prev = enc;
        }

        var prefix = [0x53, 0x61, 0x6c, 0x74, 0x65, 0x64, 0x5f, 0x5f];
        var full = prefix.concat(salt).concat(cipherBytes);
        return base64Encode(full);
    } catch (e) {
        return "";
    }
}

function decryptAES(cipherBase64, password) {
    if (!cipherBase64) return "";
    password = password || AES_KEY;

    try {
        var fullBytes = base64Decode(cipherBase64 + "");
        if (fullBytes.length < 16) return "";

        var salt = [];
        var cipherBytes = [];
        if (fullBytes[0] === 0x53 && fullBytes[1] === 0x61 && fullBytes[2] === 0x6c && fullBytes[3] === 0x74 &&
            fullBytes[4] === 0x65 && fullBytes[5] === 0x64 && fullBytes[6] === 0x5f && fullBytes[7] === 0x5f) {
            salt = fullBytes.slice(8, 16);
            cipherBytes = fullBytes.slice(16);
        } else {
            cipherBytes = fullBytes;
        }

        var passBytes = stringToUtf8Bytes(password + "");
        var derived = evpBytesToKey(passBytes, salt, 32, 16);
        var roundKeys = keyExpansion(derived.key);

        var plainBytes = [];
        var prev = derived.iv.slice(0);
        for (var i = 0; i < cipherBytes.length; i += 16) {
            var block = cipherBytes.slice(i, i + 16);
            if (block.length < 16) break;
            var dec = invCipherBlockFast(block, roundKeys);
            for (var b = 0; b < 16; b++) {
                plainBytes.push(dec[b] ^ prev[b]);
            }
            prev = block;
        }

        if (plainBytes.length === 0) return "";
        var padVal = plainBytes[plainBytes.length - 1];
        if (padVal > 0 && padVal <= 16 && padVal <= plainBytes.length) {
            var valid = true;
            for (var i = plainBytes.length - padVal; i < plainBytes.length; i++) {
                if (plainBytes[i] !== padVal) { valid = false; break; }
            }
            if (valid) {
                plainBytes = plainBytes.slice(0, plainBytes.length - padVal);
            }
        }

        return utf8BytesToString(plainBytes);
    } catch (e) {
        return "";
    }
}
