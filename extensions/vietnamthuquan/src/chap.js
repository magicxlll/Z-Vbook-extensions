// chap.js — Nội dung chương
// Contract: execute(url) → htmlString (KHÔNG phải object!)
load("config.js");

function execute(url) {
    var query = "";
    if (url.indexOf("?") > -1) {
        query = url.substring(url.indexOf("?") + 1);
    }

    var res = fetchBook(BASE_URL + "/truyen/chuonghoi_moi.aspx", {
        method: "POST",
        body: query,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var text = res.text() + "";
    var parts = text.split("--!!tach_noi_dung!!--");
    if (parts.length > 2) {
        var content = parts[2].trim();
        
        // Dọn dẹp sơ bộ
        content = content.replace(/&nbsp;/g, " ");
        
        return Response.success(content);
    }

    return Response.error("No content found");
}
