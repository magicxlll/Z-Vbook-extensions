load("config.js");

function execute(url, page) {
    try {
        var pageNum = parseInt(page, 10) || 1;
        var cleanInput = cleanUrl(url);
        var isMoiCapNhat = (cleanInput.indexOf("#moi-cap-nhat") !== -1);
        var targetUrl = cleanInput.replace(/#.*$/, "");

        if (isMoiCapNhat) {
            targetUrl = BASE_URL + "/";
        } else if (pageNum > 1) {
            targetUrl = targetUrl.replace(/\/+$/, "") + "/page/" + pageNum + "/";
        }

        var res = fetchBook(targetUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải danh sách truyện.");
        }

        var html = res.text();
        var doc = Html.parse(html);
        var list = [];
        var seen = {};

        if (isMoiCapNhat) {
            // Phần ⚡ Truyện mới cập nhật trên trang chủ
            var updateLinks = doc.select("a[href*='/truyen/']");
            for (var k = 0; k < updateLinks.size(); k++) {
                var aEl = updateLinks.get(k);
                var aHref = cleanUrl(aEl.attr("href"));
                var aName = aEl.text().trim();

                // Lọc bỏ các liên kết không phải truyện hoặc trùng
                if (!aHref || !aName || aName.length < 2 || seen[aHref]) continue;
                if (aName === "Xem thêm" || aName === "Xem thêm »") continue;

                // Kiểm tra xem aHref có đúng định dạng /truyen/{slug}/
                if (!/\/truyen\/[^\/]+\/?$/i.test(aHref)) continue;

                seen[aHref] = true;
                list.push({
                    name: aName,
                    link: aHref,
                    cover: DEFAULT_COVER,
                    description: "",
                    host: BASE_URL
                });
            }

            return Response.success(list);
        }

        // Danh sách thẻ truyện thông thường (.home-story-card)
        var cards = doc.select(".home-story-card");
        for (var i = 0; i < cards.size(); i++) {
            var card = cards.get(i);
            var linkEl = card.select("a.hs-thumb").first() || card.select(".hs-title a").first() || card.select("a").first();
            if (!linkEl) continue;

            var bookUrl = cleanUrl(linkEl.attr("href"));
            if (!bookUrl || seen[bookUrl]) continue;
            seen[bookUrl] = true;

            var titleEl = card.select(".hs-title a").first() || card.select(".hs-title").first() || linkEl;
            var name = titleEl.text().trim();
            if (!name) continue;

            var imgEl = card.select("img").first();
            var cover = DEFAULT_COVER;
            if (imgEl) {
                var rawCover = imgEl.attr("data-src") || imgEl.attr("src") || "";
                cover = resolveCover(rawCover);
            }

            list.push({
                name: name,
                link: bookUrl,
                cover: cover,
                description: "",
                host: BASE_URL
            });
        }

        // Nếu trang không dùng .home-story-card (fallback các bài viết hoặc grid khác)
        if (list.length === 0) {
            var fallbackArticles = doc.select("article");
            for (var j = 0; j < fallbackArticles.size(); j++) {
                var art = fallbackArticles.get(j);
                var aTitle = art.select("h2.entry-title a").first() || art.select("h3 a").first() || art.select("a").first();
                if (!aTitle) continue;

                var artUrl = cleanUrl(aTitle.attr("href"));
                if (!artUrl || seen[artUrl]) continue;
                seen[artUrl] = true;

                var artName = aTitle.text().trim();
                var artImg = art.select("img").first();
                var artCover = DEFAULT_COVER;
                if (artImg) {
                    var c = artImg.attr("data-src") || artImg.attr("src") || "";
                    artCover = resolveCover(c);
                }

                list.push({
                    name: artName,
                    link: artUrl,
                    cover: artCover,
                    description: "",
                    host: BASE_URL
                });
            }
        }

        // Tính trang tiếp theo
        var next = null;
        var nextBtn = doc.select("nav.ct-pagination a.next").first();
        if (nextBtn) {
            next = String(pageNum + 1);
        } else {
            var pageLinks = doc.select("nav.ct-pagination a.page-numbers");
            for (var p = 0; p < pageLinks.size(); p++) {
                var pHref = pageLinks.get(p).attr("href");
                var m = pHref.match(/\/page\/(\d+)\//);
                if (m && parseInt(m[1], 10) > pageNum) {
                    next = String(pageNum + 1);
                    break;
                }
            }
        }

        return Response.success(list, next);
    } catch (e) {
        return Response.error("Lỗi khi tải danh sách truyện: " + (e.message || e));
    }
}
