load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@
]+@)?(?:www.)?([^:/
?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    var name = (doc.select("h1").first() ? doc.select("h1").first().text() : "").trim();
    
    var cover = "";
    var coverEl = doc.select("meta[property='og:image']").first();
    if (coverEl) cover = (coverEl.attr("content") || "") + "";
    if (!cover) {
        var img = doc.select("img[src*='/media/covers/'], img[src*='/_next/image']").first();
        if (img) cover = (img.attr("src") || img.attr("srcset") || "") + "";
    }

    var author = (doc.select("a[href^='/tac-gia/']").first() ? doc.select("a[href^='/tac-gia/']").first().text() : "").trim();
    var description = (doc.select(".description, .summary, [class*='desc']").first() ? doc.select(".description, .summary, [class*='desc']").first().text() : "").trim();

    var genres = [];
    doc.select("a[href^='/the-loai/']").forEach(function (el) {
        var gText = (el.text() || "").trim();
        if (gText && genres.indexOf(gText) === -1) genres.push(gText);
    });

    return Response.success({
        name: name || "Storya Novel",
        cover: fixCover(cover),
        host: BASE_URL,
        author: author || "Khuyết Danh",
        description: description,
        ongoing: true,
        genres: genres
    });
}