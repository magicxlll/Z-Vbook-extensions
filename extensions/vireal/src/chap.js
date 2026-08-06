load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@
]+@)?(?:www.)?([^:/
?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var cleanHtml = html.replace(/\u003c/g, "<").replace(/\u003e/g, ">").replace(/\"/g, '"');

    cleanHtml = cleanHtml.replace(/<[a-z0-9]+\s+style="text-indent:-9144px;[^"]*">[^<]*<\/[a-z0-9]+>/gi, "");
    cleanHtml = cleanHtml.replace(/<style>[^<]*<\/style>/gi, "");

    var doc = Html.parse(cleanHtml);

    doc.select("script, style, ins, iframe, noscript").remove();
    doc.select("[style*='text-indent'], [style*='font-size: 0px'], [style*='font-size:0px']").remove();

    var contentEl = doc.select(".chapter-content, #reading-content, article, main, div[class*='Content']").first();
    if (!contentEl) {
        var paras = doc.select("p");
        if (paras.size() > 0) {
            var sb = "";
            paras.forEach(function(p) { sb += "<p>" + p.html() + "</p>"; });
            return Response.success(sb);
        }
        return Response.error("Không tìm thấy nội dung chương");
    }

    var content = contentEl.html() + "";
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}