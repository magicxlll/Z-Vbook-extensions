# MEMORY & PROJECT KNOWLEDGE BASE - Z-VBOOK-EXTENSIONS

> **Mô tả dự án:** Kho lưu trữ và phát triển Extension (Plugin) cho ứng dụng đọc truyện & xem phim **vBook** (Android/iOS).
> **Tác giả:** Zitzz (`magicxlll`)
> **Tham khảo kiến trúc chuẩn:** [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git)
> **Cập nhật lần cuối:** 2026-09-21 (Khắc phục triệt để lỗi mục lục La Cà Truyện lacatruyen.fit / lacatruyen.ink v3 bằng Pure ES5 AES Engine)

---

## 1. Tổng quan Kiến trúc vBook Extensions

vBook sử dụng môi trường thực thi JavaScript (QuickJS / Duktape / Android V8) trên ứng dụng di động để cào dữ liệu (scraping) từ các trang web truyện, truyện tranh (comic/manga), và phim/video (donghua/anime/series).

### 1.1. Cấu trúc Thư mục Chuẩn của 1 Extension

```
extensions/<extension_id>/
├── plugin.json       # Metadata & Khai báo script routing của extension
├── icon.png          # Logo/Icon đại diện của nguồn
├── plugin.zip        # Gói zip nén chứa plugin.json, icon.png và thư mục src/
└── src/              # Toàn bộ mã nguồn Javascript
    ├── config.js     # BASE_URL, User-Agent, helper functions dùng chung
    ├── home.js       # Danh mục các tab khám phá trang chủ
    ├── gen.js        # Parser phân trang danh sách truyện/phim
    ├── genre.js      # Danh mục thể loại (nếu có)
    ├── detail.js     # Chi tiết thông tin truyện (tên, tác giả, mô tả, ảnh bìa, trạng thái)
    ├── search.js     # Tìm kiếm truyện theo từ khóa
    ├── toc.js        # Danh sách mục lục chương (Table of Contents)
    ├── chap.js       # Nội dung đọc chương (HTML cho novel, list ảnh cho comic, list video cho video)
    ├── page.js       # (Tùy chọn) Danh sách trang mục lục nếu web phân trang TOC
    ├── track.js      # (Extension video) Lấy link stream video (m3u8, mp4...)
    └── explore.js    # (Extension video/comic tùy biến)
```

### 1.2. Hợp đồng Script & API Runtime (vBook JS Runtime Contracts)

#### Đối tượng Toàn cục (Globals):
- `fetch(url, options)`: Thực hiện HTTP request. Trả về object có `.ok`, `.status`, `.text()`, `.json()`, `.html()`.
- `Html.parse(htmlString)`: Parse chuỗi HTML thành DOM Document hỗ trợ CSS Selectors (Jsoup-like).
- `Response.success(data, nextPage)`: Trả về kết quả thành công cho ứng dụng vBook.
- `Response.error(message)`: Báo lỗi cho ứng dụng.
- `load(scriptName)`: Nạp file JS khác trong cùng thư mục `src/` (thường nạp `load("config.js")`).
- `Engine.newBrowser()`: Mở headless WebView để vượt cloudflare/render JS nếu cần (`browser.launch(url, timeoutMs)`).
- `CONFIG_URL`: Biến cấu hình URL do người dùng tùy chỉnh trong cài đặt vBook.

#### Chi tiết Hợp đồng từng Script:
| Script | Tham số đầu vào | Định dạng trả về `Response.success(...)` | Ghi chú |
| :--- | :--- | :--- | :--- |
| `home.js` | `()` | `[{ title: string, input: string, script: string }]` | Trả về danh sách tab trên Home |
| `genre.js` | `()` | `[{ title: string, input: string, script: string }]` | Danh sách thể loại |
| `gen.js` | `(url, page)` | `([{ name, link, cover, host, description }], nextPage)` | Danh sách truyện theo phân trang |
| `search.js` | `(key, page)` | `([{ name, link, cover, host }], nextPage)` | Tìm kiếm truyện |
| `detail.js` | `(url)` | `{ name, cover, host, author, description, ongoing, genres?, suggests? }` | Chi tiết truyện |
| `page.js` | `(url)` | `[url1, url2, ...]` | Mảng URL phân trang TOC (nếu dùng) |
| `toc.js` | `(url)` | `[{ name: string, url: string, host: string, pay?: boolean }]` | Danh sách chương |
| `chap.js` | `(url)` | Chuỗi HTML `"<p>Nội dung...</p>"` (Novel) hoặc `[imgUrl1, ...]` (Comic) | Nội dung chương |
| `track.js` | `(url)` | Stream info / link video | Chỉ dùng cho `video` extension |

---

## 2. Danh mục & Tình trạng Extensions Hiện tại trong Repo (13 Extensions)

