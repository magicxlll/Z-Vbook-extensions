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

    doc.select(".list-chapter li a").forEach(function (el) {
        var name = el.text().trim() + "";
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
    return Response.success(chapters);
}
