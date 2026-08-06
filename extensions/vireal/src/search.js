load("config.js");

function execute(key, page) {
    page = page || "1";
    var fetchUrl = BASE_URL + "/search?q=" + encodeURIComponent(key);

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var list = [];
    var seen = {};

    var storyRegex = /\"slug\":\"([^\"]+)\"[\s\S]*?\"name\":\"([^\"]+)\"[\s\S]*?\"thumbnail\":\"([^\"]+)\"/g;
    var m;
    while ((m = storyRegex.exec(html)) !== null) {
        var slug = m[1];
        var name = m[2];
        var cover = m[3];
        var link = BASE_URL + "/story/" + slug;
        if (slug && name && !seen[link]) {
            seen[link] = true;
            list.push({
                name: name,
                link: link,
                cover: cover,
                host: BASE_URL
            });
        }
    }

    if (list.length === 0) {
        var doc = res.html();
        doc.select("a[href^='/story/']").forEach(function (el) {
            var href = (el.attr("href") || "") + "";
            if (!href || href === "/story/") return;
            var link = href.indexOf("http") === 0 ? href : BASE_URL + href;
            if (seen[link]) return;
            seen[link] = true;

            var name = (el.select("h3, h2").text() || el.text() || "").trim();
            var img = el.select("img").first();
            var cover = "";
            if (img) cover = (img.attr("src") || img.attr("data-src") || "") + "";
            if (!name && img) name = (img.attr("alt") || "").trim();
            if (!name) return;

            list.push({
                name: name,
                link: link,
                cover: cover,
                host: BASE_URL
            });
        });
    }

    return Response.success(list);
}