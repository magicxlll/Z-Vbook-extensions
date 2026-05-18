// gen.js — Parser danh sách truyện
// Contract: execute(url, page) → [{ name, link, cover, host, description }], nextPage
load("config.js");

function execute(url, page) {
    page = page !== undefined ? page : "1";

    // Nếu URL là link phân trang, thêm page param
    var fetchUrl = url;
    if (page !== "1") {
        fetchUrl = url + (url.indexOf("?") > -1 ? "&" : "?") + "page=" + page;
    }

    var res = fetch(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var list = [];

    var containers = doc.select(".story-item");
    if (containers.size() === 0) {
        containers = doc.select(".list-truyen .row");
    }

    containers.forEach(function (el) {
        var name = (el.select(".story-name").text() || el.select("h3 a").text() || el.select("h3").text() || "") + "";
        var link = (el.select("a").first().attr("href") || el.select("h3 a").attr("href") || "") + "";
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

    // Kiểm tra trang tiếp theo
    var nextPage = null;
    var nextEl = doc.select(".pagination li.active + li a").first() || doc.select(".pagination-btn.pagination-active + .pagination-btn").first();
    if (nextEl) {
        nextPage = String(parseInt(page) + 1);
    }

    return Response.success(list, nextPage);
}
