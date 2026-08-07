load("config.js");

function execute(url) {
    var browser = Engine.newBrowser();
    try {
        var doc = browser.launch(url, 15000);
        if (doc) {
            var el = doc.select("#chapter-reading-content").get(0);
            if (el) {
                return Response.success(el.html());
            }
        }
    } catch (e) {} finally { try { browser.close(); } catch (e2) {} }
    return Response.error("Chương này tải khá chậm do mã hóa, hoặc không tải được.");
}