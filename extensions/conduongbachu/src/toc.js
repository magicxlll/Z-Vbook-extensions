load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    var fetchUrl = url;
    if (fetchUrl === BASE_URL || fetchUrl === BASE_URL + "/" || fetchUrl.indexOf("/chuong-") === -1) {
        fetchUrl = BASE_URL + "/chuong-3752-ket-thuc-se-la-noi-bat-dau/";
    }

    var res = fetchBook(fetchUrl);
    if (!res.ok) {
        res = fetchBook(BASE_URL + "/chapter-truyen/");
    }
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var chapters = [];
    var seen = {};

    doc.select("select.chapter-selector option, select option").forEach(function (el) {
        var name = el.text().trim() + "";
        var chapUrl = (el.attr("value") || el.attr("href") || "") + "";

        if (!name || !chapUrl || chapUrl.indexOf("http") !== 0 || name.indexOf("--") === 0) return;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        chapters.push({
            name: name,
            url: chapUrl,
            host: BASE_URL
        });
    });

    if (chapters.length === 0) {
        doc.select("h2.entry-title a, article.post a").forEach(function (el) {
            var name = el.text().trim() + "";
            var chapUrl = (el.attr("href") || "") + "";

            if (!name || !chapUrl) return;
            if (chapUrl.indexOf("http") !== 0) {
                chapUrl = chapUrl.indexOf("/") === 0 ? BASE_URL + chapUrl : BASE_URL + "/" + chapUrl;
            }
            if (seen[chapUrl]) return;
            seen[chapUrl] = true;

            chapters.push({
                name: name,
                url: chapUrl,
                host: BASE_URL
            });
        });
    }

    if (chapters.length === 0) return Response.error("Không tìm thấy mục lục chương");
    return Response.success(chapters);
}
