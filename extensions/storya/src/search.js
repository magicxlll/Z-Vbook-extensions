load("config.js");

function execute(key, page) {
    page = page || "1";
    var fetchUrl = BASE_URL + "/tim-kiem?q=" + encodeURIComponent(key);

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
        if (img) cover = (img.attr("src") || img.attr("data-src") || "") + "";

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    return Response.success(list);
}