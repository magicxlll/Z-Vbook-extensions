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

    doc.select("li.menutruyen a[href*='truyen.aspx?tid=']").forEach(function (el) {
        var name = el.text().trim() + "";
        var link = (el.attr("href") || "") + "";
        var cover = ""; // VietnamThuQuan doesn't have covers

        if (!name || !link) return;
        if (link.indexOf("http") !== 0) {
            link = link.indexOf("/") === 0 ? BASE_URL + link : BASE_URL + "/" + link;
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
    var nextEl = doc.select(".pagination li.active + li a").first();
    if (nextEl) {
        nextPage = String(parseInt(page) + 1);
    }

    return Response.success(list, nextPage);
}
