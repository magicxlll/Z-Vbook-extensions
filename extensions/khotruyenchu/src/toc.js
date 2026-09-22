load("config.js");

function execute(url) {
    try {
        var cleanTargetUrl = cleanUrl(url);
        var res = fetchBook(cleanTargetUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải mục lục chương.");
        }

        var html = res.text();
        var doc = Html.parse(html);
        var list = [];
        var seen = {};

        // Ưu tiên selector chính xác của từng bài viết chương
        var articles = doc.select("article.entry-card");
        for (var i = 0; i < articles.size(); i++) {
            var art = articles.get(i);
            var aEl = art.select("h2.entry-title a").first() || art.select("h3.entry-title a").first() || art.select("a[href*='/chuong-']").first();
            if (!aEl) continue;

            var chapUrl = cleanUrl(aEl.attr("href"));
            var chapName = aEl.text().trim();

            if (!chapUrl || !chapName) continue;
            if (seen[chapUrl]) continue;
            seen[chapUrl] = true;

            list.push({
                name: chapName,
                url: chapUrl,
                host: BASE_URL
            });
        }

        // Fallback: Tìm tất cả liên kết /chuong-
        if (list.length === 0) {
            var allLinks = doc.select("a[href*='/chuong-']");
            for (var j = 0; j < allLinks.size(); j++) {
                var linkEl = allLinks.get(j);
                var href = cleanUrl(linkEl.attr("href"));
                var text = linkEl.text().trim();

                if (!href || !text) continue;
                // Bỏ qua các nút chuyển tiếp đặc biệt
                if (/đọc từ đầu|chương mới nhất|chương trước|chương sau/i.test(text)) continue;
                if (seen[href]) continue;
                seen[href] = true;

                list.push({
                    name: text,
                    url: href,
                    host: BASE_URL
                });
            }
        }

        if (list.length > 0) {
            return Response.success(list);
        }

        return Response.error("Không tìm thấy chương nào trong mục lục.");
    } catch (e) {
        return Response.error("Lỗi khi tải mục lục: " + (e.message || e));
    }
}
