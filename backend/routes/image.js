const express = require('express');
const router = express.Router();

// 生成默认图片
router.get('/default/:type', (req, res) => {
  const { type } = req.params;
  
  // 返回简单的SVG图片
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f0f0f0"/>
      <text x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#666">${type === 'thumbnail' ? '课程缩略图' : '步骤图片'}</text>
      <circle cx="100" cy="60" r="20" fill="#ff9800"/>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgContent);
});

module.exports = router;
