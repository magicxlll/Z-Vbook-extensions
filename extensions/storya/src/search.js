load("config.js");

function execute(key, page) {
    page = page || "1";
    var json = apiJson("/stories?q=" + encodeURIComponent(key) + "&page=" + page + "&limit=20");
    if (!json || !json.data) return Response.error("Không tìm thấy kết quả");
    var items = parseStories(json.data);
    var next = json.meta && page < json.meta.totalPages ? String(parseInt(page, 10) + 1) : "";
    return Response.success(items, next);
}