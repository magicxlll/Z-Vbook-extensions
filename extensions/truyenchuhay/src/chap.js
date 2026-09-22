load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.error("Không thể tải nội dung chương: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var doc = Html.parse(html);

        var contentEl = doc.select("#content-chapter").first()
            || doc.select(".chapter-content").first()
            || doc.select(".reading-content").first()
            || doc.select("article").first();

        if (contentEl) {
            var content = contentEl.html() || "";
            // Xóa rác, quảng cáo, nút bấm và spinner loading
            content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
            content = content.replace(/<style[\s\S]*?<\/style>/gi, "");
            content = content.replace(/<button[\s\S]*?<\/button>/gi, "");
            content = content.replace(/<svg[\s\S]*?<\/svg>/gi, "");
            content = content.replace(/<[^>]+class="[^"]*animate-spin[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, "");
            content = content.replace(/<p>\s*<\/p>/gi, "");
            content = content.replace(/&nbsp;/g, " ");
            content = content.trim();

            var plainText = content.replace(/<[^>]+>/g, "").trim();

            // Kiểm tra xem có nội dung đọc thực tế không (tối thiểu 50 ký tự văn bản)
            if (plainText.length >= 50 && !/nội dung đang bị ẩn|mở nội dung ngay|hệ thống đang bận/i.test(plainText)) {
                return Response.success(content);
            }
        }

        return Response.error("Chương này hiện chưa có nội dung văn bản trên truyenchuhay.org (nguồn gốc bị ẩn yêu cầu vượt link traffic hoặc chưa cập nhật nội dung)");
    } catch (e) {
        return Response.error("Lỗi khi đọc chương: " + (e.message || e));
    }
}
