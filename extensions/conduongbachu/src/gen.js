load("config.js");

function execute(url, page) {
    page = page !== undefined ? page : "1";

    if (url.indexOf("/chuong-") > -1) {
        return Response.success([
            {
                name: "Con Đường Bá Chủ",
                link: url,
                cover: "https://conduongbachu.com/wp-content/uploads/2024/12/20355-con-duong-ba-chu_cover_large.webp",
                description: "Truyện Con Đường Bá Chủ của tác giả Akay Hậu thuộc thể loại tiên hiệp, kiếm hiệp...",
                host: BASE_URL
            }
        ], null);
    }

    var fetchUrl = url;
    if (page !== "1") {
        var cleanUrl = url.replace(/\/$/, "");
        fetchUrl = cleanUrl + "/page/" + page + "/";
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

    var nextPage = null;
    var nextEl = doc.select(".nav-pagination a.next").first();
    if (nextEl) {
        nextPage = String(parseInt(page) + 1);
    }

    return Response.success(list, nextPage);
}
