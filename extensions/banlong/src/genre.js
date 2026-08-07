load("config.js");

function execute() {
    var response = fetchBook(BASE_URL);
    if (response.ok) {
        var doc = response.html();
        var genres = [];
        doc.select("a[href^=the-loai]").forEach(function(e) {
            genres.push({
                title: e.text(),
                input: BASE_URL + "/" + e.attr("href"),
                script: "search.js"
            });
        });
        return Response.success(genres);
    }
    return Response.error("Cannot load genres");
}