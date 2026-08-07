load("config.js");

var CHAP_RE = /\/truyen\/([^\/]+)\/([^\/\?]+)/;

function execute(url) {
    var m = CHAP_RE.exec(url);
    var story, chap;
    if (m) { story = m[1]; chap = m[2]; }
    else {
        var parts = url.replace(/^\/+/, "").split("/");
        if (parts.length < 2) return Response.error("URL chương không hợp lệ");
        story = parts[parts.length - 2]; chap = parts[parts.length - 1];
    }

    var json = apiJson("/chapters/" + story + "/" + chap);
    if (json && json.data) {
        var c = json.data.rewrittenContent || json.data.content || "";
        if (c) return Response.success(c.replace(/\r\n/g, "
").replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>"));
    }

    return Response.error("Không tải được nội dung chương");
}