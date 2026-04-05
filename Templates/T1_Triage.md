# T1: TRIAGE (BỘ LỌC CƠ HỘI)

**Mục đích:** Tài nguyên não bộ là hữu hạn. T1 giúp bạn chỉ tập trung research vào các kèo đáng đánh và xác định nên "khoét sâu" đến mức nào.
🤖 **Model khuyên dùng:** GPT-5.4 (Tắt Thinking) để đọc lướt và tính điểm sơ bộ với tốc độ cao nhất.
🔄 **Session Routing:** Đặt trong **Session 1 (Lock the rules)** cùng với T2. Dùng chung Thead này cho T1 và T2. Tuyệt đối không chèn Link/Báo chí Research vào Session này để tránh Bias đầu vào.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Thu thập bề mặt:** Mở trang market trên Polymarket. Nhìn lướt qua Rule (Chưa đọc kỹ), Volume thanh khoản, Orderbook (độ rộng Spread).
2. **Chấm điểm thô:** Đọc mục Tiêu chí ở Phần 2. Với mỗi tiêu chí, tự cho điểm theo thang (0, 1, 2) dựa trên barem định nghĩa.
3. **Kiểm tra Override Rules (Điều kiện tử thần):** Nếu có bất kỳ tiêu chí nào (Rule, Edge, Liquidity) bị điểm 0, lập tức VỨT BỎ KÈO NÀY. Không cần tiếc.
4. **Nhân trọng số & Quy đổi:** Tính Tổng Điểm Thô = Mức điểm x Trọng số của từng dòng cộng lại (Max 16). Sau đó nhân chéo quy thành phần trăm.
5. **Gắn nhãn độ sâu (Track):**
   - `< 45%`: Bỏ kèo.
   - `45 - 64%`: **Light Track**. Chỉ được research lướt (T3a), đánh Size nhỏ. Mất khoảng 20p.
   - `65 - 79%`: **Standard Track**. Làm bình thường. Mất 1-3 tiếng.
   - `\geq 80%`: **Deep Track**. Kèo tiềm năng siêu cao. Làm Full Research (T3b) và yêu cầu đập phản biện. Mất 3-8 tiếng.

---
## PHẦN 2: TEMPLATE ĐIỀN

**CHẤM ĐIỂM (Barem):**
- **Rule Clarity:** 0 (Mơ hồ/Chưa nguồn) | 1 (Hiểu nhưng có cấn) | 2 (Rõ như ban ngày, nguồn official).
- **Prelim Edge:** 0 (Chưa thấy lí do market sai) | 1 (Có Thesis mơ hồ) | 2 (Market lệch rõ với evidence đang có).
- **Liquidity:** 0 (Spread >5% hoặc depth nhỏ) | 1 (Spread 2-5%) | 2 (Spread <2%, depth >$5k).
- **Time Left:** 0 (<24h hoặc >6 tháng khó lường) | 1 (1-14 ngày, có catalyst rõ) | 2 (2-8 tuần, đủ update thesis).

| Tiêu chí | Điểm (0-2) | Trọng số | Tích (Điểm x Trọng) | Override Check (Chặn bỏ kèo) |
|---|---|---|---|---|
| Rule Clarity | `[ ]` | x3 | `[ ]` | Điểm 0? `[Y/N]` $\rightarrow$ `[Bỏ?]` |
| Prelim Edge | `[ ]` | x2 | `[ ]` | Điểm 0? `[Y/N]` $\rightarrow$ `[Bỏ?]` |
| Liquidity | `[ ]` | x2 | `[ ]` | Điểm 0? `[Y/N]` $\rightarrow$ `[Bỏ?]` |
| Time Left | `[ ]` | x1 | `[ ]` | |
| **Tổng Thô / 16** | | | **`[  ]` / 16** | Bị Override? `[Y/N]` |

**KẾT LUẬN T1:**
- Điểm quy đổi: `[ ] / 100` (%)
- Hành động kế tiếp (Track): `[ BỎ / LIGHT / STANDARD / DEEP ]`
