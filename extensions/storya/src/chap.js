load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@
]+@)?(?:www.)?([^:/
?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    doc.select("script, style, ins, iframe, noscript").remove();
    doc.select(".ads, .banner, [class*='ads']").remove();

    var contentEl = doc.select("#reading-content, .transition-all.duration-200.font-sans, .chapter-content, article, main").first();
    if (!contentEl) return Response.error("Không tìm thấy nội dung chương");

    var content = contentEl.html() + "";
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}