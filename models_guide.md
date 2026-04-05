# Perplexity Model Routing Guide cho Polymarket Framework

## Tóm tắt thế mạnh từng model

Dựa trên benchmark, so sánh thực chiến, và đặc thù từng model tính đến tháng 4/2026:

### GPT-5.4 Thinking

**Thế mạnh cốt lõi:** professional knowledge work, factual accuracy, structured reasoning dưới constraint.

- Giảm 33% lỗi factual so với GPT-5.2 — ít hallucinate nhất trong ba model khi xử lý câu hỏi có đáp án đúng/sai rõ ràng.
- Mạnh nhất về professional workflow: bảng tính, slide, phân tích tài chính, mô hình pháp lý. GDPval 83% — cao nhất.
- 1M token context window — đủ nạp cả codebase hoặc bộ tài liệu dày.
- Upfront planning: cho thấy kế hoạch suy nghĩ trước khi trả lời, bạn có thể điều chỉnh giữa chừng.
- Tốc độ phản hồi nhanh nhất trong ba model ở cùng mức chất lượng.
- Yếu: chất lượng viết "generic" nếu không cho style guidance cụ thể; context quality giảm rõ khi đẩy sát giới hạn.

### Gemini 3.1 Pro

**Thế mạnh cốt lõi:** abstract reasoning, multimodal, long-context research, cost efficiency.

- GPQA Diamond 94.3% — dẫn đầu về scientific reasoning ở mức PhD-level. ARC-AGI-2 77.1% — abstract reasoning mạnh nhất.
- Multimodal thật sự: xử lý text + image + audio + video trong cùng 1 prompt — model duy nhất làm được điều này ở mức native.
- Context window lớn nhất (lên đến 2M token trong API), hiệu quả cao khi xử lý tài liệu dài.
- Rẻ nhất: $2/$12 per MTok — rẻ hơn GPT-5.4 khoảng 20% và rẻ hơn Claude Opus 7.5x.
- Thought signatures giữ liên tục reasoning state qua multi-turn tool use — ưu thế kiến trúc so với hai model kia.
- Yếu: viết dài kém; khi prompt mơ hồ hay commit sai hướng rồi chạy tiếp; trích dẫn chi tiết từ tài liệu dài đôi khi lẫn lộn.

### Claude Sonnet 4.6

**Thế mạnh cốt lõi:** instruction following, nuanced writing, structured analysis, coding discipline.

- Instruction-following tốt nhất: cho prompt hệ thống phức tạp với 15 constraint thì Claude tuân thủ hết, GPT và Gemini "quên" constraint.
- Chất lượng viết cao nhất: prose tự nhiên, giữ giọng văn nhất quán qua tài liệu dài, xử lý nuance và humor tốt.
- SWE-bench 79.6% — code clean, well-commented, gần Opus-tier.
- Ít hallucinate tự tin nhất — khi không biết thường nói thẳng thay vì bịa.
- Office/finance work: 1633 Elo GDPval-AA, 63.3% Finance Agent — dẫn đầu cả Opus 4.6.
- 1M token context + context compaction tự động.
- Yếu: đôi khi "sáng tạo quá" trong marketing copy — vượt guardrail nhẹ; không có native multimodal audio/video.

---

## Mapping model → Framework layer

### T0: Readiness Gate
**Không cần model.** Đây là self-check 4 câu hỏi. Dùng giấy hoặc note app.

### T1: Triage
**Model khuyên dùng: bất kỳ model nào đang mở** — triage chỉ cần đọc nhanh market page + ước lượng 4 biến. Không cần model mạnh.

Nếu phải chọn: **GPT-5.4** vì tốc độ nhanh nhất, phù hợp cho scan nhanh nhiều kèo liên tiếp.

### T2: Resolution Audit

**Model chính: Claude Sonnet 4.6**

Lý do: Resolution audit yêu cầu đọc rule chính xác từng chữ, xác định edge cases, viết binary settlement statement, và liệt kê what counts / what doesn't count. Đây là bài toán instruction-following + structured analysis thuần túy.

- Claude tuân thủ constraint phức tạp tốt nhất → ít bỏ sót edge case khi bạn prompt "liệt kê 10 trường hợp".
- Ít hallucinate tự tin → khi rule mơ hồ, Claude nói "mơ hồ" thay vì bịa interpretation.
- Viết structured output (binary statement, what counts table) nhất quán hơn.

**Model bổ trợ: GPT-5.4 Thinking**

Dùng GPT-5.4 để cross-check resolution interpretation. Upfront planning của GPT-5.4 hữu ích khi phân tích rule phức tạp — nó sẽ show kế hoạch suy nghĩ trước, bạn thấy logic chain rõ ràng.

