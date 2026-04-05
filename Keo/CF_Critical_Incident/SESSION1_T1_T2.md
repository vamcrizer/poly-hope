# SESSION 1: LOCK THE RULES — CF Critical Incident
> **Kèo:** Another critical Cloudflare incident by...?
> **Ngày:** 2026-04-04 | **Platform:** Perplexity (tất cả model đều switch trong Perplexity)
> **Sub-markets:** April 30 (34¢ YES) | May 31 (55¢ YES) | June 30 (68¢ YES)

---

# T1: TRIAGE

## Bạn tự làm (không cần AI) — 3 phút

**Thông tin đã đọc từ ảnh chụp:**
- Volume: $370k | Depth đủ
- Spread April: YES=34¢ / NO=67¢ → spread ~1¢ ✓
- Spread May: YES=83.9¢ / NO=45¢ → spread ~29¢ ⚠️
- Spread June: YES=73¢ / NO=37¢ → spread ~10¢

**Trả lời nhanh để chấm Prelim Edge:**
> Rule của kèo này là: CF phải có incident Critical (đỏ) **AND** resolved trước deadline.
> Dựa trên GPT cross-check đã phát hiện: Feb 20/2026 BYOIP outage + Jan 22/2026 route leak → CF có incidents đáng kể trong Q1/2026.
> Tuy nhiên chưa biết bao nhiêu cái được classified Critical khi *resolved* (CF có xu hướng downgrade).
> → **Edge = 1** (có thesis sơ bộ: base rate > 0, CF incidents thường xuyên; nhưng market có thể đã price đúng — verify chắc ở T3)

| Tiêu chí | Điểm | x Trọng | Tích | Lý do |
|---|---|---|---|---|
| Rule Clarity | `2` | x3 | `6` | Rule rõ, source rõ (cloudflarestatus.com), edge cases đã bóc tách xong |
| Prelim Edge | `1` | x2 | `2` | CF có incidents thường xuyên nhưng market price (34/55/68¢) có thể đã phản ánh đúng — chưa đủ basis nói market sai rõ |
| Liquidity | `1` | x2 | `2` | April spread ~1¢ ok; May spread ~29¢ rộng ⚠️; June ~10¢ chấp nhận được |
| Time Left | `2` | x1 | `2` | April=26 ngày / May=57 / June=87 — đủ để thesis play out |
| **TỔNG** | | | **`12` / 16** | |

**KẾT LUẬN T1:**
- Điểm quy đổi: `75` / 100 → **STANDARD TRACK**
- Track: `STANDARD` — research chuẩn, không cần peer challenge trừ khi T3 cho edge > 20%
- Sub-market focus: `Cả 3, tập trung phân tích May 31 trước`
  - *May 31 (55¢) — gần 50/50, alpha tiềm năng cao nhất nếu base rate lệch*
  - *June 30 (68¢) — nếu base rate không đủ cao, BUY NO có thể là hướng*
  - *April 30 (34¢) — chỉ 26 ngày, risk thấp nhưng window hẹp*

---

# T2: RESOLUTION AUDIT

## Bước 1 — Bạn tự làm: Copy full rule (2 phút)

> 1. Vào Polymarket → kèo CF Critical Incident
> 2. Mục **Rules** → bấm **"Show more"** (phần bị cắt ở "above s..." rất quan trọng)
> 3. Select all → Copy → Dán vào đây:

```
[DÁN TOÀN BỘ RULE VÀO ĐÂY]
```

## Bước 2 — Perplexity · Claude Sonnet 4.6 · Thread MỚI (Session 1)

> Mở Perplexity → Thread mới → Chọn **Claude Sonnet 4.6** → Gửi prompt sau:

---
**PROMPT CHO CLAUDE (copy nguyên, thay `___RULE___`):**

```
Phân tích Resolution Audit cho kèo Polymarket. Rule nguyên văn:

___RULE___

Trả lời theo đúng format sau (không thêm bớt, không giải thích dài dòng):

**METADATA**
- Primary source: [link cụ thể]
- Secondary source: [hoặc "Không có"]
- Cutoff: [ngày giờ timezone chính xác]
- Dispute risk: [Thấp/Cao — 1 câu lý do]

**BINARY SETTLEMENT**
- YES nếu và chỉ nếu: [1 câu điều kiện đủ]
- NO trong mọi trường hợp còn lại, đặc biệt: [liệt kê 3-4 trường hợp NO rõ nhất]

**EDGE CASES**
| # | Tình huống | YES/NO | Lý do |
|---|---|---|---|
| 1 | [Incident Critical khi ongoing, nhưng hạ cấp xuống Major khi resolved] | ? | ? |
| 2 | [Incident xảy ra t-1 ngày, chưa resolved tại deadline] | ? | ? |
| 3 | [CF backdate re-classify incident cũ thành Critical] | ? | ? |
| 4 | [Sub-service Critical (VD: Workers) nhưng main CDN ok] | ? | ? |
| 5 | [Incident resolved đúng 11:59pm deadline — inclusive hay không?] | ? | ? |
| 6 | [Thêm 1 bẫy nào bạn tìm thấy trong rule] | ? | ? |

**THREE SENTENCES**
1. Market đo: [...]
2. Market KHÔNG đo: [...]
3. Bẫy dễ nhầm nhất: [...]

**RESOLUTION CONFIDENCE: [High/Medium/Low]**
Lý do: [1 câu]
```

