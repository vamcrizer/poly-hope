# Polymarket Research & Trading System — Definitive Edition

## Triết lý thiết kế

Hệ thống này được xây trên 5 tiên đề. Mọi quy tắc phía dưới đều truy ngược về một trong 5 tiên đề này. Nếu một quy tắc không phục vụ tiên đề nào, nó không nên tồn tại.

1. **Resolution > Reality.** Polymarket không trả tiền cho "đúng về thực tế" mà trả tiền cho "đúng theo cách market settle". Mọi research phải bắt đầu và kết thúc bằng resolution rule.
2. **Edge phải sống sót qua phí, spread, ambiguity và sizing.** Một edge 3% trên giấy mà spread 4% là edge âm. Một edge 15% mà bet 50% bankroll là con đường phá sản.
3. **Quy trình cưỡng chế tốt hơn ý chí cá nhân.** Con người không thể tự nhắc mình chống bias. Bias phải bị chặn bằng bước bắt buộc trong workflow, không bằng lời khuyên.
4. **Hệ thống phải tự cải tiến.** Không có journal và calibration review thì không có cách biết mình đang giỏi lên hay đang lặp lại sai lầm cũ.
5. **Độ phức tạp phải tỷ lệ với stakes.** Kèo nhỏ dùng quy trình nhẹ. Kèo lớn dùng quy trình nặng. Không bao giờ dùng cùng một mức công sức cho mọi kèo.

---

## Kiến trúc tổng thể

```
T0  Readiness Gate ──→ Không đạt → Dừng, không trade hôm nay
         │
         ▼
T1  Triage ──→ Điểm < 45 → Bỏ kèo
         │       45–64 → Light Track (chỉ T2a, T3a, T4, T5)
         ▼       65–79 → Standard Track
T2  Resolution Audit    ≥ 80 → Deep Track + Peer Challenge
         │
         ▼
T3  Research Stack ──→ T3a (Light) hoặc T3b (Deep)
         │
         ▼
T4  Probability Engine
         │
         ▼
T5  Risk & Sizing ──→ Không đạt kill-switch check → Không vào lệnh
         │
         ▼
T6  Anti-bias Gate ──→ Không viết được devil's advocate → Không vào lệnh
         │
         ▼
T7  Execution
         │
         ▼
T8  Monitoring & Update ──→ Kill switch triggered → Thoát/giảm
         │
         ▼
T9  Journal & Postmortem ──→ Mỗi 25 kèo: Calibration Review
         │                            │
         ▼                            ▼
      Kèo tiếp theo          Điều chỉnh quy trình (Meta-review)
```

Mỗi tầng có **input bắt buộc** (từ tầng trước) và **output bắt buộc** (cho tầng sau). Nếu output chưa đủ, không được xuống tầng tiếp theo. Đây là cơ chế cưỡng chế — không phải gợi ý.

---

## T0: Readiness Gate

**Mục đích:** chặn trading khi trạng thái cá nhân không đủ tốt để ra quyết định.

Không framework nào giúp được nếu bạn đang tilt, mệt, hoặc vừa thua lớn và muốn gỡ. Bước này tồn tại vì research cho thấy phần lớn lỗi sizing và lỗi discipline xảy ra khi trader đang ở trạng thái cảm xúc bất thường, không phải khi họ thiếu thông tin.

**Trước mỗi phiên trade, trả lời 4 câu (Yes/No):**

| # | Câu hỏi | Nếu No |
|---|---------|--------|
| 1 | Tôi ngủ đủ 6+ giờ đêm qua? | Chỉ được monitor, không vào lệnh mới |
| 2 | Tôi có đang cố gỡ lỗ từ kèo trước? | Dừng hoàn toàn, review journal |
| 3 | Tôi có đang bị FOMO vì thấy người khác lãi? | Chỉ làm research, không execution |
| 4 | Nếu kèo này thua hết, tôi có bình thường được không? | Giảm size xuống 50% dự kiến |

**Output:** trạng thái = Full / Restricted / Monitor-only.

Nếu >= 2 câu trả lời No: **monitor-only**, không vào lệnh mới, chỉ quản lý vị thế hiện có.

Bước này mất 30 giây. Chi phí gần bằng không. Giá trị phòng thủ cực cao.

---

## T1: Triage

**Input:** một kèo Polymarket bạn đang cân nhắc.
**Output:** quyết định Skip / Light / Standard / Deep, ghi vào journal.

### Bảng chấm điểm có trọng số

| Biến | 0 | 1 | 2 | Trọng số | Lý do trọng số |
|------|---|---|---|----------|----------------|
| Rule clarity | Mơ hồ, nhiều cách đọc, hoặc chưa có resolution source rõ | Hiểu được nhưng có 1–2 ambiguity | Rất rõ, source rõ, edge case ít | **×3** | Ambiguity là rủi ro không hedge được |
| Preliminary edge | Chưa thấy lý do market sai | Có thesis sơ bộ, chưa kiểm chứng | Market lệch rõ so với evidence ban đầu | **×2** | Không có edge thì không có lý do trade |
| Liquidity | Spread > 5%, hoặc depth < $500 mỗi side | Spread 2–5%, depth $500–$5k | Spread < 2%, depth > $5k | **×2** | Spread giết edge nhỏ |
| Time remaining | < 24h hoặc quá dài (> 6 tháng không catalyst) | 1–14 ngày hoặc có catalyst rõ | 2–8 tuần, đủ để thesis play out và update | **×1** | Thời gian ảnh hưởng nhưng ít quyết định hơn |

**Cách tính:**
- Điểm thô = (Rule × 3) + (Edge × 2) + (Liquidity × 2) + (Time × 1)
- Điểm tối đa = 6 + 4 + 4 + 2 = 16
- Quy đổi: (điểm thô / 16) × 100

**Ngưỡng quyết định:**

| Điểm | Hành động | Thời gian tối đa | Template dùng |
|------|-----------|-------------------|---------------|
| < 45 | **Bỏ.** Ghi lý do vào journal, không nhìn lại | 0 | Không |
| 45–64 | **Light Track.** Research nhanh, size nhỏ | 20–30 phút | Template Light |
| 65–79 | **Standard Track.** Research chuẩn | 1–3 giờ | Template Full |
| ≥ 80 | **Deep Track.** Full research + peer challenge nếu size ≥ 2 units | 3–8 giờ | Template Full + Peer |

**Override rules:**
- Rule clarity = 0 → tự động bỏ, bất kể tổng điểm. Không có ngoại lệ.
- Liquidity = 0 → tự động bỏ, trừ khi bạn là market maker.
- Edge = 0 → tự động bỏ. "Thú vị" không phải lý do trade.

---

## T2: Resolution Audit

**Input:** kèo đã qua triage.
**Output:** Resolution Sheet — 1 trang, không thiếu mục nào dưới đây.

Đây là bước quan trọng nhất trong toàn bộ hệ thống. Nếu bạn chỉ làm đúng một bước, hãy làm bước này.

### Resolution Sheet

**2.1 Trích nguyên văn**
```
[Dán nguyên văn resolution criteria từ Polymarket]
```

**2.2 Metadata**
- Primary resolution source:
- Secondary resolution source (nếu có):
- End date:
- End time + timezone:
- Cutoff rule (event phải xảy ra trước khi nào):
- Alternative settlement terms:
- Challenge period: 2 giờ sau initial proposal (Polymarket standard)
- Dispute escalation path: proposer → challenger → UMA DVM vote

**2.3 Binary settlement statement**
Viết lại rule thành đúng 2 câu:
- **YES nếu:** [điều kiện chính xác]
- **NO nếu:** [mọi trường hợp khác, liệt kê cụ thể]

Nếu bạn không viết được 2 câu này rõ ràng, resolution confidence = Low và bạn phải giảm size hoặc bỏ kèo.

**2.4 What counts / What doesn't count**

| # | Tình huống | Count? | Lý do |
|---|-----------|--------|-------|
| 1 | [Trường hợp rõ ràng nhất count] | Yes | |
| 2 | | Yes | |
| 3 | | Yes | |
| 4 | | Yes | |
| 5 | | Yes | |
| 6 | [Trường hợp rõ ràng nhất không count] | No | |
| 7 | | No | |
| 8 | | No | |
| 9 | | No | |
| 10 | | No | |

**2.5 Edge cases — "người ngoài tưởng Yes nhưng market vẫn No"**

| # | Tình huống | Tại sao dễ nhầm | Market resolve |
|---|-----------|-----------------|----------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

Với kèo AI/tech, các edge case phổ biến nhất là: renamed product, beta/preview/waitlist-only, API-only access, stealth rollout, partial availability, region-limited launch, "announced but not shipped", status page mismatch.

