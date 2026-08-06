load("config.js");

function execute(url) {
    url = url.replace(/^https?:\/\/[^\/]+/, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    var name = (doc.select("meta[property='og:title']").attr("content") || doc.select("h1").text() || "").trim();
    name = name.replace(/\s*\[Tới Chương.*$/i, "").trim();

    var parts = url.split("/");
    var slug = parts[parts.length - 1] || parts[parts.length - 2];
    var cover = BASE_URL + "/media/covers/" + slug + ".jpg";

    var author = (doc.select("meta[name='author']").attr("content") || doc.select("a[href^='/tac-gia/']").text() || "").trim();
    var description = (doc.select("meta[name='description']").attr("content") || doc.select(".description, .summary").text() || "").trim();

    return Response.success({
        name: name || "Storya Novel",
        cover: cover,
        host: BASE_URL,
        author: author || "Khuyết Danh",
        description: description,
        ongoing: true
    });
}