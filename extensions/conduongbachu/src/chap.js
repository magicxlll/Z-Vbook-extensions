load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    // 1. Xóa tất cả các phần rác, menu 3750 chương, quảng cáo, và trình phát audio TTS (NGHE TRUYỆN)
    doc.select("script, style, ins, iframe, noscript").remove();
    doc.select(".chapter-filter-container, .chapter-breadcrumb, .chapter-select-wrapper, select, option").remove();
    doc.select(".post-tts-player-wrap, [class*='post-tts'], [class*='tts'], audio").remove();
    doc.select(".searchform-wrapper, form.searchform, [class*='searchform']").remove();
    doc.select(".ads, .advertisement, .banner, [class*='ads'], [id*='ads']").remove();
    doc.select(".text-center, .entry-divider, footer, .entry-meta, .nav-previous, .nav-next").remove();

    var contentEl = doc.select(".entry-content.single-page, .entry-content, .entry-summary").first();
    if (!contentEl) return Response.error("Không tìm thấy nội dung chương");

    var content = contentEl.html() + "";

    // 2. Lọc bỏ câu từ giới thiệu / audio player fallback ở đầu chương
    content = content.replace(/<p>\s*Truyện Con đường bá chủ[\s\S]*?Nếu muốn tìm chương khác[\s\S]*?<\/p>/gi, "");
    content = content.replace(/<p>\s*Truyện Con đường bá chủ[\s\S]*?conduongbachu\.com[\s\S]*?<\/p>/gi, "");
    content = content.replace(/NGHE TRUYỆN[\s\S]*?Giọng đọc tự động/gi, "");
    content = content.replace(/Trình duyệt không hỗ trợ audio\./gi, "");
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}