**2.6 Dispute map**
Polymarket dùng UMA Optimistic Oracle. Sau khi proposer đề xuất outcome, có 2 giờ challenge period. Nếu bị challenge, có thể kéo dài qua nhiều vòng dispute và cuối cùng đến UMA DVM vote.

- Nếu market bị dispute và tôi ở phía Yes, evidence mạnh nhất tôi nộp là:
- Nếu market bị dispute và tôi ở phía No, evidence mạnh nhất tôi nộp là:
- Source nào có thể bị xóa/chỉnh sửa trước khi dispute kết thúc:
- Tôi có archive.org / screenshot backup không:

**2.7 Resolution confidence**

| Mức | Định nghĩa | Hệ quả |
|-----|-----------|---------|
| High | Wording rõ, source rõ, edge case ít, dispute risk thấp | Trade bình thường |
| Medium | Có 1–2 ambiguity nhưng khóa được hướng settle chính | Giảm 1 bậc size |
| Low | Rule mơ hồ, nhiều cách đọc, dispute risk cao | Bỏ kèo hoặc size tối thiểu |

**2.8 Three sentences test**
Trước khi rời T2, phải viết được 3 câu sau. Nếu không, chưa được phép tiến sang T3:

1. Market này đang đo: ___
2. Market này KHÔNG đo: ___
3. Event xảy ra kiểu ___ thì người ngoài tưởng Yes nhưng market vẫn No vì ___

---

## T3: Research Stack

### T3a: Light Research (bắt buộc mọi kèo qua triage)

Quét nhanh 6 bucket. Mỗi bucket ghi 1–3 dòng. Tổng thời gian: 20–30 phút.

| Bucket | Câu hỏi chính | Source ưu tiên |
|--------|--------------|----------------|
| 1. Official source | Source chính nói gì? Có update gần đây không? | Company blog, docs, status page, API docs |
| 2. Internal execution | Có signal nào về readiness: code, docs, hiring, pricing, changelog? | GitHub, HuggingFace, job boards, pricing pages |
| 3. External systems | Cloud/chip/regulation/infra có gì bất thường? | AWS/GCP/Azure status, export control news |
| 4. Competitive pressure | Đối thủ có release gần đây ép timing không? | Tech press, competitor blogs |
| 5. Narrative / social | Leak, meme, screenshot nào đang drive narrative? | X, Reddit, forums |
| 6. Related markets | Market liên quan đang nói gì? Có incoherence không? | Polymarket |

**Output:** bảng 6 dòng tóm tắt. Nếu phát hiện signal mạnh ở bất kỳ bucket nào, đánh dấu để deep dive ở T3b.

### T3b: Deep Research (chỉ cho Standard và Deep Track)

#### Source hierarchy

| Tier | Loại | Ví dụ | Dùng khi |
|------|------|-------|----------|
| 1 | Official primary | Company blog, docs, status page, legal filings, API docs, earnings transcript | Mọi claim quan trọng |
| 2 | Official secondary + major press | Cloud partner docs, app store notes, major outlet (Reuters, Bloomberg, WSJ), GitHub/HF repos | Xác minh chéo tier 1 |
| 3 | Community verified | Reddit với evidence, HN với links, forum posts có screenshot kèm context | Phát hiện signal mới |
| 4 | Unverified social | Anon tweets, Telegram, Discord, leak sites | Chỉ dùng nếu corroborate được bằng tier 1–2 |

**Quy tắc nguồn:**
- Mọi claim quyết định (ảnh hưởng > 5 điểm xác suất) phải có ít nhất 1 source tier 1 hoặc tier 2.
- Không bao giờ dùng 1 source tier 4 đơn lẻ làm cơ sở thay đổi thesis.
- Nếu 3+ source tier 3 cùng chỉ một hướng mà không có tier 1–2 phản bác, coi đó là signal moderate, không phải strong.

#### Signal matrix

| # | Signal | Source | Tier | Reliability | Res. relevance | Timing | Direction | Counter-view | Counter quality |
|---|--------|--------|------|-------------|---------------|--------|-----------|-------------|----------------|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| ... | | | | | | | | | |

#### Anchor chấm điểm — Reliability

| Điểm | Định nghĩa | Ví dụ |
|------|-----------|-------|
| 5 | Official primary source, verified, không ambiguity | Company blog post, API docs, SEC filing |
| 4 | Major reputable outlet hoặc partner doc trực tiếp, có editorial process | Reuters article, AWS partner page, peer-reviewed |
| 3 | Nhiều nguồn thứ cấp khớp nhau, hoặc 1 nguồn có track record tốt | 3 tech reporters cùng nói, GitHub commit + changelog |
| 2 | Social/forum có corroboration yếu | Reddit post có screenshot nhưng không verify được |
| 1 | Rumor đơn lẻ, anon, không corroborate | Random tweet, Telegram screenshot |

#### Anchor chấm điểm — Resolution relevance

| Điểm | Định nghĩa | Test |
|------|-----------|------|
| 5 | Tự nó có thể settle market | "Nếu chỉ biết signal này, tôi biết market resolve thế nào" |
| 4 | Trực tiếp thay đổi P(thỏa resolution rule) | "Signal này thay đổi cách event match với wording" |
| 3 | Thay đổi P(event thật) nhưng chưa chắc chạm rule | "Event có thể xảy ra/không xảy ra, nhưng rule có count không thì chưa rõ" |
| 2 | Hỗ trợ narrative, không chạm trực tiếp vào resolution | "Thú vị nhưng market không settle dựa trên cái này" |
| 1 | Gần như noise | "Không liên quan đến cách market settle" |

#### Anchor chấm điểm — Timing relevance

| Điểm | Định nghĩa |
|------|-----------|
| 5 | Ảnh hưởng trong 0–7 ngày |
| 4 | 1–4 tuần |
| 3 | 1–3 tháng |
| 2 | > 3 tháng |
| 1 | Không rõ timeline |

#### Counter-view quality check

Đây là cơ chế chống confirmation bias ở cấp quy trình.

**Quy tắc:** không signal nào được tính vào probability update nếu chưa viết counter-view.

**Nhưng counter-view giả (viết cho có) là failure mode phổ biến.** Để chặn:

Mỗi counter-view phải trả lời câu: **"Nếu counter-view này đúng, tôi thay đổi P₂ bao nhiêu điểm?"**

| Trả lời | Counter quality | Hệ quả |
|---------|----------------|---------|
| "Không thay đổi gì" | Fake counter | Signal tương ứng bị giảm 1 bậc direction confidence. Bạn đang tự lừa mình. |
| "Thay đổi 1–3 điểm" | Weak counter | Chấp nhận, signal giữ nguyên |
| "Thay đổi 4–8 điểm" | Real counter | Signal bị giảm 1 bậc LR khi update |
| "Thay đổi > 8 điểm" | Strong counter | Signal trở thành ambiguous, không được dùng LR mạnh |

---

## Force Map Module — Tech/AI Prediction Markets

### Vị trí trong framework

Module này gắn vào **T3 (Research Stack)** như một lớp phân tích bổ sung. Nếu 6 bucket research trả lời "tìm signal ở đâu", Force Map trả lời "lực nào đang tác động lên chủ thể, theo cơ chế nào, với độ trễ và hướng nào".

Mỗi kèo tech/AI đều có một **chủ thể** — thứ mà market đang đo. Chủ thể có thể là: một model release, một product launch, một service uptime, một benchmark result, một pricing decision, một API availability, một company action. Mọi lực tác động đều phải được phân tích qua lăng kính: **lực này ảnh hưởng đến khả năng chủ thể thỏa resolution rule hay không**, chứ không chỉ "lực này có thú vị không".

---

### Mô hình 3 vòng

Chủ thể chịu tác động từ 3 vòng đồng tâm: Nội sinh (bên trong tổ chức sở hữu chủ thể), Trung gian (hệ sinh thái trực tiếp mà chủ thể phụ thuộc), và Ngoại sinh (môi trường rộng tác động gián tiếp).

