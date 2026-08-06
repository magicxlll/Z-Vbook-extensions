load("config.js");

function execute(url, page) {
    page = page || "1";
    var fetchUrl = url;
    if (page !== "1") {
        fetchUrl += "?page=" + page;
    }

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var list = [];
    var seen = {};

    doc.select("a[href^='/truyen/']").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        if (!href || href === "/truyen/") return;
        var parts = href.split("/");
        var slug = parts[parts.length - 1] || parts[parts.length - 2];
        if (!slug) return;

        var link = BASE_URL + "/truyen/" + slug;

        var titleEl = el.select("h2, h3, h4, .font-bold").first();
        var name = (titleEl ? titleEl.text() : el.text() || "").trim();

        if (name === "Full" || name === "Hot" || name === "HotFull" || name === "HOT" || name === "FULL") {
            name = "";
        }

        if (!name) return;
        if (seen[link]) return;
        seen[link] = true;

        var cover = BASE_URL + "/media/covers/" + slug + ".jpg";

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    var nextPage = null;
    var nextBtn = doc.select("a[href*='page=']").last();
    if (nextBtn) nextPage = String(parseInt(page, 10) + 1);

    return Response.success(list, nextPage);
}