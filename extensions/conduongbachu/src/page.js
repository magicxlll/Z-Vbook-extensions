// page.js — Phân trang mục lục
// Contract: execute(url) → [urlString, ...]
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    
    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var pages = [url];

    doc.select(".nav-pagination a").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        if (!href || href.indexOf("#") > -1) return;
        if (href.indexOf("http") !== 0) {
            href = href.indexOf("/") === 0 ? BASE_URL + href : BASE_URL + "/" + href;
        }
        if (pages.indexOf(href) === -1) pages.push(href);
    });

    return Response.success(pages);
    
    
}
