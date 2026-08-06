load("config.js");

function execute(key, page) {
    page = page !== undefined ? page : "1";
    var fetchUrl = BASE_URL + "/?s=" + encodeURIComponent(key);
    if (page !== "1") {
        fetchUrl += "&paged=" + page;
    }

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var list = [];

    doc.select("article.post").forEach(function (el) {
        var name = el.select("h2.entry-title a").text().trim() + "";
        var link = (el.select("h2.entry-title a").attr("href") || "") + "";
        var cover = "https://conduongbachu.com/wp-content/uploads/2024/12/20355-con-duong-ba-chu_cover_large.webp";

        if (!name || !link) return;
        if (link.indexOf("http") !== 0) link = BASE_URL + (link.indexOf("/") === 0 ? link : "/" + link);

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    return Response.success(list);
}
