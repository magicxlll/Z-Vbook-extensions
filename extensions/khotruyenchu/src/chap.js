load("config.js");

function execute(url) {
    try {
        var cleanTargetUrl = cleanUrl(url);
        var res = fetchBook(cleanTargetUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải nội dung chương.");
        }

        var html = res.text();
        var doc = Html.parse(html);

        var contentEl = doc.select(".entry-content").first() || doc.select(".reading-content").first() || doc.select(".chapter-content").first();
        if (!contentEl) {
            return Response.error("Không tìm thấy nội dung chương.");
        }

        // Loại bỏ các thành phần rác, thanh công cụ đọc và quảng cáo
        contentEl.select(".story-navigation").remove();
        contentEl.select(".reading-tools-bar").remove();
        contentEl.select(".story-toc-content").remove();
        contentEl.select(".code-block").remove();
        contentEl.select("[class*='code-block']").remove();
        contentEl.select("[class*='wpd-']").remove();
        contentEl.select("[class*='comments']").remove();
        contentEl.select(".ct-share-box").remove();
        contentEl.select("script").remove();
        contentEl.select("style").remove();
        contentEl.select("noscript").remove();
        contentEl.select("iframe").remove();
        contentEl.select("form").remove();

        var cleanContent = contentEl.html().trim();
        if (!cleanContent) {
            return Response.error("Nội dung chương trống.");
        }

        return Response.success(cleanContent);
    } catch (e) {
        return Response.error("Lỗi khi tải nội dung chương: " + (e.message || e));
    }
}
