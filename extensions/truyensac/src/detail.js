load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res || !res.ok) return Response.error("Không thể tải thông tin truyện");

    var doc = res.html();
    var slugMatch = url.match(/\/truyen\/([^\/\?]+)/);
    var slug = slugMatch ? slugMatch[1] : "";

    // Tên truyện
    var nameEl = doc.select("h1").first();
    var name = (nameEl ? nameEl.text() : "").trim();

    // Ảnh bìa chính xác
    var cover = "";
    var imgEl = doc.select("img[itemprop='image']").first();
    if (imgEl) {
        cover = imgEl.attr("src") || imgEl.attr("data-src") || "";
    }
    if (!cover || cover.indexOf("logo.webp") > -1 || cover.indexOf("no-image.webp") > -1) {
        var ogEl = doc.select("meta[property='og:image']").first();
        var ogVal = ogEl ? ogEl.attr("content") : "";
        if (ogVal && ogVal.indexOf("logo.webp") === -1 && ogVal.indexOf("no-image.webp") === -1) {
            cover = ogVal;
        }
    }
    cover = resolveCover(cover, slug);

    // Tác giả
    var author = "";
    var authorEl = doc.select("a[href*='/tac-gia/']").first();
    if (authorEl) {
        author = authorEl.text().trim();
    }
    if (!author) {
        var docText = doc.text() || "";
        var mAuth = docText.match(/tác giả\s+([^\.]+?)\./i);
        if (mAuth) author = mAuth[1].trim();
    }
    if (!author) author = "Khuyết Danh";

    // Trạng thái
    var fullText = doc.text() || "";
    var ongoing = fullText.indexOf("Đã hoàn thành") === -1
        && fullText.indexOf("hoàn thành (full)") === -1
        && fullText.indexOf("Completed") === -1
        && fullText.indexOf("Full") === -1;

    // Mô tả
    var descEl = doc.select("meta[name='description']").first();
    var description = descEl ? (descEl.attr("content") || "") : "";
    if (!description) {
        description = "Đọc truyện " + name + " của tác giả " + author + " tại TruyenSac.";
    }

    // Thể loại
    var genres = [];
    doc.select("a[href*='/the-loai/']").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        var gTitle = (el.text() || "").trim();
        var parts = href.split("/the-loai/");
        var gSlug = parts.length > 1 ? parts[1].split("/")[0].split("?")[0] : "";
        if (gSlug && gSlug !== "tat-ca" && gTitle) {
            genres.push({
                title: gTitle,
                input: API_URL + "/novels?genreSlug=" + encodeURIComponent(gSlug),
                script: "gen.js"
            });
        }
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
