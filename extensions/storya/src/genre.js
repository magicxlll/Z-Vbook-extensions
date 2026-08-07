load("config.js");

function execute() {
    var json = apiJson("/genres");
    if (!json || !json.data) return Response.error("Không tải được thể loại");
    var list = [];
    for (var i = 0; i < json.data.length; i++) {
        var g = json.data[i];
        list.push({ title: g.name, input: g.id + "", script: "genrecontent.js" });
    }
    return Response.success(list);
}