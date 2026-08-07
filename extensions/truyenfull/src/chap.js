load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetch(url);
    if (res.ok) {
        var doc = res.html();
        doc.select("script, style, ins, iframe, noscript").remove();
        doc.select(".ads, .advertisement, .banner, [class*='ads'], [id*='ads']").remove();
        doc.select("a").remove();
        
        var contentEl = doc.select("#chapter-content").first();
        if (contentEl) {
            var content = contentEl.html() + "";
            content = content.replace(/&nbsp;/g, " ");
            return Response.success(content);
        }
    }
    
    // Fallback WebView
    var browser = Engine.newBrowser();
    try {
        var doc2 = browser.launch(url, 15000);
        if (doc2) {
            doc2.select("script, style, ins, iframe, noscript").remove();
            doc2.select(".ads, .advertisement, .banner, [class*='ads'], [id*='ads']").remove();
            doc2.select("a").remove();
            
            var contentEl2 = doc2.select("#chapter-content").first();
            if (contentEl2) {
                var content2 = contentEl2.html() + "";
                content2 = content2.replace(/&nbsp;/g, " ");
                return Response.success(content2);
            }
        }
    } catch (e) {} finally { try { browser.close(); } catch (e2) {} }
    
    return Response.error("Không tải được nội dung chương");
}
