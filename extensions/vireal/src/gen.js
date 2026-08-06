load("config.js");

function execute(url, page) {
    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var list = [];
    var seen = {};

    var blocks = html.split(/\{\"id\":\"/);
    for (var i = 1; i < blocks.length; i++) {
        var block = blocks[i];
        var mSlug = block.match(/\"slug\":\"([^\"]+)\"/);
        var mName = block.match(/\"name\":\"([^\"]+)\"/);
        var mThumb = block.match(/\"thumbnail\":\"([^\"]+)\"/);

        if (mSlug && mName) {
            var slug = mSlug[1];
            var name = mName[1];
            var cover = mThumb ? mThumb[1] : "";
            var link = BASE_URL + "/story/" + slug;

            if (!seen[link]) {
                seen[link] = true;
                list.push({
                    name: name,
                    link: link,
                    cover: cover,
                    host: BASE_URL
                });
            }
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