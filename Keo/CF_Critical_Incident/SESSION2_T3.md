# SESSION 2: GATHER EVIDENCE — CF Critical Incident
> **Platform:** Perplexity · Switch model ở dropdown trong cùng thread
> ⚠️ Tạo **Thread MỚI** — không dùng thread Session 1

---

## Bước 0 — Mồi context

> 1. Mở Perplexity → Bấm **"New Thread"** (thread hoàn toàn mới)
> 2. Chọn model: **Gemini** (dropdown ở góc trên ô nhập)
> 3. Copy toàn bộ block dưới → Paste vào Perplexity → Gửi:

```
Tôi đang research kèo Polymarket. Hãy ghi nhận context sau, chỉ xác nhận "Đã ghi nhận":

KÈO: Another critical Cloudflare incident by deadline (April 30 / May 31 / June 30 2026)

RULE (đã phân tích xong):
- YES khi: Ít nhất 1 incident trên cloudflarestatus.com được mark "Resolved" VÀ classification tại thời điểm Resolved là Critical (đỏ)
- NO khi: Incident chỉ Critical lúc ongoing nhưng bị hạ cấp khi resolved; hoặc không có incident nào resolved trong window; hoặc incident hết ảnh hưởng trước deadline nhưng chưa được mark Resolved

CÁC BẪY QUAN TRỌNG:
- Sub-service bị Critical (VD: Workers) dù main CDN ok → vẫn YES
- Incident resolved đúng 11:59pm ET ngày deadline → vẫn YES (inclusive)
- CF không thể đổi classification sau khi resolved (first classification là final)
- Incident hết ảnh hưởng TRƯỚC deadline nhưng chưa mark Resolved đến SAU deadline → NO

RESOLUTION CONFIDENCE: Medium
```

> Đợi Gemini xác nhận "Đã ghi nhận" → tiếp bước 1.

---

## Bước 1 — Quét lịch sử incidents (quan trọng nhất)

> Vẫn Gemini, **cùng thread** → Copy block dưới → Paste → Gửi:

```
Vào https://www.cloudflarestatus.com/history và tìm tất cả incidents Cloudflare trong 12 tháng gần nhất (tháng 4/2025 đến tháng 4/2026).

Trả lời theo đúng format sau:

**LỊCH SỬ CLOUDFLARE INCIDENTS**
| Ngày | Tên incident | Severity khi Resolved | Thời gian Resolved |
|---|---|---|---|
| [ngày] | [tên] | [Critical/Major/Minor] | [HH:MM timezone] |
(liệt kê HẾT, không bỏ sót)

**THỐNG KÊ**
- Tổng incidents được classified Critical (đỏ) khi Resolved trong 12 tháng: [số]
- Tổng trong 6 tháng gần nhất: [số]
- Tổng trong 3 tháng gần nhất: [số]
- Incident Critical gần nhất: [ngày — tên — mô tả 1 câu]
- Khoảng cách trung bình giữa 2 Critical incident liên tiếp: [X ngày]
- CF có xu hướng downgrade severity khi resolved không: [Có/Không — dẫn ví dụ cụ thể]
```

> Khi Gemini trả lời xong → Dán kết quả vào đây:

---
**[DÁN BẢNG LỊCH SỬ VÀO ĐÂY]**

---

## Bước 2 — Quét 5 bucket còn lại

> Vẫn Gemini, **cùng thread** → Copy block dưới → Paste → Gửi:

