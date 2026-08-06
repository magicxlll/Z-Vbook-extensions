load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@
]+@)?(?:www.)?([^:/
?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();

    var mSlug = html.match(/canonical"s+href="https://vireal.vn//story/([^"]+)"/) || html.match(/\"slug\":\"([^\"]+)\"/);
    var storySlug = mSlug ? mSlug[1] : url.split("/story/")[1].split("/")[0].split("?")[0];

    var chapters = [];
    var seen = {};

    var chapRegex = /\"id\":\"(\d+)\",\"name\":\"([^\"]+)\",\"slug\":\"([^\"]+)\"/g;
    var match;
    while ((match = chapRegex.exec(html)) !== null) {
        var chapName = match[2];
        var chapSlug = match[3];
        var chapUrl = BASE_URL + "/story/" + storySlug + "/" + chapSlug;
        if (!seen[chapUrl]) {
            seen[chapUrl] = true;
            chapters.push({
                name: chapName,
                url: chapUrl,
                host: BASE_URL
            });
        }
    }

    return Response.success(chapters);
}