---

> Khi Claude trả lời xong, **dán kết quả vào đây** (thay thế toàn bộ block dưới):

Dưới đây là Resolution Audit đầy đủ theo format yêu cầu:

***

**METADATA**
- Primary source: [https://cloudflarestatus.com/history](https://www.cloudflarestatus.com/history) [cloudflarestatus](https://www.cloudflarestatus.com/history)
- Secondary source: https://blog.cloudflare.com/tag/post-mortem/ (Cloudflare post-mortem blog) [blog.cloudflare](https://blog.cloudflare.com/tag/post-mortem/)
- Cutoff: March 31, 2026, 23:59:59 ET (= April 1, 2026 03:59:59 UTC) [cloudflarestatus](https://www.cloudflarestatus.com/history)
- Dispute risk: Thấp — nguồn chính thức duy nhất và rõ ràng là cloudflarestatus.com, ít không gian diễn giải chủ quan [cloudflarestatus](https://www.cloudflarestatus.com/history)

***

**BINARY SETTLEMENT**
- YES nếu và chỉ nếu: Ít nhất một incident trên cloudflarestatus.com được Cloudflare đánh dấu "Resolved" trong timeframe **và** classification tại thời điểm Resolved đó là **Critical (đỏ)**
- NO trong mọi trường hợp còn lại, đặc biệt:
  1. Mọi incident chỉ được classify Critical khi đang ongoing nhưng resolved với classification thấp hơn (Major/Minor)
  2. Không có incident nào được resolved trong timeframe (dù có bao nhiêu incident ongoing)
  3. Incident resolved sau deadline và không còn ongoing tại thời điểm market đóng
  4. Revision hạ cấp từ Critical xuống thấp hơn — nếu incident đã resolved Critical thì YES đã lock, nhưng revision nâng cấp lên Critical sau deadline → NO [blog.cloudflare](https://blog.cloudflare.com/route-leak-incident-january-22-2026/)

***

**EDGE CASES**
| # | Tình huống | YES/NO | Lý do |
|---|---|---|---|
| 1 | Incident Critical khi ongoing, nhưng hạ cấp xuống Major khi resolved | **NO** | Rule tường minh: *"Classifications while ongoing will have no bearing"* — chỉ classification lúc Resolved mới tính |
| 2 | Incident xảy ra t-1 ngày, chưa resolved tại deadline | **PENDING → Depends** | Market remain open cho đến khi resolved; resolution dựa trên *"first impact classification"* ngay sau khi Resolved, bất kể revision sau đó |
| 3 | CF backdate re-classify incident cũ thành Critical | **YES** nếu (a) incident đã resolved VÀ (b) revision được publish trong timeframe — **NO** nếu revision publish sau deadline | Rule cho phép: *"Revisions that upgrade…will qualify if…revision is published within this market's timeframe"*  [cloudflarestatus](https://www.cloudflarestatus.com/history) |
| 4 | Sub-service Critical (VD: Workers) nhưng main CDN ok | **YES** | Rule nói "outages and other issues classified as critical" — không giới hạn scope service, mọi incident trên cloudflarestatus.com đều tính |
| 5 | Incident resolved đúng 11:59pm ET deadline — inclusive hay không? | **YES (inclusive)** | Rule dùng "by the listed date (ET)" — tiêu chuẩn Polymarket là end-of-day inclusive, tức 23:59:59 ET ngày đó vẫn qualify |
| 6 | Incident resolved Critical đúng hạn, nhưng CF sau đó silently sửa classification trên status page | **YES lock — revision bị bỏ qua** | Rule: *"regardless of subsequent revisions or corrections"* — first classification at Resolved time là final, CF không thể retroactively đổi outcome |

***

**THREE SENTENCES**
1. Market đo: Xác suất Cloudflare có ít nhất **một incident được mark Resolved với classification Critical (đỏ) trên cloudflarestatus.com** trong khoảng thời gian đến deadline chỉ định [cloudflarestatus](https://www.cloudflarestatus.com/history)
2. Market KHÔNG đo: Mức độ nghiêm trọng thực tế của outage khi đang xảy ra, số lượng người dùng bị ảnh hưởng, hay incident chỉ critical trong quá trình diễn ra nhưng downgrade khi close [blog.cloudflare](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)
3. Bẫy dễ nhầm nhất: Trader thấy incident màu đỏ/Critical trên live status page và nghĩ YES chắc chắn — nhưng nếu Cloudflare resolve incident đó với classification thấp hơn (như họ đã làm với Feb 20, 2026 BYOIP outage), market vẫn resolve NO [blog.cloudflare](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)

***

**RESOLUTION CONFIDENCE: High**
Lý do: Nguồn duy nhất là cloudflarestatus.com với record lịch sử công khai, classification tại thời điểm Resolved được ghi rõ ràng và không thể thay đổi về mặt market outcome theo rule [blog.cloudflare](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)

---

## Bước 3 — Perplexity · GPT-5.4 Thinking · Vẫn thread Session 1

> Chuyển dropdown sang **GPT-5.4 Thinking** trong cùng thread → Gửi:

---
**PROMPT CHO GPT — 2 phần, gửi tuần tự:**

**Phần A — Dán output Claude (send trước):**
```
Claude vừa làm Resolution Audit cho kèo Cloudflare Critical Incident. Đây là output:
[DÁN TOÀN BỘ KẾT QUẢ CLAUDE VÀO ĐÂY]
```

**Phần B — Gửi tiếp ngay sau khi Claude output đã gửi:**
```
Cross-check audit trên và trả lời theo ĐÚNG format sau, không thêm gì khác:

**GPT CROSS-CHECK**
- Có lỗi đọc rule không: [Có/Không — nếu có ghi cụ thể lỗi gì]
- Edge case Claude bỏ sót: [liệt kê cụ thể, hoặc "Không"]
- Binary settlement chính xác không: [Đúng/Sai — nếu sai ghi 1 câu phiên bản đúng]
- Đồng ý Resolution Confidence: [Có/Không — nếu không ghi mức đề xuất của bạn]
- Tổng kết: [1 câu verdict]
```

---

> Dán kết quả GPT vào đây:

**GPT CROSS-CHECK**
- Có lỗi đọc rule không: Có — Claude gán “Secondary source” là blog Cloudflare dù rule chỉ nói nguồn chính là thông tin chính thức từ Cloudflare và nguồn phụ chỉ nên dùng khi cần “a consensus of credible reporting”; ngoài ra edge case “11:59pm deadline — inclusive” là suy luận hợp lý nhưng không được rule nói nguyên văn. [cloudflarestatus](https://www.cloudflarestatus.com)
- Edge case Claude bỏ sót: Incident đã hết ảnh hưởng trước deadline nhưng chưa bị mark “Resolved” cho đến sau deadline thì phải là NO, vì rule chỉ cho incident resolved ngoài timeframe qualify nếu nó vẫn ongoing tại thời điểm market resolution. [cloudflarestatus](https://www.cloudflarestatus.com/history)
- Binary settlement chính xác không: Đúng một phần — bản đúng là YES nếu có ít nhất một incident được mark “Resolved” trong hoặc sau cutoff khi market bị kéo dài vì incident còn ongoing tại cutoff, và “first impact classification” sau khi resolved là Critical; còn lại là NO. [cloudflarestatus](https://www.cloudflarestatus.com/history)
- Đồng ý Resolution Confidence [High/Medium/Low]: Không — tôi đề xuất Medium, vì logic rule khá rõ nhưng một số diễn giải vận hành như cutoff end-of-day inclusive và cách đọc “first impact classification thereafter” vẫn có thể gây tranh cãi khi status page sửa log hoặc update chậm. [cloudflarestatus](https://www.cloudflarestatus.com)
- Tổng kết: Claude đọc đúng phần lõi của market, nhưng audit chưa chặt ở secondary source, chưa nêu rõ case “impact ended before cutoff but resolved after cutoff,” và hơi tự tin quá mức ở confidence. [cloudflarestatus](https://www.cloudflarestatus.com)

---

## Kết luận T2 (bạn tự điền sau khi đọc cả 2 output)

- **Resolution Confidence chốt:** `Medium`
  *(Claude đề xuất High, GPT downgrade xuống Medium — lý do: cutoff end-of-day inclusive và "first impact classification" timing vẫn có thể tranh cãi)*
- **Lưu ý đặc biệt cần nhớ:** `Edge case GPT bổ sung: Incident hết ảnh hưởng TRƯỚC deadline nhưng chưa mark "Resolved" cho đến SAU deadline → NO. Phải monitor trạng thái ongoing của incidents gần cutoff.`

---

# ✅ CHECKLIST ĐÓNG SESSION 1

- [ ] Full rule đã dán vào Bước 1
- [ ] Track T1 đã chốt
- [ ] Claude đã trả resolution audit đúng format
- [ ] GPT đã cross-check xong
- [ ] Resolution Confidence đã chốt

## 📋 COPY SANG SESSION 2

> Lấy đúng 3 thứ này, không lấy thêm:
> 1. Mục **BINARY SETTLEMENT** (YES nếu... / NO nếu...)
> 2. Bảng **EDGE CASES** đã điền
> 3. **Resolution Confidence** + lưu ý đặc biệt