**Workflow:**
1. Paste rule vào Claude → yêu cầu full Resolution Sheet
2. Paste cùng rule vào GPT-5.4 → yêu cầu "phản biện interpretation này, tìm edge case Claude bỏ sót"
3. Nếu hai model disagree → đó là ambiguity thật, đánh dấu vào resolution sheet

### T3a: Light Research (6 bucket scan)

**Model chính: Gemini 3.1 Pro**

Lý do: Light research = quét nhanh nhiều nguồn, tổng hợp thông tin real-time. Gemini mạnh nhất ở:

- Web search tích hợp native với Google → kết quả tươi nhất, đặc biệt cho tech news.
- Cost thấp nhất → phù hợp cho scan nhanh nhiều bucket.
- Multimodal: nếu cần đọc screenshot status page, hình benchmark, hay video conference clip → Gemini là model duy nhất xử lý native.
- Context window lớn nhất → nạp nhiều source cùng lúc để so sánh.

**Chú ý:** Gemini có xu hướng "commit sai hướng khi prompt mơ hồ". Nên prompt rõ ràng: "Chỉ liệt kê facts có source, không suy diễn."

### T3b: Deep Research (Signal matrix + scored evidence)

**Model chính: Claude Sonnet 4.6**

Lý do: Deep research yêu cầu:
- Chấm điểm từng signal theo anchor (reliability, relevance, timing) → bài toán structured scoring, Claude mạnh nhất.
- Viết counter-view cho mỗi signal → bài toán nuanced reasoning, Claude xử lý hai mặt tốt hơn (GPT có xu hướng agree, Gemini có xu hướng commit một chiều).
- Giữ nhất quán qua bảng dài nhiều signal → instruction-following + long-form structure.
- Counter-view quality check yêu cầu self-critique → Claude ít hallucinate nhất khi tự đánh giá.

**Model bổ trợ: Gemini 3.1 Pro**

Dùng Gemini cho:
- Thu thập source: tìm official docs, status page history, GitHub activity, cloud partner docs → Gemini search mạnh nhất.
- Xử lý tài liệu dài: nạp toàn bộ changelog, whitepaper, earnings transcript → 2M context.
- Cross-reference: nạp nhiều nguồn cùng lúc để Gemini phát hiện inconsistency.

**Model bổ trợ: GPT-5.4 Thinking**

Dùng GPT-5.4 cho:
- Phân tích financial/pricing signal: GPT-5.4 mạnh nhất về professional knowledge work → đọc earnings, financial filings, pricing model.
- Fact-check: khi cần verify một claim cụ thể (ít hallucinate factual nhất).

**Workflow:**
1. Gemini: thu thập raw sources cho 6 buckets
2. Claude: tổng hợp vào signal matrix, chấm điểm, viết counter-view
3. GPT-5.4: fact-check key claims + phân tích financial signals

### T3 + Force Map Module

**Model chính: Claude Sonnet 4.6**

Force Map yêu cầu:
- Phân loại lực (gate/accelerator/friction/noise) → structured categorization.
- Vẽ dependency chain → multi-step logical reasoning.
- Kiểm tra interaction effects → nuanced "nếu A và B cùng xảy ra thì sao".

Claude mạnh nhất ở cả ba.

**Model bổ trợ: Gemini 3.1 Pro**

- Scientific/technical reasoning cho Vòng 2–3 (chip supply analysis, regulatory impact, climate/grid risk) → GPQA Diamond 94.3% cho thấy Gemini xử lý câu hỏi khoa học/kỹ thuật phức tạp tốt nhất.
- Multimodal: đọc chart, diagram, hình ảnh infra architecture.

### T4: Probability Engine

**Model chính: GPT-5.4 Thinking**

Lý do:
- Log-odds update là bài toán math/quantitative → GPT-5.4 giảm 33% factual error, mạnh nhất về tính toán chính xác.
- Professional knowledge work (financial modeling) → GPT-5.4 dẫn đầu GDPval.
- Upfront planning cho thấy chain of reasoning khi update → bạn verify được logic.
- Nhanh → iterate nhiều scenario nhanh hơn.

**Model bổ trợ: Claude Sonnet 4.6**

- Viết phần narrative: "Why market may be wrong", "Key unknowns" → Claude viết analytical prose tốt nhất.
- Sanity check: sau khi GPT tính xong, paste kết quả vào Claude hỏi "logic này có lỗi gì không?"

### T5: Risk & Sizing

**Model chính: GPT-5.4 Thinking**

- Position sizing matrix, correlation calculation, bankroll math → bài toán quantitative thuần túy.
- GPT-5.4 xử lý bảng tính, mô hình tài chính tốt nhất.

**Model bổ trợ: Claude Sonnet 4.6**

- Kill switch design, commitment device writing → bài toán structured analysis + self-constraint.

### T6: Anti-bias Gate

**Model chính: Claude Sonnet 4.6**

