load("config.js");

function execute(input, page) {
    page = page || "1";
    var path = input + "&page=" + page + "&limit=20";
    var json = apiJson(path);
    if (!json || !json.data) return Response.error("Không tải được danh sách");
    var items = parseStories(json.data);
    var next = json.meta && page < json.meta.totalPages ? String(parseInt(page, 10) + 1) : "";
    return Response.success(items, next);
}