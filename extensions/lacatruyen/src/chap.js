load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.error("Không thể tải nội dung chương: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var nextData = extractNextData(html);

        if (nextData && nextData.props && nextData.props.pageProps) {
            var p = nextData.props.pageProps;
            var content = p.previewHtml || (p.chapter ? p.chapter.content : "") || "";
            if (content) {
                content = content.replace(/<p>\s*<\/p>/gi, "");
                content = content.replace(/&nbsp;/g, " ");
                content = content.trim();
                if (content) {
                    return Response.success(content);
                }
            }
        }

        // Fallback: DOM parsing
        var doc = Html.parse(html);
        var contentEl = doc.select(".chapter-content-element").first()
            || doc.select("#chapter-content").first()
            || doc.select(".content").first()
            || doc.select("article").first();

        if (contentEl) {
            contentEl.select("script, style, [data-decoy='true']").remove();
            var domContent = contentEl.html();
            domContent = domContent.replace(/<p>\s*<\/p>/gi, "");
            domContent = domContent.replace(/&nbsp;/g, " ");
            domContent = domContent.trim();
            if (domContent) {
                return Response.success(domContent);
            }
        }

        return Response.error("Nội dung chương trống hoặc cần đăng nhập trên web");
    } catch (e) {
        return Response.error("Lỗi khi đọc chương: " + (e.message || e));
    }
}
