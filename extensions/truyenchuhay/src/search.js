load("config.js");

function execute(key, page) {
    try {
        page = page || "1";
        var fullUrl = BASE_URL + "/tim-kiem?tukhoa=" + encodeURIComponent(key);
        if (parseInt(page, 10) > 1) {
            fullUrl += "&page=" + page;
        }

        var res = fetchBook(fullUrl);
        if (!res || !res.ok) {
            return Response.error("Không thể kết nối tìm kiếm: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var doc = Html.parse(html);

        var bookElements = doc.select("div[itemscope][itemtype*='Book'], .grid.grid-cols-12[itemscope]");
        var bookList = [];
        var seenLinks = {};

        for (var i = 0; i < bookElements.size(); i++) {
            var el = bookElements.get(i);

            var titleEl = el.select("h3[itemprop='name'] a").first()
                || el.select("a.font-bold").first()
                || el.select("h3 a").first();

            if (!titleEl) continue;

            var name = titleEl.text().trim();
            var link = titleEl.attr("href");
            if (!link || !name) continue;

            link = cleanUrl(link);
            if (seenLinks[link]) continue;
            seenLinks[link] = true;

            var storySlug = link.replace(/^https?:\/\/[^\/]+\//i, "").replace(/[\/\?#].*$/, "");

            var imgEl = el.select("img").first();
            var rawCover = imgEl ? (imgEl.attr("src") || imgEl.attr("data-src")) : "";
            var cover = resolveCover(rawCover, storySlug);

            var authorEl = el.select("div[itemprop='author'] span[itemprop='name']").first()
                || el.select("span:has(svg)").first();
            var author = authorEl ? authorEl.text().trim() : "";

            var desc = "";
            var latestChapEl = el.select("a[href*='/chuong-']").first();
            if (latestChapEl) {
                desc = latestChapEl.text().trim();
            } else if (author) {
                desc = "Tác giả: " + author;
            }

            bookList.push({
                name: name,
                link: link,
                cover: cover,
                description: desc,
                host: BASE_URL
            });
        }

        var next = null;
        var curPage = parseInt(page, 10);
        var nextPageStr = "page=" + (curPage + 1);
        if (html.indexOf(nextPageStr) !== -1) {
            next = (curPage + 1).toString();
        }

        return Response.success(bookList, next);
    } catch (e) {
        return Response.error("Lỗi khi tìm kiếm: " + (e.message || e));
    }
}