```
Tiếp tục research Cloudflare. Với mỗi bucket bên dưới, trả lời 2-3 dòng ngắn gọn và ghi rõ nguồn:

**BUCKET 2 — CF Engineering / Infra hiện tại**
CF đang deploy migration, thay đổi architecture, hay hạ tầng mới nào? Nguồn chính: blog.cloudflare.com

**BUCKET 3 — External dependencies**
Tình trạng upstream providers của CF: Tier-1 ISPs, DNS root servers, peering points. Có bất thường gì gần đây không?

**BUCKET 4 — Đối thủ CDN**
Akamai, Fastly, AWS CloudFront có outage lớn gần đây không? Ngành CDN đang ổn hay đang "mùa sập"?

**BUCKET 5 — Social / Community**
Reddit (r/sysadmin, r/cloudflare), Hacker News — có phàn nàn gì về CF reliability gần đây không?

**BUCKET 6 — DDoS landscape**
Có botnet mới, record attacks, hay tần suất tấn công DDoS đang tăng/giảm không?

**RELATED MARKETS TRÊN POLYMARKET**
Tìm các kèo liên quan "Cloudflare" hoặc "internet outage" trên Polymarket. Ghi tên kèo + giá hiện tại + có gì đáng chú ý không.
```

> Khi Gemini trả lời xong → Dán kết quả vào đây:

---
**[DÁN 5 BUCKET + RELATED MARKETS VÀO ĐÂY]**

---

## Bước 3 — Yêu cầu Gemini tóm tắt trước khi chuyển model

> Vẫn Gemini, **cùng thread** → Copy block dưới → Paste → Gửi:

```
Tóm tắt lại toàn bộ thông tin bạn vừa tìm được thành 8-10 bullet points theo format:
• [Fact ngắn gọn] — Nguồn: [tên nguồn]

Chỉ viết facts có nguồn. Không thêm nhận xét hay suy diễn.
```

> Khi Gemini trả lời xong:
> 1. **Đọc kỹ 8 bullets**
> 2. **Copy toàn bộ phần bullets đó**
> 3. Dán vào đây để lưu:

---
**[DÁN 8 BULLETS CỦA GEMINI VÀO ĐÂY]**

---

## Bước 4 — Chuyển sang Claude để chấm Signal Matrix

> 1. **Chuyển dropdown model sang Claude** (trong cùng thread)
> 2. Soạn prompt dưới đây:
>    - Phần đầu đã điền sẵn
>    - Phần `↓↓↓ DÁN VÀO ĐÂY ↓↓↓` → bạn dán 8 bullets của Gemini từ bước 3 vào
> 3. Gửi toàn bộ:

```
Tôi đang đánh kèo Polymarket: "Cloudflare Critical Incident resolved trước deadline".
Rule: YES chỉ khi incident được classified Critical (đỏ) TẠI THỜI ĐIỂM resolved — không phải lúc đang xảy ra.

Gemini vừa tìm được các facts sau:

↓↓↓ (8 BULLETS CỦA GEMINI NẰM Ở ĐÂY — PASTE VÀO) ↓↓↓



↑↑↑ HẾT BULLETS ↑↑↑

Chấm vào Signal Matrix. Trả lời ĐÚNG format bảng markdown sau, không thêm chú thích ngoài bảng:

| # | Signal | Nguồn | Tier | Reliability (1-5) | Relevance (1-5) | Counter-view (1 câu) | Counter quality | LR Label |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
| 5 | | | | | | | | |

Thang Tier: 1=Status page/blog chính thức CF, 2=Major press (Reuters/Verge), 3=Community có corroboration, 4=Unverified social
Thang Reliability: 5=Official primary, 4=Major reputable, 3=Nhiều nguồn khớp, 2=Anecdote, 1=Tin rác
Thang Relevance: 5=Trực tiếp settle market, 4=Thay đổi trực tiếp P2, 3=Ảnh hưởng P1 chưa chạm rule, 2=Narrative, 1=Noise
LR Label: Very Weak / Weak / Moderate / Strong — Bullish (thiên YES có incident) hoặc Bearish

Sau bảng, thêm:
**TOP 3 SIGNALS QUYẾT ĐỊNH NHẤT:**
1. [...]
2. [...]
3. [...]

**TỔNG HƯỚNG EVIDENCE:** [Bullish / Bearish / Neutral] — [1 câu lý do]
```

> Khi Claude trả lời xong → Dán kết quả vào đây:

---
**[DÁN SIGNAL MATRIX + TOP 3 + TỔNG HƯỚNG VÀO ĐÂY]**

