load("config.js");

function execute(key, page) {
    try {
        if (!key) return Response.success([]);
        var pageNum = parseInt(page, 10) || 1;
        var list = [];
        var seen = {};

        // TẦNG 1: REST API chính xác 100% cho taxonomy bộ truyện
        try {
            var apiUrl = BASE_URL + "/wp-json/wp/v2/bo_truyen?search=" + encodeURIComponent(key) + "&page=" + pageNum + "&per_page=20";
            var items = fetchJson(apiUrl);

            if (Array.isArray(items) && items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var bookUrl = cleanUrl(item.link);
                    if (!bookUrl || seen[bookUrl]) continue;
                    seen[bookUrl] = true;

                    var bookName = (item.name || "").trim();
                    var bookDesc = (item.description || "").trim();

                    // Tìm cover nếu có trong yoast_head
                    var bookCover = DEFAULT_COVER;
                    if (item.yoast_head) {
                        var ogImgMatch = item.yoast_head.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
                        if (ogImgMatch && ogImgMatch[1]) {
                            bookCover = resolveCover(ogImgMatch[1]);
                        }
                    }

                    list.push({
                        name: bookName,
                        link: bookUrl,
                        cover: bookCover,
                        description: bookDesc,
                        host: BASE_URL
                    });
                }

                if (list.length > 0) {
                    var next = (items.length >= 20) ? String(pageNum + 1) : null;
                    return Response.success(list, next);
                }
            }
        } catch (errApi) {}

        // TẦNG 2: Fallback cào HTML từ trang tìm kiếm WordPress
        var searchUrl = BASE_URL + "/?s=" + encodeURIComponent(key);
        if (pageNum > 1) {
            searchUrl += "&paged=" + pageNum;
        }

        var res = fetchBook(searchUrl);
        if (res && res.status === 200) {
            var html = res.text();
            var doc = Html.parse(html);
            var articles = doc.select("article");

            for (var j = 0; j < articles.size(); j++) {
                var art = articles.get(j);
                var className = art.attr("class") || "";

                // Tìm slug bộ truyện từ class bo_truyen-{slug}
                var boTruyenMatch = className.match(/bo_truyen-([a-zA-Z0-9_-]+)/);
                var slug = boTruyenMatch ? boTruyenMatch[1] : null;

                var bookUrl = slug ? (BASE_URL + "/truyen/" + slug + "/") : null;
                var catLink = art.select("li.meta-categories a").first();
                var bookName = catLink ? catLink.text().trim() : "";

                if (!bookUrl) {
                    var titleEl = art.select("h2.entry-title a").first() || art.select("a").first();
                    if (titleEl) {
                        bookUrl = cleanUrl(titleEl.attr("href"));
                        if (!bookName) bookName = titleEl.text().trim();
                    }
                }

                if (!bookUrl || !bookName || seen[bookUrl]) continue;
                seen[bookUrl] = true;

                var imgEl = art.select("img").first();
                var cover = DEFAULT_COVER;
                if (imgEl) {
                    var rawCover = imgEl.attr("data-src") || imgEl.attr("src") || "";
                    cover = resolveCover(rawCover);
                }

                var excerptEl = art.select(".entry-excerpt").first();
                var desc = excerptEl ? excerptEl.text().trim() : "";

                list.push({
                    name: bookName,
                    link: bookUrl,
                    cover: cover,
                    description: desc,
                    host: BASE_URL
                });
            }

            var nextHtml = null;
            var nextBtn = doc.select("nav.ct-pagination a.next").first();
            if (nextBtn) {
                nextHtml = String(pageNum + 1);
            }

            if (list.length > 0) {
                return Response.success(list, nextHtml);
            }
        }

        return Response.success([]);
    } catch (e) {
        return Response.error("Lỗi khi tìm kiếm: " + (e.message || e));
    }
}
