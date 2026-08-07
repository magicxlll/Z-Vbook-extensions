load("config.js");

function execute(url) {
    var mangaId = "";
    var doc = fetch(url).html();
    var mangaIdElement = doc.select("#manga-chapters-holder").first();
    
    if (mangaIdElement) {
        mangaId = mangaIdElement.attr("data-id");
    }

    if (mangaId) {
        var res = fetch("https://xtruyen.vn/wp-admin/admin-ajax.php", {
            method: "POST",
            body: "action=manga_get_chapters&manga=" + mangaId
        });
        if (res.ok) {
            doc = res.html();
        }
    }

    var list = [];
    var els = doc.select("li.wp-manga-chapter a");
    if (els.size() === 0) els = doc.select(".chapter-title");

    // Madara chapters are usually loaded from newest to oldest, so we reverse it
    for (var i = els.size() - 1; i >= 0; i--) {
        var e = els.get(i);
        list.push({
            name: e.text().trim(),
            url: e.attr("href"),
            host: "https://xtruyen.vn"
        });
    }

    return Response.success(list);
}