```text
┌─────────────────────────────────────────────────┐
│              VÒNG 3: NGOẠI SINH                  │
│  Macro, Geopolitics, Regulation, Capital Markets │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │          VÒNG 2: TRUNG GIAN              │     │
│   │  Cloud, Chip, Partners, Competitors,     │     │
│   │  OSS ecosystem, Distribution platforms   │     │
│   │                                           │     │
│   │   ┌─────────────────────────────────┐     │     │
│   │   │      VÒNG 1: NỘI SINH           │     │     │
│   │   │  R&D, Infra, Team, Legal,        │     │     │
│   │   │  Product, Finance, Culture       │     │     │
│   │   │                                   │     │     │
│   │   │        ┌───────────┐              │     │     │
│   │   │        │  CHỦ THỂ  │              │     │     │
│   │   │        │ (market   │              │     │     │
│   │   │        │  outcome) │              │     │     │
│   │   │        └───────────┘              │     │     │
│   │   └─────────────────────────────────┘     │     │
│   └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

---

### Vòng 1: Nội sinh — bên trong tổ chức sở hữu chủ thể

Đây là những lực do chính công ty/tổ chức tạo ra hoặc kiểm soát. Chúng thường có **độ trễ ngắn** (ngày đến tuần) và **ảnh hưởng trực tiếp** nhất lên chủ thể.

#### 1.1 R&D / Engineering Readiness

| Lực | Cơ chế tác động | Observable signals | Độ trễ đến chủ thể |
|-----|-----------------|-------------------|---------------------|
| Model training progress | Model chưa xong → không thể release | Training logs, benchmark leaks, paper submissions, eval results | Tuần đến tháng |
| Eval / red-team pipeline | Chưa qua eval → release bị chặn hoặc delay | Safety publications, RLHF paper updates, eval framework changes | Tuần |
| Code/infra readiness | Code chưa production-ready → delay | GitHub activity, commit patterns, branch merges, CI/CD signals | Ngày đến tuần |
| Technical debt / refactor | Refactor lớn → delay feature delivery | Architecture blog posts, API deprecation notices, migration guides | Tháng |
| Bug / incident backlog | Bug nghiêm trọng → delay hoặc rollback | Bug tracker (nếu public), incident postmortems, hotfix patterns | Ngày |

#### 1.2 Product / Go-to-market

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Naming / branding decision | Tên sai so với resolution → market No dù product ra | Trademark filings, domain registrations, marketing assets, app store listings | Tuần |
| Release strategy (stealth vs. announced vs. staged) | Stealth release có thể không trigger resolution nếu rule yêu cầu "public announcement" | Historical release patterns, PR strategy, press embargo timing | Ngày |
| Distribution channel | API-only vs. web vs. app vs. enterprise → resolution có thể chỉ count 1 kiểu | Pricing page updates, SDK releases, app store submissions, enterprise pilot announcements | Tuần |
| Geographic rollout | Region-limited launch có thể không count | Terms of service updates, regional pricing, CDN/edge deployment | Tuần |
| Beta / preview / waitlist vs. GA | Nhiều market resolution chỉ count GA, không count beta | Invite codes, waitlist pages, "preview" badges, documentation language | Ngày đến tuần |
| Pricing / packaging change | Pricing restructure có thể delay hoặc redefine product | Pricing page snapshots, billing API changes, plan name changes | Tuần |

#### 1.3 Organization / People

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Key personnel departure/hire | Mất lead → delay; hire surge → accelerate | LinkedIn, press announcements, org chart changes, conference speaker changes | Tháng |
| Team restructuring | Reorg → priority shift → delay hoặc cancel | Blog posts, leaked memos, Glassdoor, hiring pattern shifts | Tháng |
| Internal alignment / politics | Disagreement về direction → delay decision | Executive public statements diverging, mixed signals from different teams | Tháng |
| Culture / morale | Low morale → lower velocity | Glassdoor trends, turnover patterns, public employee commentary | Tháng đến quý |
| Board / investor pressure | Pressure to ship faster hoặc pivot → accelerate hoặc change scope | Board meeting timing, investor letter, fundraising round timing | Tháng |

#### 1.4 Legal / Compliance / Safety (internal)

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Internal safety review | Safety board chặn release → delay | Safety publications, responsible disclosure policies, model card timing | Tuần đến tháng |
| IP / patent dispute (initiated by company) | Offensive litigation → signal confidence; defensive → signal risk | Court filings, DMCA actions, patent grants | Tháng |
| Data licensing / copyright concern | Unresolved data rights → delay hoặc remove features | Training data documentation, opt-out mechanisms, publisher lawsuits | Tháng |
| Export control compliance | Internal review chặn release ở certain markets | Compliance page updates, terms of service geographic restrictions | Tuần đến tháng |

#### 1.5 Finance / Resources (internal)

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Runway / cash position | Low runway → cut projects or rush monetization | Fundraising rumors, layoff signals, cost-cutting announcements | Tháng |
| Compute budget allocation | Not enough compute → delay training or serving | Cloud spending reports, GPU cluster announcements, spot instance patterns | Tháng |
| Revenue pressure | Pressure to monetize → might rush release or gate behind paywall | Pricing changes, enterprise push, freemium restrictions | Tuần đến tháng |

---

### Vòng 2: Trung gian — hệ sinh thái trực tiếp

Đây là những lực từ hệ sinh thái mà chủ thể **phụ thuộc trực tiếp để tồn tại hoặc vận hành**. Công ty không kiểm soát được nhưng chịu ảnh hưởng nhanh (ngày đến tháng).

#### 2.1 Cloud / Infrastructure providers

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Cloud region outage | Service down → resolution trigger (uptime kèo) hoặc delay (release kèo) | AWS/GCP/Azure status pages, downdetector, cloud incident reports | Giờ đến ngày |
| Cloud capacity constraints | Không đủ capacity → throttle hoặc delay scaling | Cloud blog posts about capacity, regional availability notices, wait times | Tuần |
| Cloud pricing change | Cost tăng → có thể cut features hoặc limit access | Cloud pricing page changes, billing documentation updates | Tháng |
| Cloud partnership changes | Preferred partner status lost → migration → delay | Partner page changes, co-marketing changes, technical integration docs | Tháng |

#### 2.2 Hardware / Chip / Supply chain

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| GPU supply (NVIDIA H100/B200, AMD MI300X, custom ASICs) | Không đủ chip → không scale serving → delay release hoặc limit access | NVIDIA earnings, lead time reports, cloud GPU availability, spot prices | Tháng đến quý |
| HBM / memory supply | Memory bottleneck → chip yield thấp → supply tighten | Memory vendor earnings (SK Hynix, Samsung, Micron), industry reports | Quý |
| Chip architecture transition | New gen chip transition → compatibility issues → delay | NVIDIA GTC, AMD announcements, TSMC earnings, tape-out reports | Quý đến năm |
| Packaging / CoWoS capacity | Advanced packaging bottleneck → limit chip production | TSMC capacity reports, packaging technology announcements | Quý |
| Networking / interconnect | InfiniBand / NVLink supply → limit cluster scale | NVIDIA networking announcements, data center build-out reports | Tháng |

#### 2.3 Distribution platforms

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| App store review process | Apple/Google review delay → mobile launch delay | App store listing status, developer forum complaints, review guideline changes | Ngày đến tuần |
| API marketplace / integration platforms | Third-party platform policy change → distribution disrupted | Platform TOS changes, API policy updates, partner program changes | Tuần |
| Browser / OS compatibility | Compatibility issue → partial rollout → might not count as "public" | Browser release notes, OS update schedules, compatibility matrices | Tuần |

#### 2.4 Partners / Customers / Enterprise

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Enterprise pilot feedback | Negative pilot → delay GA; positive → accelerate | Case studies, partner announcements, enterprise blog posts | Tháng |
| Integration partner readiness | Partner chưa sẵn sàng → co-launch delay | Partner docs, SDK updates, integration guides | Tuần đến tháng |
| Customer demand signal | Overwhelming demand → might gate launch; weak demand → might delay | Waitlist length, API usage metrics (if public), developer community activity | Tuần |
| Key customer / anchor tenant | Losing anchor customer → pivot or delay | Press coverage, partnership announcements, conference keynotes | Tháng |

#### 2.5 Competitors / Market dynamics

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Competitor release pressure | Competitor ships → pressure to ship faster (có thể rush, cut corners, hoặc rename to match) | Competitor blogs, press coverage, benchmark comparisons | Ngày đến tuần |
| Competitor pricing move | Undercut pricing → pressure to match → might change packaging/access model | Competitor pricing pages, developer community reactions | Tuần |
| Talent poaching | Key engineers leave for competitor → delay specific workstreams | LinkedIn movements, team page changes, conference speaker shifts | Tháng |
| Open-source alternatives | Strong OSS option emerges → might change company strategy (open more, close more, or pivot) | HuggingFace trending, GitHub stars, paper citations, developer adoption metrics | Tháng |
| Benchmark race | Competitor beats benchmark → pressure to match or redefine metric | Papers, leaderboards, social media benchmark screenshots | Ngày đến tuần |

#### 2.6 Open-source ecosystem

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Framework / library changes | Breaking change in PyTorch/TF/JAX → delay migration | Framework release notes, GitHub issues, community migration guides | Tuần đến tháng |
| Community-driven alternatives | Community builds alternative → reduces urgency hoặc changes market definition | HuggingFace repos, GitHub activity, forum adoption discussions | Tháng |
| License changes | OSS license change → legal review → delay or fork | License file changes, community backlash, corporate policy responses | Tuần đến tháng |

---

### Vòng 3: Ngoại sinh — môi trường rộng

Đây là những lực mà chủ thể **không phụ thuộc trực tiếp nhưng chịu ảnh hưởng khi chúng thay đổi đủ mạnh**. Thường có **độ trễ dài** (tháng đến năm) nhưng khi xảy ra đột ngột thì tác động cực lớn.

#### 3.1 Regulation / Government / Policy

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| AI regulation (EU AI Act, US executive orders, China rules) | Compliance requirement → delay, restrict features, or change access model | Legislation tracker, government gazette, regulatory agency announcements | Tháng đến năm |
| Data privacy regulation (GDPR, state-level US) | Training data restrictions → model capability limits → product delay | Regulatory enforcement actions, privacy authority guidance, court rulings | Tháng |
| Export controls (US-China chip restrictions) | Cannot serve in certain markets, or cannot use certain hardware | Commerce Department announcements, entity list updates, trade press | Tháng; đột ngột nếu executive order |
| Content / liability regulation | Platform liability → might restrict model output → product change | Legislative hearings, section 230 debates, court rulings | Tháng đến năm |
| Government procurement / contract | Large government contract → prioritize features for compliance | Federal procurement notices, GSA schedules, defense contractor announcements | Tháng |
| Safety mandates / testing requirements | Mandatory eval → delay release until compliance | Executive orders, NIST framework updates, voluntary commitment announcements | Tháng |
| Antitrust action | Forced divestiture or structural changes → distraction, delay | DOJ/FTC filings, EU competition cases, congressional hearings | Năm, nhưng announcement impact = ngày |

#### 3.2 Geopolitics

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| US-China tech decoupling | Chip supply disruption, market access restriction, talent flow restriction | Diplomatic statements, sanctions lists, trade negotiations | Tháng; đột ngột nếu escalation |
| Taiwan strait risk | TSMC disruption → global chip crisis → everything delays | Military activity reports, diplomatic tensions, insurance rates | Đột ngột |
| Sanctions (Russia, Iran, etc.) | Market access restriction, payment processing issues | OFAC updates, EU sanctions lists | Tháng |
| Submarine cable / internet infrastructure | Regional connectivity disruption → service degradation | TeleGeography cable maps, ISP reports, CDN performance data | Đột ngột |
| War / armed conflict | Supply chain disruption, talent displacement, priority shift | News, intelligence assessments, conflict monitors | Đột ngột |

#### 3.3 Capital markets / Macro

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Interest rates / monetary policy | Higher rates → harder to raise → cut burn → delay projects | Fed decisions, bond yields, VC funding reports | Quý |
| VC / growth funding environment | Funding winter → companies rush to monetize or cut R&D | Crunchbase, PitchBook reports, funding announcements | Quý |
| Public market sentiment (AI hype cycle) | Hype → overfunding → overcapacity; bust → underfunding → consolidation | Nasdaq AI index, AI company stock prices, ETF flows | Tháng |
| IPO / M&A window | Pre-IPO company avoids risk → delays experimental features; M&A → product direction changes | IPO filings, M&A rumors, banker activity | Tháng |
| Currency / inflation | Operational cost increase → pricing changes, market access decisions | CPI data, currency rates, energy prices | Quý |

#### 3.4 Physical infrastructure / Environment

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| Power grid capacity | Data center cannot run at full capacity → throttle serving | Utility reports, grid stress events, power purchase agreements | Tháng; đột ngột nếu grid failure |
| Water supply (cooling) | Cooling constraint → limit data center density → capacity constraint | Water authority reports, environmental permits, data center location decisions | Quý |
| Natural disaster (earthquake, hurricane, flood) | Physical damage to data center or supply chain → outage or delay | Weather forecasts, seismic data, insurance reports | Đột ngột |
| Climate / heat events | Extreme heat → cooling inefficiency → throttle or outage | Weather data, data center incident reports | Đột ngột |
| Construction / permitting | New data center delayed → capacity constraint persists longer | Building permits, construction reports, utility interconnection queues | Năm |

#### 3.5 Social / Cultural / Public opinion

| Lực | Cơ chế tác động | Observable signals | Độ trễ |
|-----|-----------------|-------------------|--------|
| AI safety public discourse | Public pressure → company self-restricts → delay or limit release | Media coverage, petition signatures, open letters, congressional testimony | Tháng |
| Copyright / creator backlash | Lawsuits or public pressure → training data restrictions → model limits | Class action filings, creator union statements, platform policy changes | Tháng đến năm |
| Labor market / AI job displacement narrative | Political pressure → regulation → restrict deployment | Polling data, union statements, political platform positions | Quý đến năm |
| Trust / adoption sentiment | Low trust → slow adoption → company pivots strategy | Survey data, NPS if available, developer sentiment in forums | Quý |
| Viral incident (AI harm, bias, misuse) | Public incident → emergency safety review → delay or rollback | Social media virality, press coverage, company response statements | Ngày đến tuần |

---

### Cách dùng Force Map trong research

#### Bước 1: Xác định chủ thể

Viết 1 câu: "Chủ thể của market này là: ___"

Ví dụ:
- "Public availability của GPT-5 trên ChatGPT trước ngày X"
- "Anthropic API uptime ≥ 99.9% trong tháng Y"
- "Model Z đạt score ≥ N trên benchmark B trước ngày X"

#### Bước 2: Quét 3 vòng, xác định lực đang active

Cho mỗi vòng, hỏi: **"Lực nào trong vòng này đang active (đã có signal observable) và ảnh hưởng đến chủ thể?"**

Không liệt kê mọi lực có thể — chỉ liệt kê lực **đang có signal thực tế**.

Template:

```text
CHỦ THỂ: ___

