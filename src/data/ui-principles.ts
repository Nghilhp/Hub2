import { BRAND_NAME } from '@/data/brand'

export type PriorityLevel = {
  level: string
  title: string
  meaning: string
  examples: string
  uiRule: string
}

export type ScopeItem = {
  title: string
  description: string
}

export type UsageItem = {
  timing: string
  description: string
}

export type Principle = {
  number: number
  title: string
  vietnameseTitle: string
  summary: string
  description: string
  guidelines: string[]
  criteria: string[]
  reasons: string[]
}

export const projectGoals = [
  'Nâng cao trải nghiệm người dùng (UX): Giúp người dùng thực hiện tác vụ nhanh chóng, dễ dàng và giảm thiểu lỗi.',
  'Tạo sự nhất quán (Consistency): Đảm bảo các thành phần giao diện như nút, màu sắc, phông chữ đồng bộ trên toàn bộ sản phẩm, giúp người dùng không bị bối rối.',
  'Tăng khả năng tương tác và thu hút: Tạo ra giao diện không chỉ hoạt động tốt mà còn đẹp mắt, thu hút người dùng muốn tương tác lâu hơn.',
  'Định hướng người dùng và tối ưu hóa hiệu suất: Giúp người dùng hiểu rõ hệ thống đang làm gì, trạng thái hệ thống ra sao, họ có thể làm gì tiếp theo và giảm thời gian học cách sử dụng sản phẩm.',
]

export const inScopeItems: ScopeItem[] = [
  {
    title: 'Hierarchy',
    description: 'Phân cấp thông tin',
  },
  {
    title: 'Layout structure',
    description: 'Cấu trúc bố cục',
  },
  {
    title: 'Alignment and spacing rhythm',
    description: 'Căn chỉnh và nhịp điệu khoảng cách',
  },
  {
    title: 'CTA clarity',
    description: 'Độ rõ ràng của CTA',
  },
  {
    title: 'Information grouping',
    description: 'Nhóm thông tin',
  },
  {
    title: 'Visual consistency',
    description: 'Tính nhất quán thị giác',
  },
  {
    title: 'State and feedback clarity',
    description: 'Độ rõ ràng của trạng thái và phản hồi',
  },
  {
    title: 'UI scalability',
    description: 'Khả năng mở rộng của UI',
  },
  {
    title: 'Brand expression in product UI',
    description: 'Tính thương hiệu trong giao diện sản phẩm',
  },
]

export const outOfScopeItems: ScopeItem[] = [
  {
    title: 'Detailed motion principle',
    description: 'Nguyên tắc motion chi tiết',
  },
  {
    title: 'Illustration style guideline',
    description: 'Guideline về phong cách minh họa',
  },
  {
    title: 'Full service design methodology',
    description: 'Toàn bộ trải nghiệm dịch vụ end-to-end của user',
  },
  {
    title: 'Research methodology',
    description: 'Phương pháp nghiên cứu',
  },
  {
    title: 'Technical implementation specs',
    description: 'Đặc tả triển khai kỹ thuật',
  },
  {
    title: 'Brand strategy at company level',
    description: 'Chiến lược thương hiệu cấp công ty',
  },
]

