load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    doc.select("script, style, ins, iframe, noscript").remove();
    doc.select(".chapter-filter-container, .chapter-breadcrumb, .chapter-select-wrapper, select, option").remove();
    doc.select(".ads, .advertisement, .banner, [class*='ads'], [id*='ads']").remove();
    doc.select(".text-center, .entry-divider, footer, .entry-meta, .nav-previous, .nav-next").remove();

    var contentEl = doc.select(".entry-content.single-page, .entry-content, .entry-summary").first();
    if (!contentEl) return Response.error("Không tìm thấy nội dung chương");

    var content = contentEl.html() + "";
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}
