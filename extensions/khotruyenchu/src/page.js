load("config.js");

function execute(url) {
    try {
        var cleanTargetUrl = cleanUrl(url);
        // Đảm bảo URL kết thúc bằng dấu /
        if (cleanTargetUrl.slice(-1) !== "/") {
            cleanTargetUrl += "/";
        }

        var res = fetchBook(cleanTargetUrl);
        if (!res || res.status !== 200) {
            return Response.success([cleanTargetUrl]);
        }

        var html = res.text();
        var doc = Html.parse(html);

        var maxPage = 1;
        var pageNumbers = doc.select("nav.ct-pagination a.page-numbers, nav.ct-pagination span.page-numbers");
        for (var i = 0; i < pageNumbers.size(); i++) {
            var text = pageNumbers.get(i).text().trim();
            var pNum = parseInt(text, 10);
            if (!isNaN(pNum) && pNum > maxPage) {
                maxPage = pNum;
            }
            var href = pageNumbers.get(i).attr("href");
            if (href) {
                var m = href.match(/\/page\/(\d+)\//);
                if (m) {
                    var mNum = parseInt(m[1], 10);
                    if (!isNaN(mNum) && mNum > maxPage) {
                        maxPage = mNum;
                    }
                }
            }
        }

        if (maxPage <= 1) {
            return Response.success([cleanTargetUrl]);
        }

        var list = [];
        for (var p = 1; p <= maxPage; p++) {
            if (p === 1) {
                list.push(cleanTargetUrl);
            } else {
                list.push(cleanTargetUrl + "page/" + p + "/");
            }
        }

        return Response.success(list);
    } catch (e) {
        return Response.success([cleanUrl(url)]);
    }
}
