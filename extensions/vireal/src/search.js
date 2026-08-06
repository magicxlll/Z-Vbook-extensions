load("config.js");

function execute(key, page) {
    page = page || "1";
    var fetchUrl = BASE_URL + "/search?q=" + encodeURIComponent(key);

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var list = [];

    doc.select("a[href^='/story/']").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        if (!href || href === "/story/") return;

        var name = (el.select("h3, h2").text() || el.text() || "").trim();
        var img = el.select("img").first();
        var cover = "";
        if (img) cover = (img.attr("src") || img.attr("data-src") || "") + "";

        if (!name && img) name = (img.attr("alt") || "").trim();
        if (!name) return;

        var link = href.indexOf("http") === 0 ? href : BASE_URL + href;

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    return Response.success(list);
}