Lý do: Devil's advocate, pre-mortem, anti-anchoring đều yêu cầu model phản biện thesis của bạn một cách nuanced và trung thực. Claude:
- Ít "agree" với user nhất → sẵn sàng push back.
- Viết counter-argument có chất lượng cao nhất.
- Khi không thấy lỗ hổng thật → nói thẳng thay vì bịa lỗ hổng giả.

**Tránh dùng Gemini cho bước này:** Gemini có xu hướng commit một chiều — nếu bạn pitch thesis bullish, Gemini dễ agree hơn là phản biện sắc.

### T7: Execution
**Không cần model.** Đây là checklist tick-box. Dùng spreadsheet hoặc template.

### T8: Monitoring & Manipulation

**Model chính: Gemini 3.1 Pro**

- Real-time search: Gemini tích hợp Google Search tốt nhất → phát hiện news mới nhanh nhất.
- Multimodal: đọc screenshot status page, chart price, video press conference.
- Cost thấp → phù hợp cho monitoring nhiều lần/ngày.
- Keyword alert analysis: nạp nhiều source cùng lúc → phát hiện incoherence giữa related markets.

**Model bổ trợ: Claude Sonnet 4.6**

- Khi phát hiện signal mới cần classify (thesis-confirming / damaging / noise / unknown) → Claude phân loại nuanced hơn.
- Khi cần quyết định update P₂ hay không → Claude ít bị reactive hơn.

### T9: Journal & Postmortem

**Model chính: Claude Sonnet 4.6**

- Viết postmortem analytical: "sai ở đâu, vì sao, bài học gì" → Claude viết reflection tốt nhất.
- Phân loại failure taxonomy → structured categorization.
- Calibration analysis → bài toán self-assessment trung thực.

**Model bổ trợ: GPT-5.4 Thinking**

- Tính Brier score, calibration statistics → math chính xác hơn.

---

## Bảng tổng hợp routing

| Layer | Model chính | Model bổ trợ | Lý do chọn model chính |
|-------|------------|-------------|----------------------|
| T0 Readiness | Không cần | — | Self-check |
| T1 Triage | GPT-5.4 | — | Nhanh, scan nhiều kèo |
| T2 Resolution | **Claude Sonnet 4.6** | GPT-5.4 cross-check | Instruction-following, ít hallucinate rule |
| T3a Light Research | **Gemini 3.1 Pro** | — | Search native, multimodal, cost thấp |
| T3b Deep Research | **Claude Sonnet 4.6** | Gemini (sources) + GPT (finance) | Structured scoring, counter-view quality |
| T3 Force Map | **Claude Sonnet 4.6** | Gemini (technical/science) | Dependency chain, interaction effects |
| T4 Probability | **GPT-5.4 Thinking** | Claude (narrative + sanity check) | Math accuracy, upfront planning |
| T5 Risk/Sizing | **GPT-5.4 Thinking** | Claude (kill switch design) | Quantitative modeling |
| T6 Anti-bias | **Claude Sonnet 4.6** | — | Push-back quality, honest counter-arg |
| T7 Execution | Không cần | — | Checklist |
| T8 Monitoring | **Gemini 3.1 Pro** | Claude (classify signal) | Real-time search, multimodal, cost |
| T9 Postmortem | **Claude Sonnet 4.6** | GPT-5.4 (math/stats) | Analytical reflection, failure taxonomy |

---

## Workflow thực tế trên Perplexity

Vì Perplexity cho phép chuyển model giữa các câu hỏi trong cùng thread, workflow tối ưu là:

**Phase 1 — Scan (5–10 phút)**
→ GPT-5.4: "Tóm tắt market này, rule là gì, odds hiện tại, liquidity"
→ GPT-5.4: Triage score nhanh

**Phase 2 — Resolution (15–30 phút)**
→ Claude: "Đây là rule [paste]. Viết full Resolution Sheet theo template này [paste template]"
→ GPT-5.4: "Phản biện interpretation này, tìm edge case bị sót"

**Phase 3 — Research (30 phút – 3 giờ)**
→ Gemini: "Tìm tất cả thông tin mới nhất về [chủ thể] từ official sources, status pages, GitHub, press"
→ Claude: "Đây là raw sources [paste]. Chấm vào signal matrix theo anchor system này [paste anchors]"
→ GPT-5.4: "[Nếu có financial signal] Phân tích earnings/pricing data này"

**Phase 4 — Probability + Risk (15–30 phút)**
→ GPT-5.4: "Prior P₂ = X%. Đây là signals [paste]. Update bằng log-odds, cho bảng tính step by step"
→ Claude: "Review logic này, có lỗi gì không? Edge cases nào chưa tính?"

**Phase 5 — Anti-bias (10 phút)**
→ Claude: "Đây là thesis của tôi [paste]. Viết devil's advocate: 3 lý do sai, 1 cách resolve ngược, pre-mortem"

