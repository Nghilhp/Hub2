export type UITeamPrinciple = {
  id: string
  imageSrc: string
  number: number
  title: string
  subtitle: string
  intro: string[]
  applicationRules: string[]
  criteria: string[]
  reasons: string[]
}

export const uiTeamPrinciples: UITeamPrinciple[] = [
  {
    id: 'clear-hierarchy',
    imageSrc: '/principles/clear-hierarchy.png',
    number: 1,
    title: 'Clear Hierarchy',
    subtitle: 'Phân cấp thông tin rõ ràng',
    intro: [
      'Clear Hierarchy là nguyên tắc giúp giao diện sắp xếp thông tin theo mức độ quan trọng, để user biết nên nhìn vào đâu trước, đâu là nội dung chính và hành động nào cần thực hiện tiếp theo.',
      'Mục tiêu là giảm nhiễu, giảm phân vân và giúp user ra quyết định nhanh hơn.',
    ],
    applicationRules: [
      'Mỗi màn hình hoặc section chỉ nên có một điểm nhấn chính.',
      'CTA chính phải nổi bật hơn action phụ.',
      'Title, subtitle, nội dung hỗ trợ và metadata cần có thứ bậc rõ ràng.',
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
    id: 'structured-simplicity',
    imageSrc: '/principles/structured-simplicity.png',
    number: 2,
    title: 'Structured Simplicity',
    subtitle: 'Cấu trúc tối giản',
    intro: [
      'Structured Simplicity là nguyên tắc giúp giao diện trở nên đơn giản nhưng vẫn có cấu trúc rõ ràng.',
      'Mục tiêu không phải là cắt giảm mọi thứ, mà là giữ lại đúng thông tin cần thiết và sắp xếp chúng theo logic dễ hiểu để người dùng hoàn thành task nhanh hơn.',
    ],
    applicationRules: [
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
    id: 'consistent-experience',
    imageSrc: '/principles/consistent-experience.png',
    number: 3,
    title: 'Consistent Experience',
    subtitle: 'Trải nghiệm nhất quán',
    intro: [
      'Consistency là mức độ đồng bộ trong toàn bộ hệ thống giao diện, từ component, pattern, màu sắc, typography, icon, cách đặt tên đến hành vi phản hồi.',
      'Mục tiêu là giúp người dùng cảm thấy quen thuộc, dễ đoán và không phải học lại khi di chuyển giữa các màn hình hoặc flow khác nhau.',
    ],
    applicationRules: [
      'Sử dụng các thành phần như nút, font chữ và màu sắc giống nhau theo Design System trên toàn bộ ứng dụng.',
      'Tuân theo các quy ước thiết kế phổ biến của ngành, ví dụ interaction back nên nhất quán theo pattern đã thống nhất.',
      'Đặt tên chức năng và nhãn nút giống nhau trên các trang hoặc thiết bị khác nhau.',
      'Đồng bộ visual về logo, màu sắc và phông chữ trên các bề mặt liên quan.',
      'Giữ giọng văn và thông điệp truyền tải thống nhất với giá trị cốt lõi.',
    ],
    criteria: [
      '3.1: Dùng component, variant, icon và color đúng theo Design System.',
      '3.2: Với cùng một hành động, cần thống nhất pattern, trạng thái hiển thị và vị trí đặt CTA.',
      '3.3: Thống nhất cách dùng ngôn ngữ, label, cấu trúc văn bản, đơn vị và format hiển thị; không thay đổi tùy hứng giữa các màn hình.',
    ],
    reasons: [
      'Tạo cảm giác sản phẩm ổn định và đáng tin.',
      'Giảm effort học lại giữa các service.',
      'Giảm duplicated pattern và giảm cost maintain cho design và tech.',
    ],
  },
  {
    id: 'action-clarity',
    imageSrc: '/principles/action-clarity.png',
    number: 4,
    title: 'Action Clarity',
    subtitle: 'Rõ ràng hành động chính',
    intro: [
      'Action Clarity là nguyên tắc đảm bảo mỗi màn hình truyền đạt rõ người dùng đang ở đâu, cần làm gì và điều gì sẽ xảy ra sau khi thao tác.',
      'Mục tiêu là giúp người dùng hiểu ngay ý nghĩa của từng label, trạng thái, dữ liệu và hành động mà không cần suy đoán.',
    ],
    applicationRules: [
      'Label, title, CTA và trạng thái cần rõ nghĩa, không mơ hồ.',
      'Các thông tin quan trọng như số tiền, phí, thời gian xử lý và điều kiện sử dụng cần dễ đọc, dễ hiểu.',
      'Icon chỉ nên hỗ trợ nhận biết, không thay thế cho text ở các hành động quan trọng.',
      'CTA cần phản ánh đúng hành động tiếp theo, ví dụ: Xác nhận thanh toán, Tiếp tục, Đổi tài khoản.',
      'Với các luồng quan trọng, cần giải thích ngắn gọn lý do user phải thực hiện bước đó.',
    ],
    criteria: [
      '4.1: Label, title, CTA và trạng thái phải rõ nghĩa, không gây hiểu nhầm.',
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
    id: 'feedback-system-status',
    imageSrc: '/principles/feedback-system-status.png',
    number: 5,
    title: 'Feedback & System Status',
    subtitle: 'Trạng thái & Phản hồi',
    intro: [
      'Feedback & System Status là nguyên tắc đảm bảo hệ thống luôn cho người dùng biết chuyện gì đang xảy ra, thao tác đã được ghi nhận chưa và bước tiếp theo là gì.',
      'Nguyên tắc này đặc biệt quan trọng trong các flow có dữ liệu động, xác thực, thanh toán hoặc giao dịch tài chính.',
    ],
    applicationRules: [
      'Mỗi màn hình hoặc component cần có đầy đủ trạng thái phù hợp như loading, empty, error, success và permission.',
      'Mọi thao tác quan trọng cần có phản hồi rõ ràng và kịp thời.',
      'Form input cần có validation dễ hiểu, đúng thời điểm để ngăn chặn lỗi và cải thiện trải nghiệm người dùng.',
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
    id: 'zalopay-identity-in-utility',
    imageSrc: '/principles/zalopay-identity-in-utility.png',
    number: 6,
    title: 'Zalopay Identity in Utility',
    subtitle: 'Brand không chỉ là hình ảnh mà phải thể hiện qua giá trị sử dụng',
    intro: [
      'Zalopay Identity in Utility là nguyên tắc đảm bảo bản sắc thương hiệu được thể hiện thông qua chất lượng trải nghiệm và tính hữu ích, thay vì chỉ dựa vào yếu tố trang trí.',
      'Mục tiêu là mọi yếu tố thương hiệu đều phải hỗ trợ clarity, speed và trust, không làm ảnh hưởng đến khả năng hoàn thành task của người dùng.',
    ],
    applicationRules: [
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
    id: 'accessibility-adaptability',
    imageSrc: '/principles/accessibility-adaptability.png',
    number: 7,
    title: 'Accessibility & Adaptability',
    subtitle: 'Dễ tiếp cận và tính linh hoạt',
    intro: [
      'Accessibility & Adaptability là nguyên tắc đảm bảo giao diện có thể được tiếp cận, đọc hiểu và sử dụng tốt bởi nhiều nhóm người dùng, trên nhiều thiết bị, kích thước màn hình và bối cảnh khác nhau.',
      'Mục tiêu là giữ trải nghiệm luôn rõ ràng, dễ thao tác và hiệu quả, ngay cả khi điều kiện sử dụng thay đổi.',
    ],
    applicationRules: [
      'Đảm bảo độ tương phản, cỡ chữ, touch target và spacing đủ rõ để mọi người dùng đều có thể thao tác.',
      'Không truyền đạt trạng thái chỉ bằng màu sắc; cần có thêm text, icon hoặc mô tả hỗ trợ.',
      'Thiết kế cần hỗ trợ keyboard, screen reader và các trạng thái validation phù hợp.',
      'Giao diện cần thích nghi tốt trên nhiều kích thước màn hình như mobile, tablet, desktop.',
      'Khi dữ liệu hoặc tính năng tăng lên, hierarchy vẫn phải rõ và không bị vỡ cấu trúc.',
    ],
    criteria: [
      '7.1: Contrast, cỡ chữ, touch target và spacing cần đủ rõ để người dùng dễ đọc, dễ chạm và dễ thao tác.',
      '7.2: Không dùng màu sắc làm tín hiệu duy nhất; trạng thái cần có text, icon hoặc mô tả bổ sung.',
      '7.3: Giao diện cần giữ được hierarchy rõ ràng trên nhiều thiết bị và khi nội dung hoặc tính năng mở rộng.',
    ],
    reasons: [
      'Giúp nhiều nhóm người dùng có thể sử dụng sản phẩm dễ dàng hơn.',
      'Giảm lỗi thao tác trong các bối cảnh khó như màn hình nhỏ, ánh sáng kém hoặc thiết bị cấu hình thấp.',
      'Đảm bảo sản phẩm có thể mở rộng mà vẫn giữ được tính rõ ràng và hiệu quả.',
    ],
  },
  {
    id: 'trust-safety',
    imageSrc: '/principles/trust-safety.png',
    number: 8,
    title: 'Trust & Safety',
    subtitle: 'Tin cậy và an toàn',
    intro: [
      'Trust & Safety là nguyên tắc giúp giao diện tạo cảm giác an tâm, minh bạch và đáng tin cậy, đặc biệt trong các hành động liên quan đến tiền, dữ liệu cá nhân hoặc quyết định quan trọng.',
      'Mục tiêu là giúp người dùng hiểu rõ điều gì đang xảy ra, rủi ro là gì và họ đang kiểm soát hành động của mình như thế nào.',
    ],
    applicationRules: [
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
