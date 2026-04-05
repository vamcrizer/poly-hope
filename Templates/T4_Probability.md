# T4: PROBABILITY ENGINE (ĐỘNG CƠ XÁC SUẤT BẢY LỖI)

**Mục đích:** Nghiêm cấm việc cộng trừ xác suất (%) bằng "Trực giác". Phải sử dụng Mô hình Log-odds Bayesian để đảm bảo mỗi thông tin mới đều đóng góp thay đổi niềm tin một cách có toán học, không làm bạn overreact.
🤖 **Model khuyên dùng:** **GPT-5.4 Thinking** (Chính) cho phần tính toán Bayesian (math accuracy). Claude hỗ trợ Sanity check.
🔄 **Session Routing:** Mở thẻ mới: **Session 3 (Price and decide)**. DÁN Resolution + Tóm tắt Signal Matrix (Đã score) từ Session 2 sang. Chạy chung với T5 và đặc biệt là T6 (chống overreact/anchoring).

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Phân rã Sự kiện (P1 $\neq$ P2):** Định hình trong đầu về Sự kiện ngoài đời ($P_1$) và Sự kiện thỏa điều kiện sàn quy định ($P_2$). *Ví dụ: $P_1$ OpenAI ra model mới là 90%, nhưng $P_2$ ra ĐÚNG TÊN model Sàn ghi là 70%. LUÔN trade theo $P_2$.*
2. **Setup Khởi điểm:** Căn cứ vào trạng thái hiện hữu, cho 1 $P_2$ Prior (Xác suất tiên nghiệm = niềm tin ban đầu của bạn trước khi cày Research T3). Tra Bảng Log-odds để ra con số thô.
3. **Tra cứu Bảng LR & Cập nhật:** Lấy các dòng ở bước 3.2, ứng với nhãn LR (Weak, Strong, ...), tra ra điểm `log(LR)` (Ví dụ Strong Bullish = +0.69). Cộng dồn các `log(LR)` vào Khởi điểm.
4. **Hãm Phanh:** Tính tổng tuyệt đối của các `log(LR)` tham gia hôm nay. NẾU $> 2.5$, nghĩa là bạn vừa Update đổi trắng thay đen quá đà $\rightarrow$ Rủi ro overreact. Bắt buộc DỪNG và "sleep on it", hôm sau coi lại.
5. **Tính Edge:** Chuyển Hậu nghiệm (Posterior $P_2$) ngược về phần trăm. So sánh mộc với giá trị Market đang chào bán. Trừ vẹt đi khoản phí và Spread. Nếu nhỉnh hơn $\geq 3\%$ $\rightarrow$ Xuống phần T5.

**Bảng tra đổi Log-odds nhanh:**
- 10% = -2.20 | 20% = -1.39 | 30% = -0.85 | 40% = -0.41 | 50% = 0.00
- 60% = +0.41 | 70% = +0.85 | 80% = +1.39 | 90% = +2.20

**Bảng `log(LR)` cơ mẫn:**
- Rất yếu (tier 1-2 nhỏ) = $+/- 0.10$
- Yếu = $+/- 0.22$
- Vừa phải (tier 3 / counter cứng) = $+/- 0.41$
- Mạnh (tier 4-5) = $+/- 0.69$
- Phán Quyết = $+/- 1.61$

---
## PHẦN 2: TEMPLATE ĐIỀN

**4.1 ĐỊNH VỊ NHẬN THỨC BAN ĐẦU:**
- $P_1$ (Thực tế): `[ ]%`
- $P_2$ (Luật Sàn): `[ ]%` *(Rule Check: P2 phải $\leq$ P1)*

**4.2 BẢNG BAYESIAN UPDATE CÂN NÕ:**
- Xác suất Prior $P_2$: `[ ]%` $\rightarrow$ Prior Log-odds: `[ ]`

| Lần Cập nhật | Tin tức (Signal) / Cấp độ đanh thép | LR Class | Hệ số log(LR) | Cộng dồn Log-odds | P2 Implied (%) |
|---|---|---|---|---|---|
| 0 | Vị thế sơ khởi | --- | --- | `[Prior Log-odds]` | `[Prior P2]` |
| 1 | `[...]` | `[VD: Strong Bull]` | `[+0.69]` | `[...]` | `[...]` |
| 2 | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |
| 3 | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |

**4.2B NHẬP LIỆU LỰC ÉP INTERACTION (Từ Force Map T3):**
*Có sự cộng hưởng lực nào tạo ra Exponential Threat (Đe dọa cấp số nhân) không?*
- Sự kiện A (`[...]`) + Sự kiện B (`[...]`) = Kéo theo `[Rush / Delay / Hủy]`.
- => Nếu rủi ro Interaction này $\geq$ Medium $\rightarrow$ **Phạt/Thưởng (Adjust)** thêm log-odds vào Tổng Bayesian: `[ +/- ... ]`

**Kiểm Tra An Toàn (Anti-Overreaction):**
- Tổng |log(LR)| (không âm) phiên này: `[ ]` (Có vượt mức 2.5 chặn ngáo không? `[Y/N]`)
- **TỔNG HẬU NGHIỆM TỐI HẬU HÔM NAY (Posterior P2):** `[  ]%`

**4.3 ĐO MAX-EDGE & TÍNH TOÁN CẮT CỨA MÁU:**
- $P_3$ Giá Orderbook mua ngay lúc này: `[ ]%` (Penny)
- Edge Thô (|$P_2$ - $P_3$|): `[ ]%`
- Ước tính Tiêu hao Cắt Máu (Spread + Phí giao dịch + Slippage): `[ ]%`
- **EDGE THỰC CHIẾN:** `[ ]%`
- Bật đèn Xanh $\geq 3\%$? `[ YES / BỎ KÈO ]`
