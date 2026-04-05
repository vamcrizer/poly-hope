# SESSION 4: MONITORING (Hàng ngày) — CF Critical Incident
> **Platform:** Perplexity · Mỗi lần tuần tra = Thread MỚI
> ⚠️ Không dùng lại thread cũ quá 15 turns

---

## Tần suất tuần tra:
- **April 30** (còn ~26 ngày): 2-3 lần/ngày
- **May 31** (còn ~57 ngày): 1-2 lần/ngày
- **June 30** (còn ~87 ngày): 1 lần/ngày

---

# T8: MỖI LẦN TUẦN TRA

## Bước 1 — Perplexity · Gemini 3.1 Pro · Thread MỚI

> Mở Perplexity → Thread mới → **Gemini 3.1 Pro** → Gửi prompt sau.
> Thay `___` bằng thông tin hiện tại của bạn:

---
**PROMPT MONITORING — Gemini:**

```
Tôi đang giữ vị thế kèo Cloudflare Critical Incident trên Polymarket.
P2 hiện tại của tôi: ___%
Market price hiện tại: ___¢
Thesis: ___[BUY YES/NO]___

Kiểm tra 5 thứ sau và trả lời theo đúng format:

**CLOUDFLARE STATUS (24h qua)**
- Có incident mới không: [Có/Không]
- Nếu Có: [Tên | Severity lúc xảy ra | Severity khi Resolved | Thời gian Resolved]

**TECH PRESS NEWS**
- Tin Cloudflare outage/incident mới nhất: [Tên tin | Source | Ngày | Tóm tắt 1 câu]
- Nếu không có tin mới: "Không có tin đáng kể"

**INTERNET/CDN LANDSCAPE**
- Sự cố nào đang ảnh hưởng CDN/backbone/DNS hôm nay: [Có/Không — nếu có mô tả ngắn]

**LEADING INDICATORS**
(Theo dõi: ___LEADING_INDICATORS_TỪ_FORCE_MAP_SESSION_2___)
- [Indicator 1]: [Status hôm nay]
- [Indicator 2]: [Status hôm nay]

**MARKET PRICE CHECK**
- Giá YES trên Poly hôm nay: ___¢ (bạn tự xem)
- So với ngày trước: [Tăng/Giảm/Ổn định]
- Pump/dump bất thường >10 điểm không có tin: [Có/Không]
```

---

> Dán kết quả Gemini vào log dưới.

---

## Bước 2 — Nếu Gemini tìm thấy tin đáng chú ý

> Chuyển dropdown sang **Claude Sonnet 4.6** trong cùng thread → Gửi:

---
**PROMPT CLASSIFY SIGNAL — Claude:**

```
Gemini phát hiện signal sau cho kèo CF Critical Incident:
[DÁN SIGNAL CỤ THỂ]

P2 hiện tại của tôi: ___%
Thesis: ___[BUY YES/NO]___
Kill switches: ___[DÁN 3 KILL SWITCHES TỪ SESSION 3]___

Phân loại và trả lời theo format:

**SIGNAL CLASSIFICATION**
- Loại: [Thesis-confirming / Thesis-damaging / Noise / Unknown-important]
- Lý do: [1 câu]

**UPDATE P2 (nếu cần)**
- Có nên update P2 không: [Có/Không]
- Nếu Có: LR class = [Weak/Moderate/Strong], log(LR) = [±X]
- P2 mới: ___%

**KILL SWITCH CHECK**
- Có trigger nào trong 3 kill switches bị kích hoạt không: [Có/Không]
- Nếu Có: Kill switch #[N] — hành động: [Thoát X%]

**KHUYẾN NGHỊ:**
- [Giữ nguyên / Update P2 / Kích hoạt kill switch / DỪNG — cần deep review]
```

---

> Dán kết quả Claude vào log.

---

## Log tuần tra (điền sau mỗi lần):

| Ngày/Giờ | Incident CF mới? | Signal phân loại | Log(LR) update | P2 mới | Hành động |
|---|---|---|---|---|---|
| `[ ]` | `[ Có/Không ]` | `[ Confirm/Damage/Noise/Unknown ]` | `[ +/-x ]` | `[ ]%` | `[ Giữ/Update/Thoát ]` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

> **⚠️ Manipulation Protocol:** Giá pump/dump >10 điểm mà không có tin → NGỒI YÊN 60 PHÚT. Không chase. Sau 60 phút source vẫn không đổi + giá thơm hơn → xem xét add Limit order.

---

# T9: POSTMORTEM (Sau khi kèo settle)

> Làm SAU KHI market closed và UMA phán quyết.
> Mở **Thread MỚI** trên Perplexity → **Claude Sonnet 4.6**

---
**PROMPT POSTMORTEM (thay `___`):**

```
Tôi vừa đóng kèo Polymarket: "Cloudflare Critical Incident by ___DEADLINE___"

OUTCOME:
- Market resolved: ___[YES/NO]___
- Tôi đặt: ___[BUY YES/BUY NO]___
- Entry price: ___¢
- P2 cuối cùng tôi tính: ___%
- P&L: ___[Lãi/Lỗ] $____
- Kill switch có bị kích hoạt không: ___[Có/Không]___

Hãy làm Postmortem theo format:

**POSTMORTEM — CF CRITICAL INCIDENT**

Brier Score: (P2_cuối - Outcome)² = (___% - [1 nếu YES, 0 nếu NO])² = ?

Kiểm tra Thesis:
- P1 có đúng (incident thật sự xảy ra không): [Có/Không]
- P2 có đúng (incident thỏa rule sàn không): [Có/Không]
- Nếu P1 đúng nhưng P2 sai: [Lý do — rule edge case nào đã "lật"?]

Failure Taxonomy (gạch vào loại lỗi chính, nếu lỗ):
- [ ] Lỗi Fact: đoán sai thực tế
- [ ] Lỗi Rule: đọc sai luật sàn T2
- [ ] Lỗi Timing: đúng hướng sai deadline
- [ ] Lỗi Sizing: nhồi quá to
- [ ] Lỗi Discipline: phá kill switch
- [ ] MM Manipulation: bị wash
- [ ] Thắng/Lỗ do may/rủi (base rate): không phải lỗi hệ thống

Bài học cụ thể (1 câu rule mới cho 50 kèo tới):
• "Từ nay, khi research CF incident, bắt buộc phải [...]"

Điểm chất lượng quyết định (không phụ thuộc P&L):
• Followd process: [Y/N]
• Kill switch discipline: [Y/N]
• Điểm tổng: [0-10]
```

---

> Dán kết quả Claude vào đây:

**[PASTE POSTMORTEM]**

**Rule mới rút ra:** `[ ]`

---

> **KẾT THÚC VÒNG ĐỜI KÈO** — Giữ file này vĩnh viễn cho Calibration Review sau 25 kèo.
