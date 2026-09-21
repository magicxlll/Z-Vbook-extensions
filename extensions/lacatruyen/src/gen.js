load("config.js");

function execute(url, page) {
    page = page || "1";
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var fetchUrl = url;
    if (fetchUrl.indexOf("page=") === -1) {
        fetchUrl += (fetchUrl.indexOf("?") > -1 ? "&" : "?") + "page=" + page;
    }

    var res = fetchBook(fetchUrl);
    if (!res || !res.ok) return Response.error("Không thể tải danh sách truyện");

    var html = res.text();
    var nextData = extractNextData(html);

    if (nextData && nextData.props && nextData.props.pageProps) {
        var p = nextData.props.pageProps;
        var stories = p.initialStories || p.stories || [];
        var totalCount = p.initialCount || 0;
        var items = parseStories(stories);

        var currentPage = parseInt(page, 10) || 1;
        var nextPage = null;
        if (totalCount > 0) {
            if (currentPage * 20 < totalCount) {
                nextPage = (currentPage + 1) + "";
            }
        } else if (items.length >= 20) {
            nextPage = (currentPage + 1) + "";
        }

        return Response.success(items, nextPage);
    }

    // Fallback: DOM parsing
    var doc = Html.parse(html);
    var items = [];
    doc.select("a[href*='/story/']").forEach(function (el) {
        var href = el.attr("href") || "";
        var m = href.match(/\/story\/([^\/\?]+)/);
        if (!m) return;
        var slug = m[1];
        var title = el.select("h3, h2, h4, .title").text() || el.attr("title") || el.text();
        title = (title + "").trim();
        if (!title) return;

        var imgEl = el.select("img").first();
        var img = imgEl ? (imgEl.attr("src") || imgEl.attr("data-src") || "") : "";
        var cover = resolveCover(img, title, slug);

        items.push({
            name: title,
            link: BASE_URL + "/story/" + slug,
            cover: cover,
            description: "",
            host: BASE_URL
        });
    });

    var nextPage = items.length >= 20 ? (parseInt(page, 10) + 1) + "" : null;
    return Response.success(items, nextPage);
}