export const priorityLevels: PriorityLevel[] = [
  {
    level: 'P0',
    title: 'Critical information',
    meaning:
      'Thông tin không được phép bị miss hoặc hiểu sai, vì ảnh hưởng trực tiếp đến tiền, rủi ro, trạng thái hoặc quyết định quan trọng của user.',
    examples:
      'Số tiền, người nhận, phí, trạng thái giao dịch, lỗi thanh toán, KYC wall, thiếu số dư, vượt hạn mức.',
    uiRule:
      'Phải rõ, dễ thấy, không bị banner, campaign hoặc content phụ lấn át. Luôn ưu tiên trên P1-P4 trong flow utility hoặc tài chính.',
  },
  {
    level: 'P1',
    title: 'Task-required information',
    meaning:
      'Thông tin bắt buộc để user hoàn thành task, nhưng thường ít rủi ro hơn P0.',
    examples:
      'Field bắt buộc, chọn nguồn tiền, chọn biller/ngân hàng, OTP/PIN, điều khoản cần tick, step hiện tại trong flow.',
    uiRule:
      'Phải dễ thao tác, dễ hiểu, nằm đúng vị trí user kỳ vọng, không bị giấu quá sâu.',
  },
  {
    level: 'P2',
    title: 'Decision-supporting information',
    meaning: 'Thông tin giúp user hiểu thêm và tự tin hơn khi ra quyết định.',
    examples: 'Mô tả phí, thời gian xử lý, benefit, điều kiện áp dụng, helper text.',
    uiRule: 'Hiển thị đủ rõ nhưng không được cạnh tranh với P0/P1.',
  },
  {
    level: 'P3',
    title: 'Convenience information',
    meaning: 'Thông tin hoặc shortcut giúp user thao tác nhanh hơn nhưng không bắt buộc.',
    examples:
      'Recent recipients, saved billers, gợi ý gần đây, shortcut, autofill suggestions.',
    uiRule: 'Có thể hỗ trợ task, nhưng không được làm rối flow chính.',
  },
  {
    level: 'P4',
    title: 'Promotion / engagement information',
    meaning:
      'Nội dung business muốn promote hoặc tạo engagement, không cần thiết để user hoàn thành task chính.',
    examples: 'Voucher, campaign banner, cross-sell, reward, gamification module.',
    uiRule:
      'Chỉ nên nổi bật khi không làm giảm clarity của P0/P1. Trong critical finance flow, P4 phải đứng sau utility.',
  },
]

export const confirmTransferPriorityExample = [
  'P0: Số tiền, người nhận, số tài khoản/ngân hàng, phí, trạng thái/rủi ro nếu có.',
  'P1: Nguồn tiền, nội dung chuyển tiền, CTA xác nhận.',
  'P2: Thời gian xử lý, giải thích phí, help text.',
  'P3: Gợi ý người nhận gần đây, shortcut chỉnh sửa nhanh.',
  'P4: Voucher, ưu đãi, cross-sell hoặc campaign liên quan.',
]

export const frameworkUsage: UsageItem[] = [
  {
    timing: 'Khi tạo thiết kế',
    description:
      'Designer tự kiểm tra UI trước khi review: tác vụ chính là gì, thông tin P0/P1 là gì, CTA chính là gì, các state/edge case nằm ở đâu.',
  },
  {
    timing: 'Khi review thiết kế',
    description:
      'Team review dựa trên principle và tiêu chí cụ thể, thay vì góp ý cảm tính như "màn này hơi rối" hoặc "chưa đẹp".',
  },
  {
    timing: 'Khi audit UI',
    description:
      'Mỗi issue cần được gắn với principle bị vi phạm, tiêu chí chưa đạt, mức độ nghiêm trọng, tác động và hướng xử lý thiết kế.',
  },
  {
    timing: 'Khi cải thiện hệ thống',
    description:
      'Các issue lặp lại nhiều lần sẽ được chuyển thành cập nhật cho Design System, UX Pattern hoặc principle refinement.',
  },
]

export const frameworkQuestions = [
  'Screen này phục vụ task chính nào?',
  'User cần nhìn gì đầu tiên?',
  'Thông tin P0/P1 là gì?',
  'Primary action là gì?',
  'State, error hoặc edge case sẽ hiển thị ở đâu?',
  'Pattern này đã tồn tại ở feature khác chưa?',
]

