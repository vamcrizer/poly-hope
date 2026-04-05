# SESSION 3: PRICE AND DECIDE — CF Critical Incident
> **Platform:** Perplexity · Switch model ở dropdown
> ⚠️ Tạo **Thread MỚI** — không dùng thread Session 1 hay 2
> 🛡️ Lý do: Claude chưa bị anchored bởi raw evidence → T6 phản biện sắc hơn hẳn

---

## Bước 0 — Mồi context: Perplexity · GPT-5.4 Thinking · Thread MỚI

> 1. Mở Perplexity → Bấm **"New Thread"** (thread hoàn toàn mới)
> 2. Chọn model: **GPT-5.4 Thinking**
> 3. Soạn tin nhắn dưới đây:
>    - Phần Rule đã điền sẵn
>    - Phần **TÓM TẮT SESSION 2** → copy từ ô dán cuối cùng của SESSION2_T3.md
> 4. Gửi:

```
Ghi nhận context cho phiên tính xác suất. Chỉ xác nhận "Đã ghi nhận", không trả lời gì thêm:

KÈO: Cloudflare Critical Incident by April 30 / May 31 / June 30 (Polymarket)

RULE:
- YES khi: Ít nhất 1 incident trên cloudflarestatus.com được mark "Resolved" VÀ classification tại thời điểm Resolved là Critical (đỏ)
- NO khi: Incident downgraded khi resolved; không có incident resolved trong window; incident hết ảnh hưởng trước deadline nhưng chưa Resolved

RESEARCH SUMMARY (copy từ Bước 6 của SESSION2_T3.md):
↓↓↓ DÁN TÓM TẮT SESSION 2 VÀO ĐÂY ↓↓↓


↑↑↑ HẾT TÓM TẮT ↑↑↑

GIÁ MARKET HIỆN TẠI: April 30 = 34¢ / May 31 = 55¢ / June 30 = 68¢
```

---

---

# T4: PROBABILITY ENGINE

## Perplexity · GPT-5.4 Thinking · Cùng thread Session 3

---
**PROMPT T4 — Bayesian:**

> Trước khi gửi prompt này, điền **1 con số** vào ô bên dưới:
>
> **Base rate từ Session 2 (số Critical incidents / năm):** `[ điền vào đây ]`
>
> Sau đó thay số đó vào 2 chỗ có `[BASE_RATE]` trong prompt, rồi gửi:

```
Tính xác suất Bayesian cho kèo Cloudflare Critical Incident.

BASE RATE: CF gặp ~[BASE_RATE] Critical incidents / năm.

BƯỚC 1 — Tính Prior P2 bằng Poisson
λ = [BASE_RATE] / 365 incidents/ngày
P(≥1 incident trong t ngày) = 1 - e^(-λ×t)

Tính cho:
- April 30: t = 26 ngày
- May 31: t = 57 ngày
- June 30: t = 87 ngày

Điều chỉnh Prior xuống vì P2 < P1: nhân thêm hệ số = 0.75 (vì rule đòi hỏi classified đỏ KHI resolved, không phải lúc xảy ra → một số incidents sẽ bị hạ cấp khi resolved).
→ Prior P2 = Prior P1 × 0.75

BƯỚC 2 — Bayesian Update với signals sau:
___TOP_3_SIGNALS_VÀ_LR_TỪ_SESSION_2___

Bảng log(LR):
Very Weak = ±0.10 | Weak = ±0.22 | Moderate = ±0.41 | Strong = ±0.69 | Very Strong = ±1.10

Cho mỗi deadline:
1. Prior P2 → Log-odds (dùng công thức ln(p/(1-p)))
2. Cộng log(LR) từng signal
3. Posterior Log-odds → Posterior P2 (dùng e^x/(1+e^x))

BƯỚC 3 — Tính Edge
Edge = |Posterior P2 - Giá market| - 3%
(3% là buffer cho spread + phí + sai số)

Trả lời theo ĐÚNG format sau, không viết thêm gì ngoài format:

**BẢNG BAYESIAN — CF CRITICAL INCIDENT**
| Deadline | Prior P1 | Prior P2 (×0.75) | Prior Log-odds | Sau Signal Update | Posterior P2 | Market Price | Edge thô | Edge sau 3% | Đáng trade? |
|---|---|---|---|---|---|---|---|---|---|
| April 30 | ?% | ?% | ? | ? | ?% | 34% | ?% | ?% | YES/BỎ |
| May 31 | ?% | ?% | ? | ? | ?% | 55% | ?% | ?% | YES/BỎ |
| June 30 | ?% | ?% | ? | ? | ?% | 68% | ?% | ?% | YES/BỎ |

**BẢNG UPDATE CHI TIẾT (cho 1 deadline tôi muốn trade nhất)**
| Lần | Signal | LR class | log(LR) | Log-odds cộng dồn | P2 tạm |
|---|---|---|---|---|---|
| 0 | Prior | — | — | ? | ?% |
| 1 | [signal 1] | [class] | [±x] | ? | ?% |
| 2 | [signal 2] | [class] | [±x] | ? | ?% |
| 3 | [signal 3] | [class] | [±x] | ? | ?% |

**ANTI-OVERREACTION:** Tổng |log(LR)| = ? → Vượt 2.5? [Y/N]

**KẾT LUẬN T4:**
- Deadline đáng trade nhất: [April/May/June]
- Chiều: [BUY YES / BUY NO]
- Posterior P2: ?%
- Edge sau phí: ?%
```

