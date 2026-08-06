load("config.js");

function execute(url) {
    url = url.replace(/^https?:\/\/[^\/]+/, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();

    var parts = url.split("/story/");
    var storySlug = parts.length > 1 ? parts[1].split("/")[0].split("?")[0] : "";
    var mStorySlug = html.match(/canonical"\s+href="https:\/\/vireal\.vn\/\/story\/([^"]+)"/);
    if (mStorySlug) storySlug = mStorySlug[1];

    var chapters = [];
    var seen = {};

    var chapBlocks = html.split(/{"author":null,"id":"|{\"author\":null,\"id\":\"/);
    for (var i = 1; i < chapBlocks.length; i++) {
        var block = chapBlocks[i];
        var mName = block.match(/"name"s*:s*"([^"]+)"/) || block.match(/\"name\":\"([^\"]+)\"/);
        var mChapSlug = block.match(/"slug"s*:s*"([^"]+)"/) || block.match(/\"slug\":\"([^\"]+)\"/);

        if (mName && mChapSlug) {
            var cName = mName[1];
            var cSlug = mChapSlug[1];
            var cUrl = BASE_URL + "/story/" + storySlug + "/" + cSlug;

            if (!seen[cUrl]) {
                seen[cUrl] = true;
                chapters.push({
                    name: cName,
                    url: cUrl,
                    host: BASE_URL
                });
            }
        }
    }

    return Response.success(chapters);
}