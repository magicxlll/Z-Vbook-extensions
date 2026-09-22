load("config.js");

function execute(url) {
    try {
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải thông tin mục lục.");
        }

        var html = res.text();
        var storyId = extractStoryId(html, url);

        if (storyId) {
            var apiUrl = BASE_URL + "/story/get-list-chapers?story_id=" + storyId + "&per_page=5000&page=1&order_by=position&order_type=ASC";
            return Response.success([apiUrl]);
        }

        // Fallback to static URL
        return Response.success([cleanUrl(url)]);
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