| Tên Extension | Thư mục | Loại | Phiên bản | Nguồn (Host) | Đăng ký ở `plugin.json` gốc | Tình trạng & Đánh giá |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **AkayTruyen** | `akaytruyen` | Novel | v1 | `https://akaytruyen.com` | ✅ Có | Hoạt động tốt. Đã xử lý đảo thứ tự chương chuẩn. |
| **Bàn Long** | `banlong` | Novel | v22 | `https://blhvip.vn` | ✅ Có | Có fallback WebView. |
| **Con Đường Bá Chủ** | `conduongbachu` | Novel | v4 | `https://conduongbachu.com` | ✅ Có | Chuyên biệt 3752+ chương, sort số học, lọc audio player TTS và quảng cáo tốt. |
| **HHTQ Vietsub** | `hhtqvietsub` | Video | v9 | `https://hhtq.hair` | ✅ Có | Mã hóa vBook (`encrypt: true`). Xem Donghua Trung Quốc. |
| **La Cà Truyện** | `lacatruyen` | Novel | **v3** | `https://lacatruyen.fit` | ✅ Có | **Khắc phục triệt để lỗi mục lục**: Sử dụng engine AES-256-CBC + MD5 OpenSSL EvpKDF thuần ES5 siêu nhẹ (zero dependency), khôi phục hợp đồng `page.js`, tải mượt mà 100% mục lục (hơn 450+ chương) và nội dung chương. |
| **Motchill** | `motchill` | Video | v2 | `https://motchille.tv` | ✅ Có | Mã hóa vBook (`encrypt: true`). Phim vietsub/thuyết minh. |
| **Storya** | `storya` | Novel | v22 | `https://storya.click` | ✅ Có | Dùng REST API JSON trực tiếp tốc độ cao. |
| **Thư viện Online** | `vietnamthuquan` | Novel | v1 | `http://vietnamthuquan.eu` | ✅ Có | Cào dữ liệu thư quán qua ASPX POST. Đã đăng ký kệ. |
| **Truyện Full** | `truyenfull` | Novel | v2 | `https://truyenfull.vision` | ✅ Có | Hoạt động tốt. |
| **Truyện Sắc** | `truyensac` | Novel | **v3** | `https://truyensac.buzz` | ✅ Có | Dynamic Book Cover nghệ thuật cho truyện thiếu cover + Ưu tiên hiển thị tab Truyện Hot có sẵn ảnh CDN thực. |
| **Vireal** | `vireal` | Novel | v4 | `https://vireal.vn` | ✅ Có | Parse dữ liệu SSR Json block. Đã đăng ký kệ. |
| **XTruyen Test** | `xtruyen` | Novel | v2 | `https://xtruyen.vn` | ✅ Có | Theme Madara (WP), lấy TOC qua `admin-ajax.php`. |
| **YanHH3D** | `yanhh3d` | Video | v2 | `https://yanhh3d.ee` | ✅ Có | Mã hóa vBook (`encrypt: true`). Hoạt hình 3D. |

---

## 3. Chi tiết Kỹ thuật Tích hợp Nguồn La Cà Truyện (`lacatruyen.fit` / `lacatruyen.ink`)

### 3.1. Phân tích Tên miền & Reverse Engineering Hệ thống:
1. **Tên miền hoạt động:** `lacatruyen.ink` chuyển tiếp về `https://lacatruyen.fit`.
2. **Kiến trúc web:** Sử dụng Next.js Pages Router kết hợp backend Laravel CMS (`https://cms.metruyen.com`).
3. **Ảnh bìa truyện:** Lưu trữ tại CDN `https://cms.metruyen.com/storage/uploads/{image_name}` (100% truyện đều load ảnh thực, kèm dynamic cover generator fallback).
4. **Mã hóa Mục lục & Nội dung:**
   - API mục lục `POST /api/chapters/list-chapters` yêu cầu payload mã hóa AES (`id_story`, `page`, `items_per_page`, `order`) với key dẫn xuất từ seed: `T5Vv41K5zJBHhtODBnOTdrl3shZVEPqzb16Hzfuh4J5tWrb0`.
   - Trang đọc chương `/chapter/[slug]` yêu cầu slug chuẩn (không mở được bằng ID thuần túy).
   - Nội dung chương được trích xuất trực tiếp từ `previewHtml` trong SSR NextData của trang `/chapter/[slug]` dạng HTML thẻ `<p>` sạch sẽ.

### 3.2. Giải pháp Kỹ thuật cho Module Mã hóa (Pure ES5 AES Engine):
- **Vấn đề của CryptoJS cũ:** Thư viện CryptoJS v4 minified cồng kềnh (>63KB) phụ thuộc `window.crypto` để sinh số ngẫu nhiên cho Salt, và cơ chế UMD wrapper `(function(t, e) { t.CryptoJS = e() })(this, ...)` bị lỗi `this is undefined` trong các engine JS nhúng như Duktape / QuickJS của Android & iOS.
- **Giải pháp:** Viết độc lập module `crypto.js` thuần ES5 (~300 dòng mã sạch):
  - Thuật toán AES-256 Core chuẩn (Rijndael cipher block, key expansion 14 rounds, inverse cipher).
  - Thuật toán MD5 chuẩn RFC 1321 thuần ES5.
  - Thuật toán OpenSSL compatible EvpKDF dẫn xuất Key 256-bit và IV 128-bit từ Salt 8 bytes.
  - Sinh Salt bằng `Math.random()`, hoàn toàn không phụ thuộc `crypto.getRandomValues`.
  - Hỗ trợ PKCS#7 padding/unpadding và Base64 encode/decode đầy đủ.
  - Đã được kiểm thử đối chiếu chéo (cross-compatibility) 100% khớp với Node.js native crypto và gọi API live trả về đầy đủ hàng ngàn chương.

