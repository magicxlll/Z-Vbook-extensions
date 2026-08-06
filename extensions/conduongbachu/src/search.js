// search.js — Tìm kiếm truyện
// Contract: execute(key, page) → [{ name, link, cover, host }], nextPage
load("config.js");

function execute(key, page) {
    page = page !== undefined ? page : "1";

    var searchUrl = BASE_URL + "/tim-kiem/?tukhoa=" + encodeURIComponent(key);
    if (page !== "1") {
        searchUrl = searchUrl + "&page=" + page;
    }

    var res = fetchBook(searchUrl);
    if (!res.ok) return Response.error("Cannot search: " + res.status);

    var doc = res.html();
    var list = [];

    doc.select("article.post").forEach(function (el) {
        var name = el.select("h2.entry-title a").text() + "";
        var link = (el.select("h2.entry-title a").attr("href") || "") + "";
        var cover = (el.select("img").attr("src") || el.select("img").attr("data-src") || "") + "";

        if (!name || !link) return;
        if (link.indexOf("http") !== 0) {
            link = link.indexOf("/") === 0 ? BASE_URL + link : BASE_URL + "/" + link;
        }
        if (cover && cover.indexOf("http") !== 0) {
            if (cover.indexOf("//") === 0) cover = "https:" + cover;
            else cover = BASE_URL + cover;
        }

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
