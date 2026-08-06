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

    doc.select("a[href^='/truyen/']").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        if (!href || href === "/truyen/") return;
        var name = (el.select("h3, h2").text() || el.text() || "").trim();
        if (!name) return;

        var link = href.indexOf("http") === 0 ? href : BASE_URL + href;
        var cover = "";
        var img = el.select("img").first();
        if (img) cover = (img.attr("src") || img.attr("srcset") || img.attr("data-src") || "") + "";

        list.push({
            name: name,
            link: link,
            cover: fixCover(cover),
            host: BASE_URL
        });
    });

    var nextPage = null;
    var nextBtn = doc.select("a[href*='page=']").last();
    if (nextBtn) nextPage = String(parseInt(page) + 1);

    return Response.success(list, nextPage);
}