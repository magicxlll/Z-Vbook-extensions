load("config.js");

function execute(url) {
    var tocUrl = url;
    if (tocUrl.indexOf("/muc-luc") === -1) {
        tocUrl = tocUrl.replace(/\/+$/, "") + "/muc-luc";
    }

    var response = fetchBook(tocUrl);
    if (!response.ok) {
        response = fetchBook(url);
        if (!response.ok) return Response.error("Cannot load: " + response.status);
    }

    var doc = response.html();
    var chapters = [];

    doc.select("a[href*='/truyen/']").forEach(function(el) {
        var href = (el.attr("href") || "") + "";
        var cName = (el.text() || "").trim();
        if (cName && (href.indexOf("/chuong-") !== -1 || href.indexOf("/c-") !== -1)) {
            var cUrl = href.indexOf("http") === 0 ? href : BASE_URL + href;
            chapters.push({
                name: cName,
                url: cUrl,
                host: BASE_URL
            });
        }
    });

    return Response.success(chapters);
}