VÒNG 1 — NỘI SINH (active forces)
| Lực | Signal quan sát được | Hướng tác động | Độ trễ ước tính | Reliability |
|-----|---------------------|---------------|-----------------|-------------|
| | | | | |

VÒNG 2 — TRUNG GIAN (active forces)
| Lực | Signal quan sát được | Hướng tác động | Độ trễ ước tính | Reliability |
|-----|---------------------|---------------|-----------------|-------------|
| | | | | |

VÒNG 3 — NGOẠI SINH (active forces)
| Lực | Signal quan sát được | Hướng tác động | Độ trễ ước tính | Reliability |
|-----|---------------------|---------------|-----------------|-------------|
| | | | | |
```

#### Bước 3: Xác định lực nào resolution-relevant

Từ danh sách active forces, lọc: **lực nào ảnh hưởng trực tiếp đến P₂ (event thỏa resolution)?**

Phân loại:

| Loại | Định nghĩa | Hành động |
|------|-----------|-----------|
| **Gate force** | Nếu lực này chặn, chủ thể KHÔNG THỂ thỏa resolution bất kể mọi thứ khác | Phải monitor liên tục. Nếu gate force bearish + reliability ≥ 4 → giảm P₂ mạnh |
| **Accelerator** | Lực đẩy nhanh chủ thể đến resolution nhưng không phải điều kiện đủ | Update P₂ theo LR moderate |
| **Friction** | Lực làm chậm nhưng không chặn hoàn toàn | Update P₂ theo LR weak |
| **Noise** | Có ảnh hưởng về narrative nhưng không chạm mechanism thật của chủ thể | Không update P₂. Chỉ note cho microstructure analysis |

#### Bước 4: Vẽ dependency chain

Cho mỗi gate force, vẽ: **lực này phụ thuộc vào gì để thay đổi?**

Ví dụ:
```text
GPU supply (Vòng 2)
  ← TSMC CoWoS capacity (Vòng 2)
    ← TSMC capex decision (Vòng 3: capital markets)
      ← AI demand forecast (Vòng 3: macro)
  ← NVIDIA allocation priority (Vòng 2)
    ← Customer tier (Vòng 2: partner)
    ← Export control (Vòng 3: geopolitics)
