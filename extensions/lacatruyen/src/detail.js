load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res || !res.ok) return Response.error("Không thể tải thông tin truyện");

    var html = res.text();
    var nextData = extractNextData(html);

    if (nextData && nextData.props && nextData.props.pageProps) {
        var p = nextData.props.pageProps;
        var s = p.story || {};
        var name = (s.title || s.story_title || "").trim();
        var slug = (s.slug || p.slug || "").trim();
        var cover = resolveCover(s.image || s.story_image, name, slug);
        var author = (s.pen_name_user || s.name_user || s.author || "Khuyết Danh").trim();
        var description = (s.detail || s.description || "").trim();
        var ongoing = s.status !== "completed" && s.status !== "full";

        var genres = [];
        if (p.categories && Array.isArray(p.categories)) {
            p.categories.forEach(function (c) {
                var cTitle = (c.category_title || c.title || "").trim();
                var cSlug = (c.category_slug || c.slug || "").trim();
                if (cTitle && cSlug) {
                    genres.push({
                        title: cTitle,
                        input: BASE_URL + "/category/" + cSlug,
                        script: "gen.js"
                    });
                }
            });
        }

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

    // Fallback: DOM parsing
    var doc = Html.parse(html);
    var name = (doc.select("h1").text() || "").trim();
    var slugMatch = url.match(/\/story\/([^\/\?]+)/);
    var slug = slugMatch ? slugMatch[1] : "";

    var imgEl = doc.select("img[alt*='" + name + "']").first() || doc.select("img").first();
    var img = imgEl ? (imgEl.attr("src") || imgEl.attr("data-src") || "") : "";
    var cover = resolveCover(img, name, slug);

    var authorEl = doc.select("a[href*='/tac-gia/'], a[href*='/user/profile/']").first();
    var author = authorEl ? authorEl.text().trim() : "Khuyết Danh";

    var descEl = doc.select("meta[name='description']").first();
    var description = descEl ? (descEl.attr("content") || "") : "";

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: true
    });
}
