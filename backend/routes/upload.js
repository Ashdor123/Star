const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type;
    let uploadPath = './uploads';
    
    if (type === 'lesson') {
      uploadPath = './uploads/lessons';
    } else if (type === 'step') {
      uploadPath = './uploads/steps';
    } else if (type === 'avatar') {
      // 为每个用户创建单独的头像目录
      // 从查询参数获取userId，因为multer处理文件时req.body还未解析
      const userId = req.query.userId || 'guest';
      uploadPath = `./uploads/avatars/${userId}`;
      // 确保目录存在
      const fs = require('fs');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const type = req.params.type;
    if (type === 'avatar') {
      // 头像使用固定文件名，确保每次上传都会替换
      const ext = path.extname(file.originalname);
      cb(null, 'avatar' + ext);
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }
});

// 配置文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件 (JPEG, PNG, GIF, WebP)'), false);
  }
};

// 创建上传中间件
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  }
});

/**
 * @route POST /api/upload/:type
 * @description 上传图片
 * @access Private
 */
router.post('/:type', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' });
    }
    
    // 生成图片URL
    let imageUrl;
    if (req.params.type === 'avatar') {
      const userId = req.query.userId || 'guest';
      imageUrl = `/uploads/avatars/${userId}/${req.file.filename}`;
    } else {
      imageUrl = `/uploads/${req.params.type === 'lesson' ? 'lessons' : 'steps'}/${req.file.filename}`;
    }
    
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('上传图片错误:', error);
    res.status(500).json({ error: '上传图片失败' });
  }
});

/**
 * @route GET /api/upload/:type/:filename
 * @description 获取图片
 * @access Public
 */
router.get('/:type/:userId/:filename', (req, res) => {
  try {
    const { type, userId, filename } = req.params;
    let filePath;
    
    if (type === 'avatar') {
      filePath = path.join(__dirname, '..', 'uploads', 'avatars', userId, filename);
    } else {
      // 保持原有逻辑
      filePath = path.join(__dirname, '..', 'uploads', type === 'lesson' ? 'lessons' : 'steps', userId);
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('获取图片错误:', error);
    res.status(404).json({ error: '图片不存在' });
  }
});

// 保持原有路由兼容性
router.get('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', type === 'lesson' ? 'lessons' : 'steps', filename);
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('获取图片错误:', error);
    res.status(404).json({ error: '图片不存在' });
  }
});

module.exports = router;
