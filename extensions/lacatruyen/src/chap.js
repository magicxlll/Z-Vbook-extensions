load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res || !res.ok) return Response.error("Không thể tải nội dung chương");

    var html = res.text();
    var nextData = extractNextData(html);

    if (nextData && nextData.props && nextData.props.pageProps) {
        var p = nextData.props.pageProps;
        var content = p.previewHtml || "";
        if (content) {
            // Clean empty paragraphs and unwanted artifacts
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
        var content = contentEl.html();
        content = content.replace(/<p>\s*<\/p>/gi, "");
        content = content.replace(/&nbsp;/g, " ");
        content = content.trim();
        if (content) {
            return Response.success(content);
        }
    }

    return Response.error("Nội dung chương trống hoặc cần đăng nhập trên web");
}