---

> Dán kết quả GPT vào đây (cả 2 bảng):

**[PASTE BẢNG BAYESIAN ĐẦY ĐỦ]**

---

## Bổ sung Interaction Effect (nếu có từ Force Map Session 2)

> Vẫn GPT, gửi thêm nếu Force Map có Interaction Effects:

---
**PROMPT INTERACTION (chỉ gửi nếu có interaction từ Session 2):**

```
Force Map phát hiện interaction effect: ___INTERACTION_FROM_SESSION_2___

Với Posterior P2 vừa tính cho [deadline], interaction này có đáng điều chỉnh thêm log-odds không?
Nếu medium/high risk: đề xuất adjust thêm bao nhiêu log-odds? Tính P2 mới sau điều chỉnh.

Trả lời:
**INTERACTION ADJUSTMENT**
- Interaction: [mô tả]
- Mức độ rủi ro: [Low/Medium/High]
- Adjust log-odds: [+/- X]
- P2 sau điều chỉnh: ?%
```

---

> Dán kết quả vào đây:

**[PASTE INTERACTION ADJUSTMENT — hoặc ghi "Không có interaction đáng kể"]**

---

# T5: RISK & SIZING

## Perplexity · GPT-5.4 Thinking · Cùng thread Session 3

> **Bạn tự điền Tham số tài khoản trước**, rồi gửi prompt:

**Tham số tài khoản của bạn:**
- 1 Unit = `$[ ]`
- Bankroll hiện tại = `$[ ]`
- Vị thế đang mở (nếu có) = `[ ]`

---
**PROMPT T5 (thay `___`):**

```
Sizing cho kèo CF Critical Incident.

KẾT QUẢ T4:
- Deadline focus: ___[April/May/June]___
- Chiều: ___[BUY YES / BUY NO]___
- Edge sau phí: ___%
- Resolution Confidence từ T2: ___[High/Medium/Low]___

TÀI KHOẢN:
- 1 Unit = $___
- Bankroll = $___
- Vị thế đang mở: ___

Tra bảng sizing:
| Edge | Confidence | Size |
| 3-6% | High | 0.5 unit |
| 3-6% | Medium | 0.25 unit |
| 7-12% | High | 1 unit |
| 7-12% | Medium | 0.5 unit |
| 13-20% | High | 2 units |
| >20% | High | 3 units |

Hard caps: Không vượt 3 units/kèo, không vượt 3% bankroll/kèo, không vượt 15% tổng exposure.

Trả lời theo format:

**KẾT QUẢ SIZING**
- Size đề xuất: [X] units = $[Y]
- Hard cap check (3 units): [OK/VI PHẠM]
- Hard cap check (3% bankroll): [OK/VI PHẠM — tính $X / $bankroll]
- Size sau hard cap: [X] units = $[Y]

**CORRELATION BUCKET CHECK**
- Kèo này thuộc bucket: [Internet infrastructure / CDN]
- Exposure hiện tại bucket này: $[Z] (bao gồm các kèo đang mở nào?)
- Exposure sau khi thêm kèo này: $[Z+Y] → Còn trong giới hạn 8%? [OK/VI PHẠM]

**CHIẾN THUẬT ENTRY**
- Order type: [Limit / Market]
- Giá Limit đề xuất: [?¢] (vì sao?)
- Có nên chia nhỏ entry không: [Có/Không — lý do]

**KILL SWITCHES — viết 3 trigger cụ thể observable:**
| # | Trigger (event có thể quan sát) | Hành động | Deadline phản ứng |
|---|---|---|---|
| 1 | CF thay đổi severity classification policy trên status page | Thoát 100% | Ngay khi thấy |
| 2 | [BẠN ĐIỀN dựa trên research] | [Thoát X%] | [Trong Y giờ] |
| 3 | [BẠN ĐIỀN] | [Thoát X%] | [Trong Y giờ] |
```

