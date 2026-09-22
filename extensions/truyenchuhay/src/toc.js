load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.error("Không thể tải trang truyện: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var storySlug = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/[\/\?#].*$/, "");
        var storyId = extractStoryId(html);

        // TẦNG 1: Gọi API REST siêu tốc lấy trọn vẹn 100% chương trong 1 request
        if (storyId) {
            try {
                var apiUrl = BASE_URL + "/api/get-list-chapter-v2?id=" + storyId;
                var chapters = fetchJson(apiUrl);

                if (Array.isArray(chapters) && chapters.length > 0) {
                    var list = [];
                    for (var i = 0; i < chapters.length; i++) {
                        var c = chapters[i];
                        var name = (c.name_chap || ("Chương " + (c.index_chap || (i + 1)))).trim();
                        var chapUrlPart = (c.url_chap || "").trim();
                        if (!chapUrlPart) continue;

                        var chapUrl = BASE_URL + "/" + storySlug + "/" + chapUrlPart;
                        list.push({
                            name: name,
                            url: chapUrl,
                            host: BASE_URL
                        });
                    }

                    if (list.length > 0) {
                        return Response.success(list);
                    }
                }
            } catch (errApi) {}
        }

        // TẦNG 2: Fallback cào từ DOM trang hiện tại
        var doc = Html.parse(html);
        var chapLinks = doc.select("a[href*='/chuong-']");
        var domList = [];
        var seen = {};

        for (var j = 0; j < chapLinks.size(); j++) {
            var aEl = chapLinks.get(j);
            var href = aEl.attr("href");
            var text = aEl.text().trim();

            if (!href || !text) continue;
            // Bỏ qua các nút điều hướng "Đọc từ đầu", "Chương mới nhất", "Chương trước", "Chương sau"
            if (/đọc từ đầu|mới\s*nhất|chương\s*trước|chương\s*sau/i.test(text)) continue;

            href = cleanUrl(href);
            if (seen[href]) continue;
            seen[href] = true;

            domList.push({
                name: text,
                url: href,
                host: BASE_URL
            });
        }

        if (domList.length > 0) {
            return Response.success(domList);
        }

        return Response.error("Không thể tải danh sách chương của truyện");
    } catch (e) {
        return Response.error("Lỗi khi tải mục lục: " + (e.message || e));
    }
}
