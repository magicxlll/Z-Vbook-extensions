load("config.js");

function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var name = doc.select(".post-title h1").text();
        var author = doc.select(".author-content a").text();
        var cover = doc.select(".summary_image img").attr("src") || doc.select(".summary_image img").attr("data-src") || "https://xtruyen.vn/wp-content/themes/madara/images/no-image.png";
        var desc = doc.select(".summary-content.vote-details").text() + " - " + doc.select(".genres-content").text();
        
        return Response.success({
            name: name.trim(),
            cover: cover,
            author: author,
            description: desc,
            detail: "Tác giả: " + author,
            host: "https://xtruyen.vn"
        });
    }
    return Response.error("Lỗi khi tải trang");
}