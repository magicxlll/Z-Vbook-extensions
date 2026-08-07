load("config.js");

function execute(url) {
    var response = fetchBook(url);
    if (response.ok) {
        var doc = response.html();
        doc.select("script, style, iframe, ins, .ads").remove();
        var contentEl = doc.select(".chapter-content, #chapter-content, .box-chap, .s-content").first();
        if (contentEl) {
            return Response.success(contentEl.html());
        }
    }
    return Response.error("Không tải được nội dung chương");
}