```

Dependency chain giúp bạn:
- Thấy được risk concentration: nếu nhiều gate forces cùng phụ thuộc 1 gốc (ví dụ: TSMC), đó là single point of failure.
- Chỉ rõ leading indicators: thay vì đợi GPU supply thay đổi, theo dõi TSMC capex và export control sẽ cho signal sớm hơn.

#### Bước 5: Kiểm tra interaction effects

Không phải lực nào cũng tác động độc lập. Hỏi:

**"Có 2 lực nào mà khi xảy ra đồng thời sẽ tạo hiệu ứng lớn hơn tổng?"**

Ví dụ:
- Competitor release (Vòng 2) + internal safety review delay (Vòng 1) = công ty vừa bị áp lực ship nhanh vừa bị chặn bởi safety → kết quả: hoặc rush (quality risk), hoặc delay lâu hơn dự kiến (miss deadline).
- Export control tightening (Vòng 3) + cloud capacity constraint (Vòng 2) = double bottleneck trên serving capacity → kết quả: partial rollout thay vì GA → resolution might not count.

Ghi lại interaction effects vào scenario tree (T4 trong framework chính).

---

### Checklist Force Map — dùng nhanh

```text
□ Chủ thể đã xác định rõ (1 câu)
□ Vòng 1: liệt kê active forces (≥ 3)
□ Vòng 2: liệt kê active forces (≥ 3)
□ Vòng 3: liệt kê active forces (≥ 2)
□ Phân loại: gate / accelerator / friction / noise
□ Mỗi gate force có dependency chain
□ Kiểm tra interaction effects (≥ 1 pair)
□ Gate forces đã feed vào T4 probability engine
□ Leading indicators từ dependency chain đã thêm vào T8 monitoring
```

---

### Giới hạn của Force Map

1. **Completeness illusion.** Bản đồ lực trông toàn diện nhưng luôn có lực bạn không biết tồn tại cho đến khi nó xuất hiện. Force Map giảm blind spots nhưng không loại bỏ hoàn toàn.
2. **Reliability of absence.** Nhiều lực được phát hiện qua "không thấy signal" (ví dụ: "chưa có model card" → safety review chưa xong). Absence of evidence không phải evidence of absence. Framework đánh reliability thấp hơn cho absence-based signals (tối đa 3), nhưng người dùng vẫn có thể overweight chúng.
3. **Lag in observable signals.** Đa số signal ở Vòng 1 là lagging (bạn thấy sau khi quyết định đã được đưa ra bên trong công ty). Force Map không thay thế insider information — nó chỉ giúp bạn đọc tín hiệu công khai có hệ thống hơn.
4. **Interaction effects are combinatorial.** Với 20 active forces, có 190 cặp tương tác. Không thể kiểm tra hết. Framework yêu cầu kiểm tra ít nhất 1 pair, nhưng lý tưởng nên focus vào pairs mà cả hai đều là gate forces hoặc strong accelerators.

---

## T4: Probability Engine

### Luôn tách 3 xác suất

| Ký hiệu | Ý nghĩa | Ví dụ |
|----------|---------|-------|
| P₁ | P(event thật xảy ra) | "Model thực sự được release" |
| P₂ | P(event thỏa resolution wording) | "Model release đúng cách market define: public, đúng tên, trước deadline" |
| P₃ | P(market đang misprice P₂) | "Market đang 72% nhưng P₂ thật là 85%" |

**Bạn trade theo P₂. Không bao giờ trade theo P₁.**

P₂ ≤ P₁ luôn luôn đúng (event thỏa rule là tập con của event xảy ra). Nếu bạn tính ra P₂ > P₁, có lỗi logic — dừng lại kiểm tra.

Edge = |P₂ − Market implied probability| − transaction costs (spread + fees).

**Nếu edge sau costs < 3%, không trade.** Edge nhỏ hơn 3% dễ bị xóa bởi noise, timing risk, và sai số ước lượng của chính bạn.

### Log-odds updating

**Tại sao không dùng cộng/trừ điểm tuyệt đối:**
- Update +10 điểm từ 90% → 100% là vô lý.
- Update +10 điểm từ 50% → 60% có thể hợp lý.
- Log-odds xử lý tự nhiên: cùng một evidence strength tạo ra thay đổi nhỏ hơn ở vùng cực và lớn hơn ở vùng giữa.

**Cách dùng:**
1. Chọn prior P₂.
2. Tra bảng → log-odds.
3. Mỗi signal → gán likelihood ratio (LR).
4. Cộng log(LR) vào log-odds.
5. Tra bảng ngược → posterior P₂.

### Bảng tra nhanh: Probability ↔ Log-odds

| P | Log-odds | | P | Log-odds |
|----:|--------:|---|----:|--------:|
| 5% | −2.94 | | 55% | 0.20 |
| 10% | −2.20 | | 60% | 0.41 |
| 15% | −1.73 | | 65% | 0.62 |
| 20% | −1.39 | | 70% | 0.85 |
| 25% | −1.10 | | 75% | 1.10 |
| 30% | −0.85 | | 80% | 1.39 |
| 35% | −0.62 | | 85% | 1.73 |
| 40% | −0.41 | | 90% | 2.20 |
| 45% | −0.20 | | 95% | 2.94 |
| 50% | 0.00 | | | |

*Log-odds = ln(P / (1−P))*

### Bảng LR theo signal strength

| Signal strength | LR bullish | LR bearish | log(LR) bull | log(LR) bear | Khi nào dùng |
|----------------|-----------|-----------|-------------|-------------|-------------|
| Very weak | 1.1 | 0.91 | +0.10 | −0.10 | Tier 1–2 reliability, relevance 1–2 |
| Weak | 1.25 | 0.80 | +0.22 | −0.22 | Tier 2–3 reliability, relevance 2–3 |
| Moderate | 1.5 | 0.67 | +0.41 | −0.41 | Tier 3 reliability + relevance 3–4, hoặc tier 4 + relevance 4 |
| Strong | 2.0 | 0.50 | +0.69 | −0.69 | Tier 4 reliability + relevance 4–5 |
| Very strong | 3.0 | 0.33 | +1.10 | −1.10 | Tier 5 reliability + relevance 5 |
| Decisive | 5.0 | 0.20 | +1.61 | −1.61 | Chỉ khi signal đơn lẻ gần như settle market |

### Quy tắc dùng LR

1. **Chỉ signal reliability ≥ 3 mới được update.** Signal tier 1–2 chỉ để theo dõi, không update probability.
2. **Chỉ dùng "Very strong" hoặc "Decisive" khi reliability = 5 VÀ relevance = 5.** Mọi trường hợp khác tối đa "Strong".
3. **Counter-view quality "Real" hoặc "Strong" → giảm 1 bậc LR.** Ví dụ: Strong → Moderate.
4. **Correlated signals không cộng dồn full.** Nếu 3 signal cùng từ một sự kiện gốc (ví dụ: cùng từ một blog post), chỉ tính signal mạnh nhất full LR, còn lại giảm 2 bậc.
5. **Giới hạn tổng update mỗi phiên:** tổng |log(LR)| cho một phiên research không vượt 2.5, tương đương khoảng chuyển từ 30% → 75% hoặc ngược lại. Nếu evidence mạnh hơn thế, bạn cần dừng lại, sleep on it, và review lại ngày hôm sau. Mục đích: chống overreaction trong một phiên.

### Ví dụ update

Prior: P₂ = 40% → log-odds = −0.41

| # | Signal | LR class | log(LR) | Cumulative log-odds | Implied P₂ |
|---|--------|----------|---------|---------------------|-----------|
| — | Prior | — | — | −0.41 | 40% |
| 1 | Official blog confirms timeline | Strong bullish | +0.69 | +0.28 | 57% |
| 2 | GitHub shows prep branch (correlated with #1) | Reduced to Very weak | +0.10 | +0.38 | 59% |
| 3 | Competitor leak suggests delay pressure | Moderate bearish | −0.41 | −0.03 | 49% |
| 4 | Partner doc mentions integration ready | Moderate bullish | +0.41 | +0.38 | 59% |

Posterior P₂ ≈ 59%. Tổng |log(LR)| = 1.61, dưới giới hạn 2.5.

---

## T5: Risk & Sizing

### Unit definition

Trước khi dùng hệ thống, phải định nghĩa 1 unit = bao nhiêu $ hoặc bao nhiêu % bankroll. Đề xuất:

| Bankroll | 1 unit | Max single bet |
|----------|--------|---------------|
| < $1,000 | $20 | $60 (3 units) |
| $1,000–$5,000 | $50 | $150 |
| $5,000–$20,000 | $100–$200 | $400–$600 |
| $20,000–$100,000 | $200–$500 | $1,000–$1,500 |
| > $100,000 | $500–$1,000 | $2,000–$3,000 |

Cập nhật unit definition mỗi tháng theo bankroll thực tế.

### Position sizing matrix

| Edge (sau costs) | Resolution confidence | Size |
|-------------------|-----------------------|------|
| 3–6% | High | 0.5 unit |
| 3–6% | Medium | 0.25 unit hoặc skip |
| 3–6% | Low | Skip |
| 7–12% | High | 1 unit |
| 7–12% | Medium | 0.5 unit |
| 7–12% | Low | 0.25 unit hoặc skip |
| 13–20% | High | 2 units |
| 13–20% | Medium | 1 unit |
| 13–20% | Low | 0.5 unit |
| > 20% | High | 3 units (cần peer challenge) |
| > 20% | Medium | 1.5 units |
| > 20% | Low | 0.5 unit |

**Hard caps:**
- Không bao giờ vượt 3 units / kèo.
- Không bao giờ vượt 3% bankroll / kèo.
- Không bao giờ vượt 8% bankroll / correlation bucket.
- Không bao giờ vượt 15% bankroll tổng exposure mở.

### Correlation buckets

Mỗi kèo phải được gắn tag:

| Bucket type | Ví dụ | Tại sao nguy hiểm |
|-------------|-------|-------------------|
| Same company | 3 kèo về OpenAI | Một thông báo bất ngờ đảo tất cả |
| Same infra | 2 kèo phụ thuộc AWS us-east-1 | Một outage ảnh hưởng cả hai |
| Same resolution source | 3 kèo dùng cùng status page | Status page sai → tất cả resolve sai |
| Same narrative | 4 kèo "AI race Q2 2025" | Một policy change ảnh hưởng toàn bộ |
| Same macro | Kèo phụ thuộc chip supply + kèo phụ thuộc export control | Cùng gốc geopolitical |

**Cách tính exposure cụm:**
- Liệt kê tất cả kèo trong bucket.
- Tổng units = Σ units từng kèo.
- Nếu tổng units > 4 hoặc tổng $ > 8% bankroll: phải giảm, ưu tiên giữ kèo có edge/unit cao nhất.
- Khi thêm kèo mới vào bucket đã gần đầy: kèo mới phải có edge cao hơn kèo yếu nhất trong bucket, nếu không thì không thêm.

### Kill switches

| # | Trigger | Hành động | Timeline |
|---|---------|-----------|----------|
| 1 | Rule clarification thay đổi settlement logic | Thoát 100% | Ngay lập tức |
| 2 | Official source mâu thuẫn trực tiếp với thesis | Giảm ≥ 50% | Trong 1 giờ |
| 3 | Related market incoherent mà không giải thích được | Giảm 50% + deep review | Trong 4 giờ |
| 4 | Liquidity biến mất / spread mở > 8% | Giảm đến mức exit được | Khi thấy |
| 5 | Không còn viết được bull case hoặc bear case trung thực | Thoát 100% | Trong 24 giờ |
| 6 | Bankroll giảm > 10% trong 1 tuần từ mọi kèo cộng lại | Thoát 50% tất cả vị thế, reset readiness gate | Ngay lập tức |

---

## T6: Anti-bias Gate

**Đây là gate, không phải gợi ý.** Nếu không hoàn thành T6, không được vào lệnh.

### 6.1 Devil's advocate block

Viết ra giấy/file, không chỉ nghĩ trong đầu:

1. **3 lý do mạnh nhất thesis sai:**
   - (a)
   - (b)
   - (c)

2. **1 kịch bản market resolve ngược dù event thật đúng:**
   - Ví dụ: model release thật nhưng tên khác → market resolve No.

3. **1 trigger cụ thể khiến tôi flip side:**
   - Phải là observable event, không phải "nếu tôi sai thì tôi đổi ý" (tautology).

4. **Pre-mortem:** "Giả sử 3 tuần sau kèo này thua nặng. Lý do có khả năng nhất là: ___"

### 6.2 Anti-anchoring protocol

Khi review kèo đang có vị thế:
1. **Tính lại P₂ từ đầu** dựa trên evidence hiện tại, TRƯỚC khi nhìn giá entry hay giá market hiện tại.
2. So P₂ mới với market price.
3. Chỉ sau đó mới nhìn giá entry để biết P&L.

Mục đích: tách quyết định "giữ hay không" khỏi cảm giác "đang lãi/lỗ bao nhiêu".

### 6.3 Commitment device

Trước khi vào lệnh, viết 1 câu:
> "Tôi sẽ thoát hoặc giảm vị thế nếu [trigger cụ thể] xảy ra, bất kể lúc đó tôi cảm thấy thế nào."

Câu này phải gắn vào journal card. Khi trigger xảy ra, bạn thực hiện theo, không cho phép "nhưng lần này khác".

---

## T7: Execution

### Checklist trước khi bấm nút

| # | Kiểm tra | ✓ |
|---|---------|---|
| 1 | Readiness gate: Full hoặc Restricted (với size đã giảm) | |
| 2 | Triage score ≥ 45 | |
| 3 | Resolution sheet hoàn chỉnh | |
| 4 | P₂ đã tính | |
| 5 | Edge sau costs ≥ 3% | |
| 6 | Size nằm trong matrix và không vi phạm hard cap | |
| 7 | Correlation bucket chưa đầy | |
| 8 | Kill switch đã xác định | |
| 9 | Devil's advocate đã viết | |
| 10 | Commitment device đã viết | |
| 11 | Journal card đã mở | |
| 12 | Monitoring alert đã đặt | |

**Nếu bất kỳ ô nào chưa tick, không vào lệnh.**

### Execution notes

- Nếu spread lớn: dùng limit order, không market order.
- Nếu muốn vào 2+ units: chia thành 2–3 lần vào, cách nhau ít nhất 2 giờ, để tránh impact và cho phép thay đổi ý nếu có thông tin mới.
- Ghi lại: thời điểm vào, giá vào, size thực tế, spread lúc vào.

---

## T8: Monitoring, Manipulation & Thesis Update

### Monitoring cadence

| Loại kèo | Tần suất check | Sources cố định |
|-----------|----------------|-----------------|
| Đáo hạn < 3 ngày | 3–4 lần/ngày | Primary resolution source + 2 related markets + 1 social feed |
| Đáo hạn 3–14 ngày | 1–2 lần/ngày | Primary source + related markets |
| Đáo hạn > 14 ngày | 1 lần/ngày + keyword alert | Primary source khi có alert |

### Signal classification

Mỗi thông tin mới phải được phân loại TRƯỚC khi update:

| Loại | Định nghĩa | Hành động |
|------|-----------|-----------|
| Thesis-confirming | Hỗ trợ thesis hiện tại | Ghi nhận, update P₂ theo LR, NHƯNG chủ động tìm counter-view |
| Thesis-damaging | Phản bác thesis | Update P₂ theo LR. Nếu 2+ thesis-damaging signals liên tiếp → full review |
| Noise | Không reliability, không relevance | Ghi nhận, không update |
| Unknown-important | Chưa hiểu ý nghĩa nhưng cảm thấy quan trọng | Ghi nhận, đặt alert, chờ clarification. KHÔNG update dựa trên cảm giác. |

### Khi nào BẮT BUỘC update P₂

| Trigger | Hành động |
|---------|-----------|
| Signal mới reliability ≥ 4, relevance ≥ 4 | Full LR update |
| Official source đổi wording | Re-do toàn bộ resolution sheet |
| Market move > 10 điểm mà bạn chưa giải thích | Dừng, research lý do, rồi mới quyết định |
| Edge case chuyển từ hypothetical → thực tế | Re-evaluate resolution confidence |
| Kill switch #1 hoặc #2 triggered | Thoát/giảm trước, phân tích sau |

### Khi nào KHÔNG update

- Social chatter lặp lại cùng thông tin cũ.
- Price move không kèm source mới.
- Cùng một dữ kiện được diễn giải lại bởi outlet khác.
- Bạn "cảm thấy" market sắp chạy mà không có evidence mới.

### Manipulation protocol

**Nguyên tắc:** nếu price move mà source layer không đổi, mặc định coi đó là microstructure event, không phải information event.

**Khi phát hiện price jump không có source mới:**

```
Bước 1: Đánh dấu = microstructure event
Bước 2: KHÔNG chase
         → Market dày (spread < 3%): chờ 60–90 phút
         → Market mỏng (spread > 3%): chờ 4–6 giờ
