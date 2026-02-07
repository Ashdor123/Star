const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

/**
 * 生成JWT token
 * @param {Object} payload - 要编码的payload
 * @returns {string} - 生成的JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT token
 * @param {string} token - 要验证的JWT token
 * @returns {Object} - 解码后的payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * 从请求头中提取token
 * @param {Object} req - Express请求对象
 * @returns {string|null} - 提取的token或null
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) return null;
  
  return token;
}

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};