export const uiPrinciples: Principle[] = [
  {
    number: 1,
    title: 'Clear Hierarchy - Phân cấp thông tin rõ ràng',
    vietnameseTitle: 'Phân cấp thông tin rõ ràng',
    summary:
      'Nguyên tắc này giúp user biết nên nhìn vào đâu trước, đâu là nội dung chính và hành động nào cần thực hiện tiếp theo. Mục tiêu là giảm nhiễu, giảm phân vân và giúp user ra quyết định nhanh hơn.',
    description:
      'Nguyên tắc này giúp user biết nên nhìn vào đâu trước, đâu là nội dung chính và hành động nào cần thực hiện tiếp theo. Mục tiêu là giảm nhiễu, giảm phân vân và giúp user ra quyết định nhanh hơn.',
    guidelines: [
      'Mỗi màn hình hoặc section chỉ nên có một điểm nhấn chính.',
      'Title, subtitle, nội dung hỗ trợ và metadata cần có thứ bậc rõ ràng.\nCTA chính phải nổi bật hơn CTA phụ.',
      'Nội dung quan trọng không bị campaign, banner hoặc decorative content lấn át.',
      'Các thông tin quan trọng như số tiền, trạng thái, cảnh báo, bước tiếp theo phải được ưu tiên hiển thị đúng mức.',
    ],
    criteria: [
      '1.1: Dùng spacing, grouping, size, weight và background để tạo phân cấp rõ giữa các section.',
      '1.2: Trong một module, cần phân biệt rõ title, description, metadata và action.',
      '1.3: Mỗi màn hình hoặc section cần có một focal point và một primary action rõ ràng.',
    ],
    reasons: [
      'Giúp người dùng hiểu nhanh nội dung quan trọng nhất trên màn hình.',
      'Giảm tình trạng user bị phân tán bởi quá nhiều thông tin cùng lúc.',
      'Hỗ trợ user hoàn thành task nhanh hơn và ít nhầm lẫn hơn.',
    ],
  },
  {
    number: 2,
    title: 'Structured Simplicity - Cấu trúc tối giản',
    vietnameseTitle: 'Cấu trúc tối giản',
    summary:
      'Structured Simplicity là nguyên tắc giúp giao diện trở nên đơn giản nhưng vẫn có cấu trúc rõ ràng.',
    description:
      'Mục tiêu không phải là cắt giảm mọi thứ, mà là giữ lại đúng thông tin cần thiết, sắp xếp chúng theo logic dễ hiểu để người dùng hoàn thành task nhanh hơn.',
    guidelines: [
      'Mỗi màn hình chỉ nên tập trung vào một nhiệm vụ chính.',
      'Giảm bớt thông tin, bước hoặc lựa chọn không cần thiết.',
      'Chia nhỏ các flow phức tạp thành các bước dễ hiểu, nhưng không tách nhỏ quá mức.',
      'Nhóm các nội dung liên quan lại với nhau để user dễ quét và dễ ra quyết định.',
      'Không để yếu tố trang trí, campaign hoặc nội dung phụ làm rối task chính.',
    ],
    criteria: [
      '2.1: Mỗi màn hình cần có một mục tiêu rõ ràng và chỉ giữ lại những thông tin cần thiết cho mục tiêu đó.',
      '2.2: Với flow phức tạp, chia bước theo logic task, tránh gom quá nhiều việc vào một màn hoặc tách nhỏ thành quá nhiều màn.',
      '2.3: Nhóm thông tin liên quan bằng spacing, section hoặc module để user dễ hiểu và dễ thao tác.',
    ],
    reasons: [
      'Giúp user hoàn thành task nhanh hơn và ít bị phân tán.',
      'Giảm cognitive load khi xử lý các flow phức tạp.',
      'Tạo trải nghiệm gọn, rõ và dễ mở rộng trong hệ thống sản phẩm.',
    ],
  },
  {
    number: 3,
    title: 'Consistent Experience - Trải nghiệm nhất quán',
    vietnameseTitle: 'Trải nghiệm nhất quán',
    summary:
      'Consistency là mức độ đồng bộ trong toàn bộ hệ thống giao diện.',
    description:
      'Nguyên tắc này bao gồm component, pattern, màu sắc, typography, icon, cách đặt tên đến hành vi phản hồi. Mục tiêu là giúp người dùng cảm thấy quen thuộc, dễ đoán và không phải học lại khi di chuyển giữa các màn hình hoặc flow khác nhau.',
    guidelines: [
      'Sử dụng các thành phần như nút, font chữ, màu sắc giống nhau theo Design System trên toàn bộ ứng dụng.',
      'Tuân theo các quy ước thiết kế phổ biến của ngành.',
      'Đặt tên chức năng, nhãn nút giống nhau trên các trang hoặc các thiết bị khác nhau.',
      'Đồng bộ visual về logo, màu sắc, phông chữ trên mạng xã hội, website và bao bì.',
      'Giọng văn, thông điệp truyền tải thống nhất về giá trị cốt lõi.',
    ],
    criteria: [
      '3.1: Dùng component, variant, icon và color đúng theo Design System.',
      '3.2: Với cùng một hành động, cần thống nhất pattern, trạng thái hiển thị và vị trí đặt CTA.',
      '3.3: Thống nhất cách dùng ngôn ngữ, label, cấu trúc văn bản, đơn vị và format hiển thị - không thay đổi tùy hứng giữa các màn hình.',
    ],
    reasons: [
      'Tạo cảm giác sản phẩm ổn định và đáng tin.',
      'Giảm effort học lại giữa các service.',
      'Giảm duplicated pattern, giảm cost maintain cho design và tech.',
    ],
  },
  {
    number: 4,
    title: 'Action Clarity - Rõ ràng hành động chính',
    vietnameseTitle: 'Rõ ràng hành động chính',
    summary:
      'Action Clarity đảm bảo mỗi màn hình truyền đạt rõ người dùng đang ở đâu, cần làm gì và điều gì sẽ xảy ra sau khi thao tác.',
    description:
      'Mục tiêu là giúp người dùng hiểu ngay ý nghĩa của từng label, trạng thái, dữ liệu và hành động mà không cần suy đoán.',
    guidelines: [
      'Label, Title, CTA và trạng thái cần rõ nghĩa, không mơ hồ.',
      'Các thông tin quan trọng như số tiền, phí, thời gian xử lý và điều kiện sử dụng cần dễ đọc, dễ hiểu.',
      'Icon chỉ nên hỗ trợ nhận biết, không thay thế cho text ở các hành động quan trọng.',
      'CTA cần phản ánh đúng hành động tiếp theo, ví dụ: Xác nhận thanh toán, Tiếp tục, Đổi tài khoản.',
      'Với các luồng quan trọng, cần giải thích ngắn gọn lý do user phải thực hiện bước đó.',
    ],
    criteria: [
      '4.1: Label, Title, CTA và trạng thái phải rõ nghĩa, không gây hiểu nhầm.',
      '4.2: Số liệu quan trọng, phí, thời gian và điều kiện cần được hiển thị rõ ràng, dễ đọc.',
      '4.3: Icon chỉ dùng để hỗ trợ nhận diện, không thay thế text cần thiết.',
    ],
    reasons: [
      'Giúp người dùng hiểu nhanh hành động cần thực hiện.',
      'Giảm nhầm lẫn, đặc biệt trong các luồng tài chính hoặc xác thực.',
      'Tăng cảm giác kiểm soát và tin cậy khi user thao tác.',
    ],
  },
  {
    number: 5,
    title: 'Feedback & System Status - Trạng thái & Phản hồi',
    vietnameseTitle: 'Trạng thái & Phản hồi',
    summary:
      'Feedback & System Status đảm bảo hệ thống luôn cho người dùng biết chuyện gì đang xảy ra.',
    description:
      'Nguyên tắc này giúp user biết thao tác đã được ghi nhận chưa và bước tiếp theo là gì. Nó đặc biệt quan trọng trong các flow có dữ liệu động, xác thực, thanh toán hoặc giao dịch tài chính.',
    guidelines: [
      'Mỗi màn hình hoặc component cần có đầy đủ trạng thái phù hợp như loading, empty, error, success, permission.',
      'Mọi thao tác quan trọng cần có phản hồi rõ ràng và kịp thời.',
      'Form input cần có validation dễ hiểu, đúng thời điểm để đảm bảo thông tin đúng định dạng, đầy đủ và hợp lệ trước khi gửi đi hoặc xử lý tiếp.',
      'Với giao dịch tài chính, cần nói rõ hệ thống đã xử lý tới đâu và user cần làm gì tiếp theo.',
      'Error message phải giải thích được vấn đề và hướng xử lý, không chỉ báo lỗi chung chung.',
    ],
    criteria: [
      '5.1: Mỗi bề mặt giao diện cần có trạng thái loading, empty, error, success và permission khi phù hợp.',
      '5.2: Mọi thao tác cần có phản hồi tức thì, validation rõ ràng hoặc tiến trình xử lý dễ nhận biết.',
      '5.3: Với giao dịch, cần hiển thị rõ hệ thống đã xử lý tới đâu và người dùng cần làm gì tiếp theo.',
    ],
    reasons: [
      'Giúp người dùng không bị mơ hồ sau khi thao tác.',
      'Giảm lo lắng trong các flow quan trọng như xác thực, thanh toán, chuyển tiền.',
      'Tăng cảm giác kiểm soát và tin cậy đối với hệ thống.',
    ],
  },
  {
    number: 6,
    title: 'Zalopay Identify in Utility - Brand không chỉ là hình ảnh mà phải thể hiện qua giá trị sử dụng',
    vietnameseTitle: 'Brand không chỉ là hình ảnh mà phải thể hiện qua giá trị sử dụng',
    summary:
      'ZaloPay Identity in Utility đảm bảo bản sắc thương hiệu được thể hiện thông qua chất lượng trải nghiệm và tính hữu ích.',
    description:
      'Mục tiêu là mọi yếu tố thương hiệu đều phải hỗ trợ clarity, speed và trust, không làm ảnh hưởng đến khả năng hoàn thành task của người dùng.',
    guidelines: [
      'Bản sắc thương hiệu cần được thể hiện thông qua trải nghiệm mượt, rõ và đáng tin, không chỉ qua màu sắc hay hình ảnh.',
      'Không sử dụng yếu tố branding, decoration hoặc campaign làm giảm khả năng hoàn thành task.',
      'Visual và motion cần hỗ trợ hiểu thông tin và hành động, không gây nhiễu.',
      'Ưu tiên utility hơn aesthetic nếu có xung đột.',
    ],
    criteria: [
      '6.1: Mọi yếu tố visual phải hỗ trợ việc đọc hiểu và thao tác, không gây phân tán.',
      '6.2: Không đặt banner, campaign hoặc branding ở vị trí làm ảnh hưởng đến task chính.',
      '6.3: Khi cần lựa chọn, luôn ưu tiên clarity, speed và trust hơn yếu tố trang trí.',
    ],
    reasons: [
      'Giúp người dùng hoàn thành task nhanh và chính xác hơn.',
      'Tránh gây nhiễu trong các flow quan trọng như thanh toán, xác thực.',
      'Xây dựng hình ảnh thương hiệu thông qua trải nghiệm thực tế, không chỉ qua hình thức.',
    ],
  },
  {
    number: 7,
    title: 'Accessibility & Adaptability - Dễ tiếp cận và tính linh hoạt',
    vietnameseTitle: 'Dễ tiếp cận và tính linh hoạt',
    summary:
      'Accessibility & Adaptability đảm bảo giao diện có thể được tiếp cận, đọc hiểu và sử dụng tốt bởi nhiều nhóm người dùng.',
    description:
      'Nguyên tắc này áp dụng trên nhiều thiết bị, kích thước màn hình và bối cảnh khác nhau. Mục tiêu là giữ trải nghiệm luôn rõ ràng, dễ thao tác và hiệu quả, ngay cả khi điều kiện sử dụng thay đổi.',
    guidelines: [
      'Đảm bảo độ tương phản, cỡ chữ, touch target và spacing đủ rõ để mọi người dùng đều có thể thao tác.',
      'Không truyền đạt trạng thái chỉ bằng màu sắc; cần có thêm text, icon hoặc mô tả hỗ trợ.',
      'Thiết kế cần hỗ trợ keyboard, screen reader và các trạng thái validation phù hợp.',
      'Giao diện cần thích nghi tốt trên nhiều kích thước màn hình như mobile, tablet, desktop.',
      'Khi dữ liệu hoặc tính năng tăng lên, hierarchy vẫn phải rõ và không bị vỡ cấu trúc.',
    ],
    criteria: [
      '7.1: Contrast, cỡ chữ, touch target và spacing cần đủ rõ để người dùng dễ đọc, dễ chạm và dễ thao tác.',
      '7.2: Không dùng màu sắc làm tín hiệu duy nhất, trạng thái cần có text, icon hoặc mô tả bổ sung.',
      '7.3: Giao diện cần giữ được hierarchy rõ ràng trên nhiều thiết bị và khi nội dung/tính năng mở rộng.',
    ],
    reasons: [
      'Giúp nhiều nhóm người dùng có thể sử dụng sản phẩm dễ dàng hơn.',
      'Giảm lỗi thao tác trong các bối cảnh khó như màn hình nhỏ, ánh sáng kém hoặc thiết bị cấu hình thấp.',
      'Đảm bảo sản phẩm có thể mở rộng mà vẫn giữ được tính rõ ràng và hiệu quả.',
    ],
  },
  {
    number: 8,
    title: 'Trust & Safety - Tin cậy và an toàn',
    vietnameseTitle: 'Tin cậy và an toàn',
    summary:
      'Trust & Safety giúp giao diện tạo cảm giác an tâm, minh bạch và đáng tin cậy.',
    description:
      'Nguyên tắc này đặc biệt quan trọng trong các hành động liên quan đến tiền, dữ liệu cá nhân hoặc quyết định quan trọng. Mục tiêu là giúp người dùng hiểu rõ điều gì đang xảy ra, rủi ro là gì và họ đang kiểm soát hành động của mình như thế nào.',
    guidelines: [
      'Hiển thị rõ số tiền, phí, trạng thái và kết quả trước khi user xác nhận.',
      'Các hành động rủi ro cần có phân biệt thị giác rõ ràng và bước confirm phù hợp.',
      'Dữ liệu nhạy cảm cần được che đúng mức, ví dụ: số điện thoại, số tài khoản, mật khẩu.',
      'Với giao dịch tài chính, cần có thông tin tham chiếu hoặc lịch sử để user có thể kiểm tra lại.',
      'Error hoặc warning cần nói rõ chuyện gì xảy ra và user nên làm gì tiếp theo.',
    ],
    criteria: [
      '8.1: Hiển thị minh bạch số tiền, phí, trạng thái và kết quả trước khi user confirm.',
      '8.2: Hành động rủi ro cần có visual treatment rõ ràng, bước confirm phù hợp và hạn chế thao tác nhầm.',
      '8.3: Dữ liệu nhạy cảm phải được che đúng mức; thông tin giao dịch cần có khả năng truy vết.',
    ],
    reasons: [
      'Tăng cảm giác an tâm khi người dùng thực hiện các thao tác quan trọng.',
      'Giảm rủi ro nhầm lẫn, thao tác sai hoặc hiểu sai thông tin.',
      'Giúp người dùng luôn biết mình đang xác nhận điều gì và kết quả sau thao tác này là gì.',
      'Bảo vệ dữ liệu nhạy cảm và giảm nguy cơ lộ thông tin cá nhân.',
      'Tạo nền tảng niềm tin lâu dài cho sản phẩm tài chính.',
    ],
  },
]

export const relatedGuidelines = [
  'Các principle trên cũng nên được kiểm tra qua lăng kính heuristic để tránh review UI bị cảm tính.',
  'Visibility of system status.',
  'Consistency and standards.',
  'Recognition over recall.',
  'Error prevention.',
  'Aesthetic and minimalist design.',
  'Help users recognize and recover.',
]

export const reviewChecklist = [
  'Màn hình có hierarchy rõ không?',
  'CTA có label cụ thể không?',
  'Cùng loại màn hình đã nhất quán với feature khác chưa?',
  'Loading / error / empty / success / pending đã có chưa?',
  'Campaign/brand element có đang gây nhiễu không?',
  'User có biết action chính là gì không?',
  'Layout có structure logic không?',
  'Component đã dùng đúng Design System chưa?',
  'Nếu có tiền/trạng thái/rủi ro, thông tin đó đã đủ rõ chưa?',
  'Nếu thêm case mới, UI có còn scale được không?',
]

export const reviewDecisionRules = [
  'Nếu fail từ 3 câu trở lên, UI chưa nên đi tiếp sang handoff.',
  'Nếu issue lặp lại ở nhiều flow, không xử lý như bug riêng lẻ, cần chuyển thành Design System, UX Pattern hoặc Principle update.',
]
