load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    // 1. Trích xuất ID chương từ cuối URL (ví dụ: ...-chuong-1-453191)
    var m = url.match(/-(\d+)$/);
    if (m) {
        var chapId = m[1];
        var json = fetchJson(API_URL + "/chapters/" + chapId);
        if (json && json.content) {
            var content = json.content + "";
            // Chuẩn hóa định dạng ngắt dòng thành HTML
            content = content.replace(/\r\n|\r|\n/g, "<br>");
            return Response.success(content);
        }
    }

    // 2. Dự phòng: Quét từ trang HTML
    var res = fetchBook(url);
    if (res && res.ok) {
        var doc = res.html();
        doc.select("script, style, ins, iframe, noscript, .ads").remove();
        var contentEl = doc.select(".reading-content, #chapter-content, .content, article").first();
        if (contentEl) {
            return Response.success(contentEl.html());
        }
    }

    // 3. Dự phòng cấp 2: Headless Browser WebView
    var browser = Engine.newBrowser();
    try {
        var doc2 = browser.launch(url, 15000);
        if (doc2) {
            doc2.select("script, style, ins, iframe, noscript, .ads").remove();
            var el = doc2.select(".reading-content, #chapter-content, .content, article").first();
            if (el) {
                return Response.success(el.html());
            }
        }
    } catch (e) {} finally {
        try { browser.close(); } catch (e2) {}
    }

    return Response.error("Không tải được nội dung chương");
}
