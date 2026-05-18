// search.js — Tìm kiếm truyện
// Contract: execute(key, page) → [{ name, link, cover, host }], nextPage
load("config.js");

function execute(key, page) {
    // VietnamThuQuan là website cũ, tìm kiếm qua AJAX POST
    var searchUrl = BASE_URL + "/truyen/timkiem_trangchinh.aspx";
    
    // Tạo tham số POST
    var body = "theo=tua&chu=" + encodeURIComponent(key);
    
    var res = fetchBook(searchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });
    
    if (!res.ok) return Response.error("Cannot search: " + res.status);

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

        // Tạo ảnh đại diện giả lập (Favicon hoặc ảnh chung) do web không trả về ảnh trong danh sách tìm kiếm
        var cover = BASE_URL + "/favicon.ico";

        list.push({
            name: name,
            link: link,
            cover: cover,
            host: BASE_URL
        });
    });

    // Web trả về toàn bộ kết quả trên một trang duy nhất, không có phân trang
    return Response.success(list, null);
}
