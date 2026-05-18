// gen.js — Parser danh sách truyện theo danh mục và phân trang
// Contract: execute(url, page) → [{ name, link, cover, host, description }], nextPage
load("config.js");

function execute(url, page) {
    page = page !== undefined ? page : "1";

    var fetchUrl = url;
    if (page !== "1") {
        fetchUrl = url + (url.indexOf("?") > -1 ? "&" : "?") + "tranghientai=" + page;
    }

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var list = [];
    var seen = {};

    doc.select("span.viethoachu a[href*='truyen.aspx?tid=']").forEach(function (el) {
        var name = el.text().trim() + "";
        var link = (el.attr("href") || "") + "";

        if (!name || !link) return;
        if (seen[link]) return;
        seen[link] = true;

        if (link.indexOf("http") !== 0) {
            link = link.indexOf("/") === 0 ? BASE_URL + link : BASE_URL + "/" + link;
        }

        var cover = BASE_URL + "/favicon.ico"; // placeholder

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    // Quyết định trang tiếp theo
    var nextPage = null;
    // Nếu trang hiện tại có đủ 20 truyện (đặc trưng số truyện tối đa/trang của vietnamthuquan), cho phép tải trang tiếp theo
    if (list.length >= 20) {
        nextPage = String(parseInt(page) + 1);
    }

    return Response.success(list, nextPage);
}