Bước 3: Kiểm tra 3 thứ:
         □ Related markets có move coherent không?
         □ Source tier 1–2 mới có xuất hiện không?
         □ Volume/spread có bất thường (spike rồi tắt)?
Bước 4: Chỉ reprice nếu:
         → Source mới tier 1–2 xuất hiện, HOẶC
         → 3+ related markets cùng move hợp logic
Bước 5: Nếu không thỏa bước 4:
         → Ghi nhận là noise
         → Giữ nguyên P₂
         → Nếu price move tạo edge lớn hơn: cân nhắc thêm vị thế
            (vì market đang cho bạn giá tốt hơn mà source không đổi)
```

**Dấu hiệu manipulation / wash / narrative coordination:**
- Volume spike rồi lịm ngay, không sustain.
- Nhiều account social mới cùng đẩy 1 screenshot.
- Related markets không move coherent.
- Spread nới rộng cùng lúc với price move (cho thấy market maker rút liquidity, không phải informed flow).

---

## T9: Journal, Calibration & Postmortem

### Journal Card — điền khi vào lệnh, cập nhật suốt vòng đời kèo

```
[JOURNAL CARD]
ID: [mã kèo, ví dụ PM-2025-042]
Market:
URL:
Date opened:

TRIAGE
Score: ___/100
Track: Light / Standard / Deep

