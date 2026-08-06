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
    var coverEl = doc.select("img[src*='/media/covers/'], img[src*='/covers/'], meta[property='og:image']").first();
    if (coverEl) {
        cover = (coverEl.attr("src") || coverEl.attr("content") || "") + "";
    }

    var author = (doc.select("a[href^='/tac-gia/']").first() ? doc.select("a[href^='/tac-gia/']").first().text() : "").trim();
    var description = (doc.select(".description, .summary, [class*='desc']").first() ? doc.select(".description, .summary, [class*='desc']").first().text() : "").trim();

    return Response.success({
        name: name || "Storya Novel",
        cover: cover,
        host: BASE_URL,
        author: author || "Khuyết Danh",
        description: description,
        ongoing: true
    });
}