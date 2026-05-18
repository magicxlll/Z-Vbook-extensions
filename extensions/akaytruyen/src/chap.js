// chap.js — Nội dung chương
// Contract: execute(url) → htmlString (KHÔNG phải object!)
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    // Xóa quảng cáo và phần thừa
    doc.select("script, style, ins, iframe, noscript").remove();
    doc.select(".ads, .advertisement, .banner, [class*='ads'], [id*='ads']").remove();
    doc.select("a").remove();

    // Lấy nội dung chương
    var contentEl = doc.select("#chapter-content").first();
    if (!contentEl) return Response.error("No content found");

    var content = contentEl.html() + "";
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}