RESOLUTION
Binary statement: Yes if ___ / No if ___
Resolution confidence: High / Medium / Low
Top edge case:

THESIS
Direction: Buy Yes / Buy No
Initial P₂:
Market price at entry:
Edge at entry:
Bull case (2 câu):
Bear case (2 câu):
Key unknown:

EXECUTION
Size: ___ units / $___ / ___% bankroll
Entry price:
Entry date/time:
Correlation bucket:
Kill switch:
Commitment device:
Devil's advocate summary:

UPDATES LOG
| Date | New signal | Classification | LR | New P₂ | Action taken |
|------|-----------|---------------|-----|--------|-------------|
| | | | | | |

EXIT
Exit date:
Exit price:
P&L:
Reason for exit:

POSTMORTEM (điền sau khi market resolve)
Final outcome: Yes / No
Was thesis correct about event: Yes / No
Was thesis correct about resolution: Yes / No
Brier contribution: ___
Main error type: None / Fact / Rule / Timing / Sizing / Discipline / Manipulation
What I would do differently:
Lesson for future:
```

### Brier Score

Sau mỗi kèo đã resolve, tính:

**Brier = (forecast probability − actual outcome)²**

Trong đó actual outcome = 1 nếu Yes, 0 nếu No. Forecast probability = P₂ cuối cùng trước khi kèo resolve.

Ví dụ: bạn forecast P₂ = 0.75, market resolve Yes → Brier = (0.75 − 1)² = 0.0625.
Bạn forecast P₂ = 0.75, market resolve No → Brier = (0.75 − 0)² = 0.5625.

**Brier thấp = tốt.** Perfect = 0. Worst = 1. Baseline (random) = 0.25.

### Calibration Review — mỗi 25 kèo

Gom tất cả kèo đã resolve thành buckets:

| Bucket forecast | Số kèo | Số lần Yes thực tế | % Yes thực tế | Calibrated? |
|-----------------|--------|---------------------|---------------|------------|
| 50–59% | | | | |
| 60–69% | | | | |
| 70–79% | | | | |
| 80–89% | | | | |
| 90–100% | | | | |

**Cách đọc:** nếu bạn forecast 70–79% cho 10 kèo và chỉ 5 kèo resolve đúng (50%), bạn đang **overconfident** ở bucket đó.

**Hành động cụ thể khi phát hiện miscalibration:**

| Phát hiện | Hành động |
|-----------|-----------|
| Overconfident ở bucket X (ví dụ: forecast 80%, win rate 65%) | Giảm LR tối đa 1 bậc cho mọi signal strong/very strong ở kèo tương tự trong 25 kèo tiếp theo. Review lại xem có đang overweight source tier nào không. |
| Underconfident ở bucket X (ví dụ: forecast 60%, win rate 80%) | Xem lại có đang discount signal mạnh quá mức không. Cho phép tăng 1 bậc LR nếu có evidence. |
| Thua chủ yếu vì "Rule" error | Tăng thời gian T2 thêm 50%. Thêm 3 edge case vào resolution sheet. |
| Thua chủ yếu vì "Sizing" error | Giảm hard cap xuống 1 bậc cho 25 kèo tiếp theo. |
| Thua chủ yếu vì "Discipline" error | Tăng readiness gate thành 3/4 câu phải Yes. Thêm rule: nghỉ 24h sau mỗi kèo thua > 1 unit. |

Đây là feedback loop đóng kín: output calibration → thay đổi quy trình cụ thể → kèo tiếp theo được research/trade khác đi → đo lại.

### Source calibration

Sau 25 kèo, kiểm tra:

| Source tier | Số lần dùng làm signal decisive | Số lần signal đó dẫn đến outcome đúng | Accuracy |
|-------------|-------------------------------|--------------------------------------|----------|
| Tier 1 | | | |
| Tier 2 | | | |
| Tier 3 | | | |
| Tier 4 | | | |

Nếu một tier có accuracy < 50%, bạn đang overweight tier đó. Giảm max LR cho tier đó 1 bậc.

### Failure taxonomy

Phân loại mọi kèo thua:

| Error type | Định nghĩa | Ví dụ |
|------------|-----------|-------|
| Fact | Event thật xảy ra khác dự đoán | Model không được release |
| Rule | Event đúng nhưng không match resolution | Model release nhưng tên khác |
| Timing | Event xảy ra ngoài deadline | Release 2 ngày sau cutoff |
| Sizing | Thesis đúng nhưng size quá lớn, bị margin call hoặc thua vì spread | |
| Discipline | Không theo kill switch, không theo commitment device | |
| Manipulation | Market bị wash trade hoặc dispute bất thường | |

---

## Peer Challenge Protocol

**Khi nào bắt buộc:** vị thế ≥ 2 units HOẶC ≥ 2% bankroll HOẶC triage = Deep Track.

**Ai review:** một người có kinh nghiệm prediction market, KHÔNG phải người cùng thesis với bạn.

**Reviewer phải trả lời 5 câu:**

1. Điểm mù resolution lớn nhất là gì?
2. Signal nào đang được overweight?
3. Bearish case mạnh nhất (nếu bạn đang long Yes) hoặc bullish case mạnh nhất (nếu bạn đang long No)?
4. Size có hợp lý với edge và ambiguity?
5. Nếu reviewer phải bet ngược bạn, evidence nào họ sẽ dùng?

**Sau khi nhận review:**
- Nếu reviewer tìm được resolution ambiguity bạn bỏ sót → re-do T2.
- Nếu reviewer cho rằng overweight → giảm LR signal tương ứng 1 bậc.
- Nếu reviewer không tìm được gì mới → proceed, nhưng ghi nhận vào journal.

**Nếu không có ai review (solo trader):**
- Dùng "time-delayed self-review": viết thesis hôm nay, chờ 24h, đọc lại với mắt mới, viết lại bear case.
- Hạn chế: kém hơn peer review thật, nhưng tốt hơn không làm gì.
- Nếu solo và size ≥ 3 units: giảm xuống 2 units. Solo trader không được dùng max size.

---

## Portfolio Management

### Dashboard hàng tuần

| Metric | Giá trị | Ngưỡng cảnh báo |
|--------|---------|-----------------|
| Tổng vị thế mở (units) | | > 15 units |
| Tổng exposure (% bankroll) | | > 15% |
| Bucket lớn nhất (units) | | > 4 units |
| Số kèo mở | | > 10 |
| Kèo đáo hạn trong 7 ngày | | > 5 (quá tải monitoring) |
| Win rate 25 kèo gần nhất | | < 45% (review process) |
| Average Brier 25 kèo gần nhất | | > 0.22 (worse than naive) |

Nếu bất kỳ metric nào vượt ngưỡng cảnh báo: dừng mở kèo mới, review portfolio, giảm exposure nếu cần.

### Rebalancing rule

Mỗi tuần:
1. Review tất cả vị thế mở.
2. Tính lại P₂ cho mỗi kèo dựa trên evidence hiện tại (anti-anchoring: không nhìn entry price trước).
3. So P₂ mới với market price → recalculate edge.
4. Nếu edge < 2% sau costs → thoát.
5. Nếu edge vẫn lớn nhưng correlation bucket đã đầy → giảm kèo yếu nhất trong bucket.

---

## Hai template tách biệt

### TEMPLATE LIGHT (cho kèo 45–64 điểm triage)

```
Market:
Current odds:
Time left:
Triage score: ___/100

Rule summary (2 câu):
Yes if:
No if:
Resolution confidence: High / Medium / Low

Quick scan 6 buckets (1 dòng mỗi cái):
1. Official:
2. Execution:
3. External:
4. Competition:
5. Narrative:
6. Related markets:

P₁:
P₂:
Market:
Edge:
Size: ___ units
Kill switch:
Devil's advocate (1 câu):
Review time:
```

### TEMPLATE FULL (cho kèo 65+ điểm triage)

```
═══════════════════════════════════════════
MARKET HEADER
═══════════════════════════════════════════
Market:
URL:
Current odds:
Liquidity:
Spread:
Time left:
Related markets:

