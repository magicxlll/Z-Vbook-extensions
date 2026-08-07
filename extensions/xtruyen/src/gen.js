load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    var fetchUrl = url + (url.indexOf("theloai") !== -1 ? "page/" + page + "/" : "&page=" + page);
    var response = fetch(fetchUrl);
    
    if (response.ok) {
        var doc = response.html();
        var books = [];
        
        doc.select(".item-thumb").forEach(function(e) {
            var aTag = e.select("a").first();
            var imgTag = e.select("img").first();
            
            books.push({
                name: aTag.attr("title").trim(),
                link: aTag.attr("href"),
                cover: imgTag.attr("src") || imgTag.attr("data-src"),
                description: "",
                host: "https://xtruyen.vn"
            });
        });

        var next = parseInt(page) + 1 + "";
        if (books.length === 0) next = null;
        
        return Response.success(books, next);
    }
    return Response.error("Lỗi khi tải trang");
}