---

> Dán kết quả GPT vào đây:

**[PASTE KẾT QUẢ SIZING + KILL SWITCHES]**

---

# T6: ANTI-BIAS GATE

## Perplexity · Claude Sonnet 4.6 · Cùng thread Session 3

> Chuyển dropdown sang **Claude Sonnet 4.6** → Gửi:

---
**PROMPT T6 — Devil's Advocate (thay `___`):**

```
Tôi sắp đặt kèo Polymarket: Cloudflare Critical Incident.

THESIS CỦA TÔI:
- Chiều: ___[BUY YES/NO]___
- Deadline: ___
- P2 tôi tính: ___%
- Edge: ___%
- Size: ___ units

Đóng vai Luật sư Ác quỷ. Nhiệm vụ: CÃI ngược lại thesis của tôi. Không được đồng ý. Phải tìm lỗ hổng THẬT, không phải giả vờ phản biện cho có.

Trả lời theo format:

**DEVIL'S ADVOCATE — CF CRITICAL INCIDENT**

3 lý do mạnh nhất thesis SAI:
1. [Lý do cụ thể, không chung chung]
2. [...]
3. [...]

Kịch bản resolve NGƯỢC dù thực tế đúng:
• [VD: CF bị sập nặng toàn cầu nhưng classified Major khi resolved → Market NO dù event xảy ra]

Trigger cụ thể khiến tôi phải FLIP sang chiều ngược:
• Observable event: [...]

Pre-mortem (3 tuần sau thua nặng, lý do khả năng nhất):
• [...]

Đánh giá meta-bias:
• [Thesis có đang bị anchored bởi base rate mà bỏ qua classification gaming risk không?]
• [Y/N — giải thích]

Verdict trung thực:
• Điểm mạnh thesis: [...]
• Điểm yếu cốt tử: [...]
• Khuyến nghị (gửi không nể tình): [Nên trade / Giảm size / Bỏ kèo này]
```

---

> Đọc kết quả Claude → Đánh giá nghiêm túc → Dán kết quả + quyết định của bạn:

**[PASTE KẾT QUẢ CLAUDE DEVIL'S ADVOCATE]**

**Quyết định sau khi đọc Claude:**
- `[ Giữ nguyên — vì: ... ]`
- `[ Điều chỉnh P2/Size — vì: ... ]`
- `[ BỎ KÈO — vì: ... ]`

**Tuyên thệ commit:**
> "Tôi sẽ THOÁT vị thế nếu `[TRIGGER CỤ THỂ]` xảy ra, bất chấp lúc đó tôi đang cảm thấy thế nào."

---

# ✅ CHECKLIST ĐÓNG SESSION 3

- [ ] GPT đã tính Bayesian đầy đủ 3 deadline
- [ ] Edge > 3% ít nhất 1 deadline
- [ ] Interaction effect đã check
- [ ] Sizing + Hard cap OK
- [ ] Kill Switches đã viết (3 triggers cụ thể)
- [ ] Claude đã phản biện xong
- [ ] Tuyên thệ đã viết

## QUYẾT ĐỊNH CUỐI CÙNG:

| Deadline | Trade? | Chiều | Size | Giá Limit Entry | Kill Switch #1 |
|---|---|---|---|---|---|
| April 30 | `[ Y/N ]` | `[ YES/NO ]` | `[ ] units` | `[ ]¢` | `[ ]` |
| May 31 | `[ Y/N ]` | `[ YES/NO ]` | `[ ] units` | `[ ]¢` | `[ ]` |
| June 30 | `[ Y/N ]` | `[ YES/NO ]` | `[ ] units` | `[ ]¢` | `[ ]` |

> ➡️ Xong → Mở Polymarket → Đặt Limit Order → Ghi biên bản T7
> ➡️ Sau khi entry → Mở SESSION 4 để monitoring
