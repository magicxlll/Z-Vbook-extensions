load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.success([url]);
        }

        var html = res.text() || "";
        var storyId = extractStoryId(html);

        // Nếu có storyId, API get-list-chapter-v2 sẽ lấy trọn vẹn toàn bộ chương trong 1 request
        if (storyId) {
            return Response.success([url]);
        }

        // Dự phòng: Tìm số trang từ DOM nếu không có storyId
        var doc = Html.parse(html);
        var maxPage = 1;

        var inputEl = doc.select("input#moving-chapter-2").first();
        if (inputEl) {
            var maxAttr = parseInt(inputEl.attr("max"), 10);
            if (!isNaN(maxAttr) && maxAttr > maxPage) {
                maxPage = maxAttr;
            }
        }

        if (maxPage === 1) {
            var pageLinks = doc.select("ul.list-page a");
            for (var i = 0; i < pageLinks.size(); i++) {
                var href = pageLinks.get(i).attr("href");
                var match = href.match(/page=(\d+)/i);
                if (match) {
                    var pNum = parseInt(match[1], 10);
                    if (pNum > maxPage) {
                        maxPage = pNum;
                    }
                }
            }
        }

        var list = [];
        for (var p = 1; p <= maxPage; p++) {
            if (p === 1) {
                list.push(url);
            } else {
                list.push(url + "?page=" + p);
            }
        }

        return Response.success(list);
    } catch (e) {
        return Response.success([url]);
    }
}
