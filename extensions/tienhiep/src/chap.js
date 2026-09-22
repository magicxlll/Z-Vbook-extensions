load("config.js");

function execute(url) {
    try {
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải nội dung chương.");
        }

        var doc = res.html();
        var contentEl = doc.select(".reading-prose, div[class*='reading-prose'], div.prose, article, div[class*='font-serif-reading']").first();

        var content = "";
        if (contentEl) {
            // Remove redundant title and utility elements
            contentEl.select("h1, h2, script, style, button, input, nav, .navigation").remove();
            content = contentEl.html();
            if (!content) {
                content = contentEl.text();
            }
        }

        if (!content) {
            // Fallback: extract reading-prose via regex
            var html = res.text();
            var match = html.match(/<div\b[^>]*class=["'][^"']*reading-prose[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
            if (match) {
                content = match[1];
            }
        }

        if (!content) {
            return Response.error("Không tìm thấy nội dung truyện.");
        }

        // Clean up redundant h1 chapter title
        content = content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "");
        // Clean up React comments and redundant whitespace
        content = content.replace(/<!--[\s\S]*?-->/g, "");
        content = content.replace(/&nbsp;/g, " ");

        return Response.success(content.trim());
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
