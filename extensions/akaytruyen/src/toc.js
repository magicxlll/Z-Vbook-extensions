// toc.js — Mục lục chương
// Contract: execute(url) → [{ name, url, host, pay? }]
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var chapters = [];
    var seen = {};

    doc.select("a[href*='/chuong-']").forEach(function (el) {
        var name = el.text().replace(/\s+/g, " ").trim() + "";
        
        // Loại bỏ phần thông tin ngày đăng phía trước ví dụ "23 T2 "
        name = name.replace(/^\d+\s+T\d+\s+/, "").trim();
        
        var chapUrl = (el.attr("href") || "") + "";

        if (!name || !chapUrl) return;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        if (chapUrl.indexOf("http") !== 0) {
            chapUrl = chapUrl.indexOf("/") === 0 ? BASE_URL + chapUrl : BASE_URL + "/" + chapUrl;
        }

        chapters.push({
            name: name,
            url: chapUrl,
            host: BASE_URL
        });
    });

    if (chapters.length === 0) return Response.error("No chapters found");
    
    // Đảo ngược mảng vì AkayTruyen để chương mới nhất lên đầu tiên
    chapters.reverse();
    
    return Response.success(chapters);
}
