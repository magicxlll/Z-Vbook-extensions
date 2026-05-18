// detail.js — Thông tin chi tiết truyện
// Contract: execute(url) → { name, cover, host, author, description, ongoing, genres?, suggests? }
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    // Tên truyện
    var nameEl = doc.select("h1").first();
    var name = (nameEl ? nameEl.text() : "") + "";

    // Ảnh bìa
    var coverEl = doc.select("__og_image__").first();
    var cover = "";
    if (coverEl) {
        cover = (coverEl.attr("data-src") || coverEl.attr("src") || "") + "";
        if (cover.indexOf("//") === 0) cover = "https:" + cover;
        if (cover && cover.indexOf("http") !== 0) cover = BASE_URL + cover;
    }

    // Tác giả
    var authorEl = doc.select("[itemprop='author']").first();
    var author = (authorEl ? authorEl.text() : "") + "";

    // Trạng thái
    var statusEl = doc.select(".info div:contains('Trạng thái')").first();
    var status = (statusEl ? statusEl.text() : "") + "";
    var ongoing = status.indexOf("Hoàn") === -1
        && status.indexOf("Completed") === -1
        && status.indexOf("Full") === -1
        && status.indexOf("完结") === -1;

    // Mô tả
    var descEl = doc.select(".desc-text").first();
    var description = (descEl ? descEl.html() : "") + "";

    // Thể loại
    var genres = [];
    doc.select(".info a[href*='the-loai']").forEach(function (el) {
        var gTitle = el.text() + "";
        var gHref = (el.attr("href") || "") + "";
        if (!gTitle || !gHref) return;
        if (gHref.indexOf("http") !== 0) gHref = BASE_URL + gHref;
        genres.push({ title: gTitle, input: gHref, script: "gen.js" });
    });

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: ongoing,
        genres: genres.length > 0 ? genres : undefined
    });
}