═══════════════════════════════════════════
T0: READINESS & TRIAGE
═══════════════════════════════════════════
Readiness: Full / Restricted / Monitor-only
Rule clarity (0-2): ___  × 3 = ___
Preliminary edge (0-2): ___  × 2 = ___
Liquidity (0-2): ___  × 2 = ___
Time left (0-2): ___  × 1 = ___
Total: ___/16 → ___/100
Track: Light / Standard / Deep

═══════════════════════════════════════════
T2: RESOLUTION SHEET
═══════════════════════════════════════════
Exact rule (copy nguyên văn):


Primary resolution source:
Secondary source:
Timezone / cutoff:
Alternative settlement:
Challenge/dispute path:

Binary statement:
  YES if:
  NO if:

What counts:
1.
2.
3.
4.
5.

What doesn't count:
1.
2.
3.
4.
5.

Edge cases "tưởng Yes nhưng No":
1.
2.
3.
4.
5.

Dispute map:
  Evidence cho Yes:
  Evidence cho No:
  Source có thể bị xóa/sửa:
  Archive backup:

Resolution confidence: High / Medium / Low

Three sentences:
1. Market đang đo:
2. Market KHÔNG đo:
3. Event kiểu ___ thì tưởng Yes nhưng No vì:

═══════════════════════════════════════════
T3: RESEARCH
═══════════════════════════════════════════
[6 BUCKET SCAN]
1. Official source:
2. Internal execution:
3. External systems:
4. Competitive pressure:
5. Narrative / social:
6. Related markets / microstructure:

[SIGNAL MATRIX - Deep Track]
| # | Signal | Source | Tier | Reliability | Res.rel | Timing | Direction | Counter-view | Counter quality | LR used |
|---|--------|--------|------|-------------|---------|--------|-----------|-------------|----------------|---------|
| 1 | | | | | | | | | | |
| 2 | | | | | | | | | | |
| 3 | | | | | | | | | | |
| 4 | | | | | | | | | | |
| 5 | | | | | | | | | | |

═══════════════════════════════════════════
T4: PROBABILITY
═══════════════════════════════════════════
P₁ (event thật):
P₂ (thỏa resolution):
Check: P₂ ≤ P₁? □

Prior P₂:
Prior log-odds:

Update log:
| # | Signal | LR class | log(LR) | Cum. log-odds | Implied P₂ |
|---|--------|----------|---------|---------------|-----------|
|   | Prior  |    —     |    —    |               |           |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

Total |log(LR)|: ___ (phải < 2.5)
Posterior P₂:
Market implied P:
Edge (raw): ___
Edge (sau costs): ___
Edge ≥ 3%? □

═══════════════════════════════════════════
T5: RISK & SIZING
═══════════════════════════════════════════
Direction: Buy Yes / Buy No
Size from matrix: ___ units
Resolution confidence adjustment: ___
Final size: ___ units / $___
% bankroll: ___

Correlation bucket:
Other positions in bucket:
Total bucket exposure: ___ units / ___% bankroll
Within bucket limit? □

All hard caps met? □
  Single bet ≤ 3 units □
  Single bet ≤ 3% bankroll □
  Bucket ≤ 8% bankroll □
  Total ≤ 15% bankroll □

Kill switches:
1.
2.
3.

═══════════════════════════════════════════
T6: ANTI-BIAS GATE
═══════════════════════════════════════════
3 reasons thesis may be wrong:
1.
2.
3.

1 way market resolves against intuition:


1 specific trigger to flip side:


Pre-mortem:
"If this bet loses badly in 3 weeks, the most likely reason is: ___"

Commitment device:
"I will exit/reduce if ___ happens, regardless of how I feel."

Anti-anchoring acknowledged: □
(Will recalculate P₂ from scratch before checking entry price)

═══════════════════════════════════════════
T7: EXECUTION
═══════════════════════════════════════════
Pre-flight checklist:
  Readiness ✓ □
  Triage ≥ 45 □
  Resolution sheet complete □
  P₂ calculated □
  Edge ≥ 3% □
  Size within matrix □
  Correlation bucket OK □
  Kill switch defined □
  Devil's advocate written □
  Commitment device written □
  Journal card open □
  Monitoring alerts set □

Entry date/time:
Entry price:
Actual size:
Spread at entry:
Order type: Limit / Market

═══════════════════════════════════════════
T8: MONITORING
═══════════════════════════════════════════
Check cadence: ___x/day
Sources to check:
1.
2.
3.
Alert keywords:

Update log:
| Date | Signal | Class | LR | New P₂ | Action |
|------|--------|-------|----|--------|--------|
| | | | | | |

═══════════════════════════════════════════
T9: POSTMORTEM (after resolution)
═══════════════════════════════════════════
Exit date:
Exit price:
P&L: $___
Final outcome: Yes / No

Thesis correct about event? Y/N
Thesis correct about resolution? Y/N
Brier contribution:
Main error type: None / Fact / Rule / Timing / Sizing / Discipline / Manipulation
What I would do differently:
Lesson:
```

---

## Meta-review: Framework tự cải tiến

Mỗi 50 kèo (hoặc mỗi quý, tùy cái nào đến trước), review chính framework:

| Câu hỏi | Hành động nếu Yes |
|---------|-------------------|
| Có loại lỗi nào lặp lại > 3 lần mà framework chưa chặn? | Thêm checkpoint mới |
| Có bước nào luôn bị skip vì quá nặng? | Đơn giản hóa hoặc merge |
| Có nguồn nào consistently unreliable mà tier đang quá cao? | Hạ tier |
| Calibration có cải thiện so với 50 kèo trước? | Nếu không: root-cause analysis |
| Triage có lọc đúng không? (kèo bỏ có nên bỏ thật không?) | Spot-check 10 kèo đã skip |
| Solo mode có đủ chặt không? | Nếu loss rate solo > peer-reviewed: tìm peer |

Output meta-review là **1 bản changelog**: "từ kèo #51, thay đổi X vì Y". Ghi lại để tránh lặp.

---

## Minimum Viable Subset

Nếu toàn bộ framework trên quá nặng cho giai đoạn đầu, hãy bắt đầu với đúng 5 thứ này — chỉ 5 thứ — và không bao giờ skip bất kỳ thứ nào trong 5:

1. **Weighted triage** → không lãng phí thời gian vào kèo không đáng.
2. **Binary settlement statement** ("Yes nếu…, No nếu…") → chặn lỗi resolution.
3. **Tách P₁ và P₂** → chặn lỗi "đúng fact nhưng thua kèo".
4. **Position sizing matrix** → chặn cháy tài khoản.
5. **Journal card** → chặn lặp lại sai lầm cũ.

Khi 5 thứ này đã thành thói quen (sau khoảng 20–30 kèo), thêm dần: log-odds updating, devil's advocate gate, correlation buckets, peer challenge, calibration review. Mỗi lần thêm 1 thứ, dùng 15–20 kèo để thuần thục trước khi thêm thứ tiếp theo.

---

## Giới hạn của framework này

Không framework nào hoàn hảo. Đây là những giới hạn mà hệ thống này thừa nhận và không giả vờ giải quyết được:

1. **Thông tin kín.** Nếu insider biết điều bạn không biết, không research nào cứu được. Framework giảm thiểu rủi ro này bằng source hierarchy và multi-source requirement, nhưng không loại bỏ hoàn toàn.

2. **Black swan.** Chiến tranh, thiên tai, sự kiện chưa từng có tiền lệ. Framework dùng external system bucket và kill switch để phản ứng, nhưng không dự đoán được.

3. **Oracle failure.** Nếu UMA vote sai hoặc bị manipulate ở mức hệ thống, framework không giúp được. Dispute map chỉ giúp nếu hệ thống dispute còn hoạt động đúng.

4. **Bản thân người dùng.** Framework cưỡng chế tốt hơn ý chí, nhưng nếu bạn chủ động bypass (bỏ qua kill switch, không viết devil's advocate, không ghi journal), không gì cứu được. Kỷ luật vẫn là yếu tố cuối cùng.

5. **Sample size nhỏ.** Calibration review cần ít nhất 25 kèo mỗi bucket để có ý nghĩa thống kê. Với 5 calibration buckets, bạn cần 125+ kèo đã resolve mới có bức tranh đầy đủ. Trước mốc đó, calibration review chỉ mang tính chỉ dẫn, không phải kết luận.

6. **Framework này chưa được back-test trên dữ liệu lịch sử Polymarket.** Nó được xây từ first principles, kinh nghiệm trading, và lý thuyết forecasting/decision-making. Hiệu quả thực tế chỉ được chứng minh khi bạn dùng nó và đo kết quả — đó là lý do T9 và meta-review tồn tại.