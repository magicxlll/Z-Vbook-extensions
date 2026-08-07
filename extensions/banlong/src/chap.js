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
    // Fallback: WebView
    var browser = Engine.newBrowser();
    try {
        var doc2 = browser.launch(url, 15000);
        if (doc2) {
            if (doc2.select("#chapter-content .content-lock").text().length > 10) {
                return Response.error("Bạn cần trả phí chương này để có thể đọc.");
            }
            doc2.select("script, style, iframe, ins, .ads").remove();
            var contentEl2 = doc2.select("#chapter-content .s-content, .s-content").first();
            if (contentEl2) {
                return Response.success(contentEl2.html());
            }
        }
    } catch (e) {} finally { try { browser.close(); } catch (e2) {} }
    
    return Response.error("Không tải được nội dung chương");
}