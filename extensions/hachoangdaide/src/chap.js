load("config.js");

function execute(url) {
    try {
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải nội dung chương.");
        }

        var html = res.text();
        var content = "";

        // Method 1: Extract from JSON.parse('...') in Blade template
        var match = html.match(/chaper\s*[:=]\s*JSON\.parse\('([\s\S]*?)'\)/i);
        if (match && match[1]) {
            try {
                var jsonStr = eval("'" + match[1] + "'");
                var data = JSON.parse(jsonStr);
                if (data && data.content) {
                    content = data.content;
                }
            } catch (err) {
                // Ignore eval error and continue to fallback
            }
        }

        // Method 2: DOM fallback
        if (!content) {
            var doc = res.html();
            var contentEl = doc.select(".published-content, .s-content, div[class*='published-content'], .chapter-content-container").first();
            if (contentEl) {
                contentEl.select("script, style, button, input, nav, .ads, .comment").remove();
                content = contentEl.html();
            }
        }

        if (!content) {
            return Response.error("Không tìm thấy nội dung truyện.");
        }

        // Clean up redundant titles and tags
        content = content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "");
        content = content.replace(/<!--[\s\S]*?-->/g, "");
        content = content.replace(/&nbsp;/g, " ");

        return Response.success(content.trim());
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
