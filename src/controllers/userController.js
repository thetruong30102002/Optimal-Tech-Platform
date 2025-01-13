const User = require('../models/User'); // Model User
const Otp = require('../models/Otp');   // Model OTP
const jwt = require('jsonwebtoken');

// Gửi OTP qua số điện thoại (Hàm dùng lại)
const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP 6 chữ số
  try {
    // Lưu OTP vào database
    const newOtp = new Otp({ phoneNumber, otp });
    await newOtp.save();

    // In OTP ra console (thay bằng dịch vụ gửi SMS thực tế nếu cần)
    console.log(`OTP gửi tới ${phoneNumber}: ${otp}`);
    return otp;
  } catch (error) {
    console.error('Lỗi khi gửi OTP:', error);
    throw error;
  }
};

// Đăng ký
const register = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Số điện thoại là bắt buộc' });
  }

  try {
    // Kiểm tra người dùng đã tồn tại chưa
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: 'Người dùng đã tồn tại' });
    }

    // Gửi OTP
    await sendOtp(phoneNumber);
    res.status(200).json({ message: 'OTP đã được gửi thành công. Vui lòng xác thực để hoàn tất đăng ký.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng ký', error: error.message });
  }
};

// Xác thực OTP đăng ký
const verifyOtpForRegister = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Số điện thoại và OTP là bắt buộc' });
  }

  try {
    // Kiểm tra OTP trong database
    const otpRecord = await Otp.findOne({ phoneNumber });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    // Xóa OTP sau khi xác thực
    await Otp.deleteOne({ phoneNumber });

    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được đăng ký!' });
    }

    // Lưu người dùng mới vào database
    const newUser = new User({ phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công. Bây giờ bạn có thể đăng nhập.' });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xác thực OTP',
      error: error.message,
    });
  }
};


// Đăng nhập
const login = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Số điện thoại là bắt buộc' });
  }

  try {
    // Kiểm tra người dùng đã tồn tại
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại. Vui lòng đăng ký.' });
    }

    // Gửi OTP
    await sendOtp(phoneNumber);
    res.status(200).json({ message: 'OTP đã được gửi. Vui lòng xác thực để đăng nhập.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng nhập', error: error.message });
  }
};

// Xác thực OTP đăng nhập
const verifyOtpForLogin = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Số điện thoại và OTP là bắt buộc' });
  }

  try {
    // Kiểm tra OTP trong database
    const otpRecord = await Otp.findOne({ phoneNumber });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    // Xóa OTP sau khi xác thực
    await Otp.deleteOne({ phoneNumber });

    // Tạo JWT token
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xác thực OTP', error: error.message });
  }
};

module.exports = { register, verifyOtpForRegister, login, verifyOtpForLogin };
