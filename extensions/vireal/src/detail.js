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
    var coverEl = doc.select("img[src*='/uploads/images/'], meta[property='og:image']").first();
    if (coverEl) {
        cover = (coverEl.attr("src") || coverEl.attr("content") || "") + "";
    }

    var author = (doc.select("a[href^='/user/']").first() ? doc.select("a[href^='/user/']").first().text() : "").trim();
    var description = (doc.select(".description, .storyQuote, [class*='info']").first() ? doc.select(".description, .storyQuote, [class*='info']").first().text() : "").trim();

    return Response.success({
        name: name || "Vireal Story",
        cover: cover,
        host: BASE_URL,
        author: author || "Vireal Author",
        description: description,
        ongoing: true
    });
}