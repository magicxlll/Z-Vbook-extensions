load("config.js");

function execute(url) {
    var response = fetchBook(url);
    if (response.ok) {
        var doc = response.html();
        if (doc.select("#chapter-content .content-lock").text().length > 10) {
            return Response.error("Bạn cần trả phí chương này để có thể đọc.");
        }
        doc.select("script, style, iframe, ins, .ads").remove();
        var contentEl = doc.select("#chapter-content .s-content").first();
        if (contentEl) {
            return Response.success(contentEl.html());
        }
    }
    return Response.error("Không tải được nội dung chương");
}