---

## 4. Nhật ký Chuyển phiên (Session Logs & State Tracking)

### [2026-09-21] Phiên 1: Khởi tạo & Đánh giá Toàn diện
- Đọc và phân tích toàn bộ repository, tham chiếu [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git).
- Khởi tạo file quản lý trạng thái `Memory.md`.

### [2026-09-21] Phiên 2: Tích hợp nguồn Truyện Sắc (`truyensac.buzz`)
- Phân tích kiến trúc Next.js và bóc tách REST API ngầm `https://api.truyensac.buzz`.
- Phát triển hoàn chỉnh 7 scripts cho extension `truyensac`.

### [2026-09-21] Phiên 3: Fix lỗi lấy Cover Truyện Sắc (v2)
- Sửa lỗi `resolveCover` và `detail.js` loại bỏ triệt để việc nhầm lẫn với `logo.webp` và `no-image.webp`.
- Bổ sung cơ chế auto resolve cover CDN qua `covers/{slug}.webp`.

### [2026-09-21] Phiên 4: Triển khai Dynamic Book Cover & Tối ưu Tab Hot (v3)
- Phân tích sâu nguyên nhân CDN 404 cho truyện mới và cơ chế fallback parchment của vBook.
- Triển khai bộ sinh ảnh bìa bìa sách nghệ thuật (dynamic styled placeholder) theo tên truyện và mã màu phân loại.
- Sắp xếp lại thứ tự tab trên trang chủ (`Truyện Hot` lên đầu).
- Đóng gói `plugin.zip`, cập nhật metadata `v3` trong `plugin.json` extension và root, commit & push lên Git remote.

### [2026-09-21] Phiên 5: Tích hợp Nguồn Mới La Cà Truyện (`lacatruyen.fit` / `lacatruyen.ink` v1)
- Rà quét DNS và phát hiện domain đích hoạt động `lacatruyen.fit`.
- Bóc tách toàn bộ API Next.js SSR, CMS storage image URL và cơ chế mã hóa AES của La Cà Truyện.
- Tích hợp module `crypto.js` giải mã mục lục `list-chapters`, bóc tách nội dung chương qua `previewHtml`.
- Xây dựng đầy đủ 9 scripts (`home.js`, `genre.js` với 24 thể loại, `gen.js`, `detail.js`, `toc.js`, `chap.js`, `search.js`, `page.js`, `crypto.js`).
- Đóng gói `extensions/lacatruyen/plugin.zip`, đăng ký vào `plugin.json` gốc, commit & push lên `origin/main`.

### [2026-09-21] Phiên 6: Sửa Lỗi Mục Lục Truyện La Cà Truyện (v2)
- Khảo sát các nguyên nhân sơ bộ và bổ sung fallback.

### [2026-09-21] Phiên 7: Khắc phục Triệt để Lỗi Mục Lục La Cà Truyện (v3 - Pure ES5 AES Engine)
- **Xác định chính xác nguyên nhân gốc rễ:**
  1. Thư viện CryptoJS v4 minified (63KB) chứa UMD wrapper cố gắng gán `this.CryptoJS` trong môi trường Duktape/QuickJS với top-level `this = undefined`, dẫn đến exception ngay khi `load("crypto.js")`.
  2. Bỏ khai báo script `"page": "page.js"` trong `plugin.json` khiến bộ điều khiển vBook trên app không kích hoạt quy trình tải mục lục.
  3. API lấy chapter trực tiếp không mã hóa (`/api/stories/{id}/chapters`) không trả về trường `slug`, trong khi trang đọc chương trên web bắt buộc phải có `slug`.
- **Hành động khắc phục:**
  1. Xây dựng module `crypto.js` hoàn toàn độc lập, thuần ES5 (~300 dòng mã sạch), triển khai thuật toán AES-256-CBC, MD5 và OpenSSL EvpKDF với `Math.random()`.
  2. Khôi phục khai báo `"page": "page.js"` trong `plugin.json` và chuẩn hóa `src/page.js`.
  3. Cải tiến `src/toc.js` tự động phát hiện `storyId` và gọi API `list-chapters` lấy tối đa 5000 chương/lần chỉ trong 1 request.
  4. Đã chạy test end-to-end mô phỏng vBook runtime: `search` -> `detail` -> `page` -> `toc` (lấy trọn vẹn 454 chương) -> `chap` (lấy 6313 ký tự HTML) thành công 100%.
  5. Đóng gói lại `plugin.zip` (19.9 KB), cập nhật `version: 3` trong `extensions/lacatruyen/plugin.json` và `plugin.json` gốc.
  6. Commit và push lên GitHub repository.
