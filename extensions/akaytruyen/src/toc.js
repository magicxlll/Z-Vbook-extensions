// toc.js — Mục lục chương
// Contract: execute(url) → [{ name, url, host, pay? }]
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    var chapters = [];
    var seen = {};
    var page = 1;
    var hasMore = true;

    while (hasMore) {
        var fetchUrl = url + "?page=" + page;
        var res = fetch(fetchUrl);
        if (!res.ok) break;

        var doc = res.html();
        
        // Select mobile chapter cards/links
        var pageChapters = doc.select("a.chapter-link-mobile");
        if (pageChapters.size() === 0) {
            // Fallback to desktop link selector
            pageChapters = doc.select(".story-detail__list-chapter--list a");
        }
        
        if (pageChapters.size() === 0) {
            break;
        }

        var addedInPage = 0;
        pageChapters.forEach(function (el) {
            var number = el.select(".chapter-number").text().trim();
            var title = el.select(".chapter-title").text().trim();
            var name = "";
            
            if (number || title) {
                name = number ? (number + ": " + title) : title;
            } else {
                name = el.text().replace(/\s+/g, " ").trim();
                name = name.replace(/^\d+\s+T\d+\s+/, "").trim();
            }
            
            var chapUrl = (el.attr("href") || "") + "";

            if (!name || !chapUrl) return;
            if (seen[chapUrl]) return;
            seen[chapUrl] = true;

            if (chapUrl.indexOf("http") !== 0) {
                chapUrl = chapUrl.indexOf("/") === 0 ? BASE_URL + chapUrl : BASE_URL + "/" + chapUrl;
            }

            chapters.push({
                name: name,
                url: chapUrl,
                host: BASE_URL
            });
            addedInPage++;
        });

        if (addedInPage === 0) {
            hasMore = false;
        } else {
            page++;
        }

        // Giới hạn an toàn tối đa 150 trang (tương đương 15,000 chương) để tránh loop vô tận
        if (page > 150) {
            break;
        }
    }

    if (chapters.length === 0) return Response.error("No chapters found");
    
    // Đảo ngược mảng vì AkayTruyen để chương mới nhất lên đầu tiên
    chapters.reverse();
    
    return Response.success(chapters);
}
