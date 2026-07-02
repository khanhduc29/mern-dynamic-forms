require('dotenv').config();
const mongoose = require('mongoose');
const Form = require('./src/models/Form');
const Submission = require('./src/models/Submission');
const connectDB = require('./src/config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Form.deleteMany({});
    await Submission.deleteMany({});

    console.log('Inserting seed data...');

    // 1. FORM: Khảo sát mức độ hài lòng về môi trường làm việc
    const surveyForm = new Form({
      title: 'Khảo Sát Mức Độ Hài Lòng Môi Trường Làm Việc 2026',
      description: 'Xin vui lòng cho chúng tôi biết cảm nhận của bạn về môi trường làm việc hiện tại để công ty có những cải thiện tốt hơn.',
      status: 'active',
      order: 1,
      fields: [
        { label: 'Phòng ban của bạn', type: 'select', order: 1, required: true, options: ['IT', 'Marketing', 'Sales', 'HR', 'Kế Toán'] },
        { label: 'Đánh giá mức độ hài lòng tổng thể (1-10)', type: 'number', order: 2, required: true, validation: { min: 1, max: 10 } },
        { label: 'Điểm bạn thích nhất ở công ty', type: 'text', order: 3, required: false, validation: { maxLength: 500 } },
        { label: 'Đề xuất cải thiện', type: 'text', order: 4, required: false, validation: { maxLength: 1000 } },
        { label: 'Màu sắc chủ đạo bạn muốn cho văn phòng mới', type: 'color', order: 5, required: false }
      ]
    });

    // 2. FORM: Đánh giá năng lực nhân viên cuối năm
    const evalForm = new Form({
      title: 'Đánh Giá Năng Lực Nhân Viên Cuối Năm',
      description: 'Biểu mẫu dành cho Quản lý để đánh giá hiệu suất làm việc của nhân viên trong đội nhóm.',
      status: 'active',
      order: 2,
      fields: [
        { label: 'Tên nhân viên được đánh giá', type: 'text', order: 1, required: true, validation: { maxLength: 100 } },
        { label: 'Kỹ năng chuyên môn (1-100)', type: 'number', order: 2, required: true, validation: { min: 1, max: 100 } },
        { label: 'Kỹ năng làm việc nhóm (1-100)', type: 'number', order: 3, required: true, validation: { min: 1, max: 100 } },
        { label: 'Xếp loại', type: 'select', order: 4, required: true, options: ['Xuất sắc', 'Tốt', 'Khá', 'Cần cố gắng'] },
        { label: 'Ngày đánh giá', type: 'date', order: 5, required: true },
        { label: 'Nhận xét chi tiết', type: 'text', order: 6, required: true, validation: { maxLength: 1000 } }
      ]
    });

    // 3. FORM: Đơn xin nghỉ phép
    const leaveForm = new Form({
      title: 'Đơn Xin Nghỉ Phép',
      description: 'Vui lòng điền đầy đủ thông tin để xin nghỉ phép. HR sẽ duyệt trong vòng 24h.',
      status: 'active',
      order: 3,
      fields: [
        { label: 'Họ và tên', type: 'text', order: 1, required: true, validation: { maxLength: 100 } },
        { label: 'Phòng ban', type: 'select', order: 2, required: true, options: ['IT', 'HR', 'Marketing', 'Kế Toán', 'Sales'] },
        { label: 'Ngày bắt đầu nghỉ', type: 'date', order: 3, required: true },
        { label: 'Số ngày nghỉ', type: 'number', order: 4, required: true, validation: { min: 1, max: 30 } },
        { label: 'Lý do', type: 'text', order: 5, required: true, validation: { maxLength: 500 } }
      ]
    });

    // 4. FORM: Đánh giá năng lực qua 3 tháng thực tập
    const internForm = new Form({
      title: 'Đánh Giá Năng Lực Sau 3 Tháng Thực Tập',
      description: 'Bài kiểm tra trắc nghiệm đánh giá kiến thức chuyên môn sau thời gian thử việc/thực tập.',
      status: 'active',
      order: 4,
      fields: [
        { label: 'Họ và tên thực tập sinh', type: 'text', order: 1, required: true, validation: { maxLength: 100 } },
        { label: 'Câu 1: React Hook nào được sử dụng để quản lý side effects?', type: 'select', order: 2, required: true, options: ['A. useState', 'B. useEffect', 'C. useContext', 'D. useReducer'] },
        { label: 'Câu 2: Node.js dựa trên JavaScript engine nào?', type: 'select', order: 3, required: true, options: ['A. SpiderMonkey', 'B. V8 Engine', 'C. Chakra', 'D. JavaScriptCore'] },
        { label: 'Câu 3: Trong MongoDB, cấu trúc dữ liệu nào được sử dụng phổ biến nhất?', type: 'select', order: 4, required: true, options: ['A. XML', 'B. CSV', 'C. JSON / BSON', 'D. YAML'] },
        { label: 'Đánh giá tinh thần thái độ làm việc (1-10)', type: 'number', order: 5, required: true, validation: { min: 1, max: 10 } }
      ]
    });

    await Form.insertMany([surveyForm, evalForm, leaveForm, internForm]);

    // Thêm Submission (Data thật)
    const surveyFields = surveyForm.fields;
    const evalFields = evalForm.fields;
    const leaveFields = leaveForm.fields;
    const internFields = internForm.fields;

    const submissions = [
      // -------- Submissions cho Khảo sát --------
      {
        formId: surveyForm._id,
        formTitle: surveyForm.title,
        data: {
          [surveyFields[0]._id.toString()]: 'IT',
          [surveyFields[1]._id.toString()]: 8,
          [surveyFields[2]._id.toString()]: 'Sếp tâm lý, đồng nghiệp hòa đồng, dự án có tính thử thách công nghệ cao.',
          [surveyFields[3]._id.toString()]: 'Cần nâng cấp máy pha cà phê ở pantry tầng 3 và hỗ trợ thêm màn hình phụ.',
          [surveyFields[4]._id.toString()]: '#4A90E2' // Xanh lam
        },
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 ngày trước
      },
      {
        formId: surveyForm._id,
        formTitle: surveyForm.title,
        data: {
          [surveyFields[0]._id.toString()]: 'Marketing',
          [surveyFields[1]._id.toString()]: 9,
          [surveyFields[2]._id.toString()]: 'Môi trường làm việc linh hoạt, không gò bó, nhiều hoạt động team building bổ ích.',
          [surveyFields[3]._id.toString()]: 'Nên có thêm trợ cấp ăn trưa hoặc các buổi liên hoan nhẹ định kỳ.',
          [surveyFields[4]._id.toString()]: '#50E3C2' // Xanh ngọc
        },
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 tiếng trước
      },
      {
        formId: surveyForm._id,
        formTitle: surveyForm.title,
        data: {
          [surveyFields[0]._id.toString()]: 'Sales',
          [surveyFields[1]._id.toString()]: 6,
          [surveyFields[2]._id.toString()]: 'Chính sách hoa hồng minh bạch, sòng phẳng.',
          [surveyFields[3]._id.toString()]: 'Quy trình duyệt hợp đồng qua hệ thống nội bộ còn quá rườm rà, tốn nhiều thời gian.',
          [surveyFields[4]._id.toString()]: '#F5A623' // Cam
        },
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 tiếng trước
      },
      
      // -------- Submissions cho Đánh giá năng lực --------
      {
        formId: evalForm._id,
        formTitle: evalForm.title,
        data: {
          [evalFields[0]._id.toString()]: 'Nguyễn Văn Nam (Frontend Dev)',
          [evalFields[1]._id.toString()]: 92,
          [evalFields[2]._id.toString()]: 85,
          [evalFields[3]._id.toString()]: 'Xuất sắc',
          [evalFields[4]._id.toString()]: new Date().toISOString().split('T')[0],
          [evalFields[5]._id.toString()]: 'Nam hoàn thành vượt chỉ tiêu các module React, code clean và có tư duy UX tốt. Thường xuyên chia sẻ kiến thức mới cho team. Cần tự tin hơn trong các buổi họp trình bày trực tiếp với khách hàng.'
        },
        submittedAt: new Date()
      },
      {
        formId: evalForm._id,
        formTitle: evalForm.title,
        data: {
          [evalFields[0]._id.toString()]: 'Trần Thị Hoa (QC/Tester)',
          [evalFields[1]._id.toString()]: 78,
          [evalFields[2]._id.toString()]: 90,
          [evalFields[3]._id.toString()]: 'Tốt',
          [evalFields[4]._id.toString()]: new Date().toISOString().split('T')[0],
          [evalFields[5]._id.toString()]: 'Hoa phối hợp rất tốt với đội dev, log bug rõ ràng chi tiết, thái độ làm việc cực kỳ trách nhiệm. Tuy nhiên tốc độ viết automation test (Cypress) cần được cải thiện thêm trong quý tới để đáp ứng CI/CD.'
        },
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 ngày trước
      },
      
      // -------- Submissions cho Xin Nghỉ Phép --------
      {
        formId: leaveForm._id,
        formTitle: leaveForm.title,
        data: {
          [leaveFields[0]._id.toString()]: 'Lê Minh Hoàng',
          [leaveFields[1]._id.toString()]: 'Kế Toán',
          [leaveFields[2]._id.toString()]: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 ngày tới
          [leaveFields[3]._id.toString()]: 2,
          [leaveFields[4]._id.toString()]: 'Xin nghỉ phép để về quê giải quyết việc gia đình cá nhân.'
        },
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 tiếng trước
      },
      
      // -------- Submissions cho Thực Tập Sinh --------
      {
        formId: internForm._id,
        formTitle: internForm.title,
        data: {
          [internFields[0]._id.toString()]: 'Lê Tuấn Anh',
          [internFields[1]._id.toString()]: 'B. useEffect',
          [internFields[2]._id.toString()]: 'B. V8 Engine',
          [internFields[3]._id.toString()]: 'C. JSON / BSON',
          [internFields[4]._id.toString()]: 9
        },
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        formId: internForm._id,
        formTitle: internForm.title,
        data: {
          [internFields[0]._id.toString()]: 'Phạm Hoàng Yến',
          [internFields[1]._id.toString()]: 'A. useState', // Trả lời sai
          [internFields[2]._id.toString()]: 'B. V8 Engine',
          [internFields[3]._id.toString()]: 'C. JSON / BSON',
          [internFields[4]._id.toString()]: 8
        },
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    await Submission.insertMany(submissions);
    
    console.log('✅ Seed data successfully added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