**Phase 6 — Monitor (hàng ngày)**
→ Gemini: "Tin mới nhất về [chủ thể] hôm nay? Status page? GitHub activity? Related markets?"
→ Claude (khi có signal mới): "Signal này là confirming, damaging, noise, hay unknown? Nên update P₂ không?"

---

## Lưu ý quan trọng

1. **Perplexity search layer là chung** — model nào cũng dùng cùng search engine. Sự khác biệt nằm ở cách model tổng hợp và phân tích kết quả, không phải ở khả năng tìm kiếm.

2. **Không có model nào thay thế judgment của bạn.** Model giúp thu thập, tổ chức, và tính toán. Quyết định bet vẫn là của bạn.

3. **Khi 2 model disagree → đó là signal có giá trị.** Nếu Claude nói rule mơ hồ mà GPT nói rõ ràng → ambiguity thật sự tồn tại, resolution confidence nên giảm.

4. **Cost trên Perplexity Pro không phân biệt theo model** — bạn đã trả subscription, nên routing theo thế mạnh không có thêm chi phí. Tận dụng tối đa.

5. **Thinking mode on/off matters.** GPT-5.4 Thinking bật thinking cho T4 (probability), T5 (sizing). Tắt thinking cho T1 (triage scan nhanh) để tiết kiệm thời gian.

---

## Quản lý Session trên Perplexity (Session Routing)

Câu hỏi rất thực tế: **Không nên dùng cùng 1 session cho toàn bộ quy trình**, nhưng cũng **không nên tách quá nhỏ**. Lý do nằm ở cách context window hoạt động.

### Vấn đề của 1 session duy nhất
Khi chạy T2 → T3 → T4 → T5 → T6 trong cùng 1 thread, context tích lũy liên tục (có thể 30k-80k token):
- Model bắt đầu **"quên" hoặc giảm chất lượng ở phần đầu** thread.
- **Confirmation bias tăng:** T3 đã build thesis bullish, đến T6 (devil's adv) model sẽ khó push back thật sự vì đã "commit" hướng đó.
- **Cross-model routing bị phá:** Chuyển từ Gemini sang Claude, Claude nhận raw message của Gemini làm mồi nhiễu.

### Cách chia session tối ưu (3-4 Sessions)

**Session 1: Lock the rules (T1 + T2)**
- **Model:** Claude chính, GPT cross-check.
- **Mục tiêu:** Triage + Resolution sheet.
- **Output cần lưu:** Resolution sheet (copy ra ngoài).
- *Kết thúc session khi hoàn thiện luật, tuyệt đối chưa Research ở đây để tránh Bias.*

**Session 2: Gather evidence (T3a + T3b + Force Map)**
- **Model:** Gemini thu thập → Claude tổng hợp.
- **Input:** Paste Resolution sheet từ Session 1 vào đầu thread (Context anchor).
- **Output cần lưu:** Signal matrix đã scored, Force Map active forces.
- *Gộp chung vì T3a feed trực tiếp vào T3b/Force Map.*

**Session 3: Price and decide (T4 + T5 + T6)**
- **Model:** GPT cho math → Claude cho anti-bias.
- **Input:** Paste Resolution sheet + Signal matrix tóm tắt (Kết luận đã scored, ko tự dán raw sources).
- **Mục tiêu:** P2, Sizing, Devil's advocate, Kill switches.
- *Đặc biệt cho T6: Vì đầu mở session, Claude chưa commit vào thesis (chưa bị anchored) nên sẽ phản biện rất sắc nhọn.*

**Session 4 (ongoing): Monitor (T8)**
- **Model:** Gemini search → Claude classify.
- **Input:** Resolution sheet + Current P2 + Kill switches.
- *Làm ở thread mới riêng rẽ, mỗi lần là 1 session audit ngắn.*

### 5 Nguyên tắc Quản lý Context:
1. **Truyền Context thủ công:** Mỗi session mới bắt buộc cấy Context cốt lõi từ Output của session cũ.
2. **Bộ nhớ ngoài:** Output mỗi phần phải được lưu ra file Document / Notion. AI ko nhớ xuyên session.
3. **Luôn Fresh ở bước Anti-Bias (T6):** Việc tách Session 3 là luật cứng để Devil's Advocate bộc lộ toàn phần sức mạnh.
4. **Không kéo 1 session quá 15-20 turns:** Lố ngưỡng này model sẽ suy giảm Attention từ đầu. Phải mở Session mới truyền summary cũ sang.
5. **Summarize trước khi Switch Model:** Ở Session 2, khi Gemini moi raw data về xong, hãy prompt "Tóm tắt 5 bullets point" trước khi chuyển nút sang Claude để tiếp nhận Context sạch.