load("config.js");

function execute(input, page) {
    page = page || "1";
    var json = apiJson("/stories?genreId=" + input + "&page=" + page + "&limit=20");
    if (!json || !json.data) return Response.error("Không tải được thể loại");
    var items = parseStories(json.data);
    var next = json.meta && page < json.meta.totalPages ? String(parseInt(page, 10) + 1) : "";
    return Response.success(items, next);
}