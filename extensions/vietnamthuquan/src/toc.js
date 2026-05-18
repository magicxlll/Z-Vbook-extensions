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

    doc.select("li[onclick*='noidung1']").forEach(function (el) {
        var name = el.select("a").text().trim() + "";
        var onclickText = el.attr("onclick") + "";
        
        var match = onclickText.match(/noidung1\('([^']+)'\)/);
        if (!match) return;
        var query = match[1].replace(/&amp;/g, "&"); // Clean up HTML entities
        
        var chapUrl = BASE_URL + "/truyen/chuonghoi_moi.aspx?" + query;

        if (!name || !chapUrl) return;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        chapters.push({
            name: name,
            url: chapUrl,
            host: BASE_URL
        });
    });

    if (chapters.length === 0) return Response.error("No chapters found");
    return Response.success(chapters);
}
