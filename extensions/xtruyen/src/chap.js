load("config.js");

function execute(url) {
    // XTruyen obfuscates and encrypts chapter text (using pako zlib in Javascript).
    // VBook's Rhino engine does not support this decryption out-of-the-box.
    return Response.error("Nguồn XTruyen hiện mã hóa nội dung chương (JS Pako). VBook chưa hỗ trợ giải mã nguồn này.");
}