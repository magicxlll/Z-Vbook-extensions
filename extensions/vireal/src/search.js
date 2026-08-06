load("config.js");

function execute(key, page) {
    var fetchUrl = BASE_URL + "/search?q=" + encodeURIComponent(key);

    var res = fetchBook(fetchUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var list = [];
    var seen = {};

    var blocks = html.split(/\{\"id\":\"/);
    for (var i = 1; i < blocks.length; i++) {
        var block = blocks[i];
        var mSlug = block.match(/\"slug\":\"([^\"]+)\"/);
        var mName = block.match(/\"name\":\"([^\"]+)\"/);
        var mThumb = block.match(/\"thumbnail\":\"([^\"]+)\"/);

        if (mSlug && mName) {
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