load("config.js");

function extractChapterNumber(name) {
    var m = (name + "").match(/(?:chương|chap|chapter|\b)\s*(\d+)/i);
    return m ? parseInt(m[1], 10) : 0;
}

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var chapters = [];
    var seen = {};

    doc.select("a[href*='/chuong-'], a[href*='/chapter-']").forEach(function (el) {
        var name = (el.text() || "").trim();
        var href = (el.attr("href") || "") + "";

        if (!name || !href) return;
        var chapUrl = href.indexOf("http") === 0 ? href : BASE_URL + href;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        chapters.push({
            name: name,
            url: chapUrl,
            host: BASE_URL,
            num: extractChapterNumber(name)
        });
    });

    chapters.sort(function (a, b) {
        if (a.num !== 0 && b.num !== 0) return a.num - b.num;
        return 0;
    });

    var cleanChapters = chapters.map(function (c) {
        return { name: c.name, url: c.url, host: c.host };
    });

    return Response.success(cleanChapters);
}