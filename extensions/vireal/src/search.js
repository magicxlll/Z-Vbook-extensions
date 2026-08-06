load("config.js");

function execute(key, page) {
    var fetchUrl = BASE_URL + "/search?q=" + encodeURIComponent(key);

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var list = [];
    var seen = {};

    var blocks = html.split(/{"id":"|{\"id\":\"/);
    for (var i = 1; i < blocks.length; i++) {
        var block = blocks[i];
        var mName = block.match(/"name"s*:s*"([^"]+)"/) || block.match(/\"name\":\"([^\"]+)\"/);
        var mSlug = block.match(/"slug"s*:s*"([^"]+)"/) || block.match(/\"slug\":\"([^\"]+)\"/);
        var mThumb = block.match(/"thumbnail"s*:s*"([^"]+)"/) || block.match(/\"thumbnail\":\"([^\"]+)\"/);

        if (mName && mSlug) {
            var slug = mSlug[1];
            var name = mName[1];
            var cover = mThumb ? mThumb[1] : "";
            var link = BASE_URL + "/story/" + slug;

            if (!seen[link]) {
                seen[link] = true;
                list.push({
                    name: name,
                    link: link,
                    cover: cover,
                    host: BASE_URL
                });
            }
        }
    }

    return Response.success(list);
}