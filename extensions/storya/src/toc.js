load("config.js");

function execute(url) {
    url = url.replace(/^https?:\/\/[^\/]+/, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var doc = res.html();

    var total = 0;
    var mJson = html.match(/"numberOfPages"\s*:\s*(\d+)/);
    if (mJson) {
        total = parseInt(mJson[1], 10);
    } else {
        var mTitle = html.match(/Tới Chương (\d+)/i);
        if (mTitle) {
            total = parseInt(mTitle[1], 10);
        } else {
            var elCount = doc.select(".font-bold.text-lg").first();
            if (elCount) total = parseInt((elCount.text() || "").replace(/\D/g, ""), 10);
        }
    }

    if (total <= 0) total = 50;

    var storyUrl = url.replace(/\/+$/, "");
    var chapters = [];

    for (var i = 1; i <= total; i++) {
        chapters.push({
            name: "Chương " + i,
            url: storyUrl + "/chuong-" + i,
            host: BASE_URL
        });
    }

    return Response.success(chapters);
}