---

## Bước 5 — Force Map (vẫn Claude, cùng thread)

> Copy block dưới → Paste → Gửi:

```
Làm Force Map cho kèo này. Chủ thể: "≥1 incident Critical (đỏ) trên cloudflarestatus.com, được resolved trước deadline".

Chỉ điền lực đang CÓ SIGNAL thực tế từ data vừa research. Trả lời đúng format bảng:

**VÒNG 1 — NỘI SINH (bên trong Cloudflare)**
| Lực | Signal quan sát được | Hướng (Bull=dễ có incident / Bear=khó) | Trễ đến chủ thể | Reliability |
|---|---|---|---|---|

**VÒNG 2 — TRUNG GIAN (hệ sinh thái CF phụ thuộc)**
| Lực | Signal quan sát được | Hướng | Trễ | Reliability |
|---|---|---|---|---|

**VÒNG 3 — NGOẠI SINH (môi trường rộng)**
| Lực | Signal quan sát được | Hướng | Trễ | Reliability |
|---|---|---|---|---|

**GATE FORCES**
- Gate 1: [lực nào nếu "bật" thì gần chắc có Critical incident] ← phụ thuộc vào: [điều kiện trigger]
- Gate 2: [hoặc "Chỉ xác định được 1 gate force"]

**LEADING INDICATORS cần theo dõi ở T8:**
- [Chỉ báo 1 — link cụ thể hoặc keyword cần watch]
- [Chỉ báo 2]

**INTERACTION EFFECTS:**
- [Lực A] + [Lực B] → [Rủi ro kết hợp lớn hơn tổng — ghi chú cho T4]
```

> Dán kết quả vào đây:

---
**[DÁN FORCE MAP VÀO ĐÂY]**

---

## Bước 6 — Claude tóm tắt để mang sang Session 3 (vẫn cùng thread)

> Copy block dưới → Paste → Gửi:

```
Tóm tắt findings của toàn bộ session này theo ĐÚNG format sau. Tôi sẽ copy phần này sang thread khác:

**TÓM TẮT SESSION 2 — CF CRITICAL INCIDENT**

Base rate:
• CF gặp ~[X] Critical incidents / năm → trung bình 1 incident mỗi [Y] ngày

Top 3 signals quyết định nhất:
1. [Mô tả signal] — LR Label: [Very Weak/Weak/Moderate/Strong Bullish/Bearish]
2. [...]
3. [...]

Top 2 counter-risks nguy hiểm nhất:
1. [...]
2. [...]

Gate force cần monitor:
• [Tên lực] → theo dõi tại: [link hoặc nguồn cụ thể]

Interaction effect cần đưa vào T4:
• [Lực A] + [Lực B] → [Tác động tổng hợp]

Hướng evidence tổng thể: [Bullish / Bearish / Neutral] cho thesis YES
```

> Dán kết quả vào đây:

---
**[DÁN TÓM TẮT VÀO ĐÂY — ĐÂY LÀ THỨ BẠN COPY SANG SESSION 3]**

---

# ✅ Checklist trước khi đóng Session 2

- [ ] Bước 1: Bảng lịch sử incidents đã dán
- [ ] Bước 2: 5 bucket đã dán
- [ ] Bước 3: 8 bullets Gemini đã dán
- [ ] Bước 4: Signal Matrix Claude đã dán
- [ ] Bước 5: Force Map đã dán
- [ ] Bước 6: Tóm tắt đã dán

## Sang Session 3, bạn cần mang theo đúng 2 thứ:

> **Thứ 1:** Tóm tắt ở Bước 6 (copy từ ô dán phía trên)
> **Thứ 2:** Binary Settlement từ Session 1:
> - YES khi: *Ít nhất 1 incident resolved VÀ classified Critical (đỏ) tại thời điểm Resolved*
> - NO khi: *Incident downgraded khi resolved; hoặc không có incident resolved trong window; hoặc impact ended trước deadline nhưng chưa Resolved*
