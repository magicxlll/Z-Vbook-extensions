load("config.js");

function execute() {
    var res = fetchJson(API_URL + "/genres");
    if (!res || !Array.isArray(res)) return Response.error("Không thể tải danh sách thể loại");

    var genres = [];
    for (var i = 0; i < res.length; i++) {
        var g = res[i];
        if (g && g.name && g.slug) {
            genres.push({
                title: g.name,
                input: API_URL + "/novels?genreSlug=" + encodeURIComponent(g.slug),
                script: "gen.js"
            });
        }
    }
    return Response.success(genres);
}
