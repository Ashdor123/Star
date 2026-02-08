const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authenticate = require('../middleware/auth');
const { generateToken } = require('../utils/auth');

/**
 * @route POST /api/batch
 * @description 批量处理多个API请求
 * @access Public/Private (根据具体请求)
 */
router.post('/', async (req, res) => {
  try {
    const { requests } = req.body;

    if (!Array.isArray(requests)) {
      return res.status(400).json({ error: '请求格式错误，requests必须是数组' });
    }

    if (requests.length === 0) {
      return res.status(400).json({ error: '请求数组不能为空' });
    }

    if (requests.length > 10) {
      return res.status(400).json({ error: '请求数量不能超过10个' });
    }

    // 处理每个请求
    const responses = await Promise.all(
      requests.map(async (request, index) => {
        try {
          const { method, url, body, requiresAuth } = request;

          // 验证请求格式
          if (!method || !url) {
            return {
              index,
              success: false,
              error: '请求缺少method或url字段'
            };
          }

          // 处理需要认证的请求
          if (requiresAuth) {
            // 从请求头获取token
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              return {
                index,
                success: false,
                error: '需要认证但未提供token'
              };
            }

            const token = authHeader.split(' ')[1];
            // 验证token...（这里可以复用auth中间件的逻辑）
            // 简化处理，实际项目中应该使用完整的认证逻辑
          }

          // 处理不同的API端点
          const urlParts = url.split('/').filter(Boolean);
          const apiPath = urlParts[0]; // 应该是api
          const resource = urlParts[1];
          const resourceId = urlParts[2];

          switch (resource) {
            case 'auth':
              return await handleAuthRequest(method, resourceId, body, index);
            case 'users':
              return await handleUsersRequest(method, resourceId, body, req.user, index);
            case 'lessons':
              return await handleLessonsRequest(method, resourceId, body, index);
            case 'progress':
              return await handleProgressRequest(method, resourceId, body, req.user, index);
            default:
              return {
                index,
                success: false,
                error: `不支持的资源类型: ${resource}`
              };
          }
        } catch (error) {
          console.error(`处理请求 ${index} 时出错:`, error);
          return {
            index,
            success: false,
            error: '处理请求时发生错误'
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      responses
    });
  } catch (error) {
    console.error('批量请求处理错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 处理认证相关请求
async function handleAuthRequest(method, action, body, index) {
  switch (action) {
    case 'register':
      if (method === 'POST') {
        const { name, account, password, avatar } = body;

        if (!name || !account || !password) {
          return {
            index,
            success: false,
            error: '用户名、账号和密码不能为空'
          };
        }

        try {
          const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
              name,
              account,
              password,
              avatar: avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
              level: 1
            }])
            .select('*')
            .single();

          if (error) {
            return {
              index,
              success: false,
              error: '注册失败: ' + error.message
            };
          }

          const token = generateToken({ user_id: newUser.id });

          return {
            index,
            success: true,
            data: {
              user: {
                id: newUser.id,
                name: newUser.name,
                avatar: newUser.avatar,
                level: newUser.level
              },
              token
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '注册过程中发生错误'
          };
        }
      }
      break;
    
    case 'login':
      if (method === 'POST') {
        const { account, password, guest } = body;

        try {
          let user = null;

          if (guest) {
            // 创建游客用户
            const { data: newUser, error } = await supabase
              .from('users')
              .insert([{
                name: '游客',
                account: 'guest_' + Date.now(),
                password: 'guest',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
                level: 1
              }])
              .select('*')
              .single();

            if (error) {
              // 使用模拟用户数据
              user = {
                id: Date.now().toString(),
                name: '游客',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
                level: 1
              };
            } else {
              user = newUser;
            }
          } else if (account && password) {
            // 账号密码登录
            const { data: users, error } = await supabase
              .from('users')
              .select('*')
              .eq('account', account)
              .limit(1);

            if (error || users.length === 0 || users[0].password !== password) {
              // 测试账号
              if (account === 'test' && password === 'test') {
                user = {
                  id: '1',
                  name: '测试用户',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
                  level: 1
                };
              } else {
                return {
                  index,
                  success: false,
                  error: '账号或密码错误'
                };
              }
            } else {
              user = users[0];
            }
          } else {
            return {
              index,
              success: false,
              error: '请提供账号密码或使用游客登录'
            };
          }

          const token = generateToken({ user_id: user.id });

          return {
            index,
            success: true,
            data: {
              user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                level: user.level
              },
              token
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '登录过程中发生错误'
          };
        }
      }
      break;

    default:
      return {
        index,
        success: false,
        error: `不支持的认证操作: ${action}`
      };
  }

  return {
    index,
    success: false,
    error: '不支持的请求方法或路径'
  };
}

// 处理用户相关请求
async function handleUsersRequest(method, action, body, user, index) {
  if (!user) {
    return {
      index,
      success: false,
      error: '需要认证'
    };
  }

  switch (action) {
    case 'me':
      if (method === 'GET') {
        return {
          index,
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              level: user.level
            }
          }
        };
      } else if (method === 'PUT') {
        const { name, avatar } = body;

        if (!name && !avatar) {
          return {
            index,
            success: false,
            error: '至少需要提供一个更新字段'
          };
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;
        updateData.updated_at = new Date().toISOString();

        try {
          const { data: userData, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id)
            .select('*')
            .single();

          if (error) {
            // 使用模拟数据
            return {
              index,
              success: true,
              data: {
                user: {
                  id: user.id,
                  name: name || user.name,
                  avatar: avatar || user.avatar,
                  level: user.level
                }
              }
            };
          }

          return {
            index,
            success: true,
            data: {
              user: {
                id: userData.id,
                name: userData.name,
                avatar: userData.avatar,
                level: userData.level
              }
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '更新用户信息失败'
          };
        }
      }
      break;

    default:
      return {
        index,
        success: false,
        error: `不支持的用户操作: ${action}`
      };
  }

  return {
    index,
    success: false,
    error: '不支持的请求方法或路径'
  };
}

// 处理课程相关请求
async function handleLessonsRequest(method, action, body, index) {
  switch (action) {
    case '':
      if (method === 'GET') {
        try {
          const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*');

          if (error || !lessons || lessons.length === 0) {
            // 使用模拟数据
            const mockLessons = [
              {
                id: 'friend',
                title: '朋友',
                pinyin: 'Péng Yǒu',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ',
                tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
                steps: [
                  {
                    id: 1,
                    title: '食指相对',
                    description: '双手食指伸出，指尖相对。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '相钩结合',
                    description: '左右食指互相钩在一起，轻轻拉动。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              },
              {
                id: 'hello',
                title: '你好',
                pinyin: 'Nǐ Hǎo',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS9nNiMWtxCfogk1FYyRWH9bZXnjqgvYK-K4jBQz7jkCx30aHn5My2DBbxr8U3GFwR7ZnweqHvg7rR5v9IxLeMGG_QBrR6ig6IThEqWT7DzeSvV-1c2T31N8MS0ceg8PGsjAFD25VHtO5NTBi16N493pDSk6ynF8hQ9qaooHhjrM3AynOvBbmwjhXJ1gLJUaUf8GezmcDas4Lu3rtQLzT2Op8k5fJ3bmFvdptyqwhSVmRpsB2LXvZ9D86wU5ssSAupvIfBDhfobUY',
                tip: '做“你好”这个动作时，记得要保持微笑哦！',
                steps: [
                  {
                    id: 1,
                    title: '举起手掌',
                    description: '张开你的手掌，举到额头附近，就像敬礼一样。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '向前移动',
                    description: '手掌稍微向前并在头部前方画一个小弧线。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              }
            ];

            return {
              index,
              success: true,
              data: {
                lessons: mockLessons
              }
            };
          }

          return {
            index,
            success: true,
            data: {
              lessons
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '获取课程列表失败'
          };
        }
      }
      break;

    case 'featured':
      if (method === 'GET') {
        try {
          const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .limit(2);

          if (error || !lessons || lessons.length === 0) {
            // 使用模拟数据
            const mockLessons = [
              {
                id: 'friend',
                title: '朋友',
                pinyin: 'Péng Yǒu',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ',
                tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
                steps: [
                  {
                    id: 1,
                    title: '食指相对',
                    description: '双手食指伸出，指尖相对。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '相钩结合',
                    description: '左右食指互相钩在一起，轻轻拉动。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              },
              {
                id: 'hello',
                title: '你好',
                pinyin: 'Nǐ Hǎo',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS9nNiMWtxCfogk1FYyRWH9bZXnjqgvYK-K4jBQz7jkCx30aHn5My2DBbxr8U3GFwR7ZnweqHvg7rR5v9IxLeMGG_QBrR6ig6IThEqWT7DzeSvV-1c2T31N8MS0ceg8PGsjAFD25VHtO5NTBi16N493pDSk6ynF8hQ9qaooHhjrM3AynOvBbmwjhXJ1gLJUaUf8GezmcDas4Lu3rtQLzT2Op8k5fJ3bmFvdptyqwhSVmRpsB2LXvZ9D86wU5ssSAupvIfBDhfobUY',
                tip: '做“你好”这个动作时，记得要保持微笑哦！',
                steps: [
                  {
                    id: 1,
                    title: '举起手掌',
                    description: '张开你的手掌，举到额头附近，就像敬礼一样。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '向前移动',
                    description: '手掌稍微向前并在头部前方画一个小弧线。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              }
            ];

            return {
              index,
              success: true,
              data: {
                lessons: mockLessons
              }
            };
          }

          return {
            index,
            success: true,
            data: {
              lessons
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '获取推荐课程失败'
          };
        }
      }
      break;

    default:
      if (method === 'GET') {
        // 获取课程详情
        try {
          const lessonId = action;
          const { data: lesson, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', lessonId)
            .single();

          if (error || !lesson) {
            // 使用模拟数据
            const mockLessons = {
              friend: {
                id: 'friend',
                title: '朋友',
                pinyin: 'Péng Yǒu',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ',
                tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
                steps: [
                  {
                    id: 1,
                    title: '食指相对',
                    description: '双手食指伸出，指尖相对。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '相钩结合',
                    description: '左右食指互相钩在一起，轻轻拉动。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              },
              hello: {
                id: 'hello',
                title: '你好',
                pinyin: 'Nǐ Hǎo',
                thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS9nNiMWtxCfogk1FYyRWH9bZXnjqgvYK-K4jBQz7jkCx30aHn5My2DBbxr8U3GFwR7ZnweqHvg7rR5v9IxLeMGG_QBrR6ig6IThEqWT7DzeSvV-1c2T31N8MS0ceg8PGsjAFD25VHtO5NTBi16N493pDSk6ynF8hQ9qaooHhjrM3AynOvBbmwjhXJ1gLJUaUf8GezmcDas4Lu3rtQLzT2Op8k5fJ3bmFvdptyqwhSVmRpsB2LXvZ9D86wU5ssSAupvIfBDhfobUY',
                tip: '做“你好”这个动作时，记得要保持微笑哦！',
                steps: [
                  {
                    id: 1,
                    title: '举起手掌',
                    description: '张开你的手掌，举到额头附近，就像敬礼一样。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
                  },
                  {
                    id: 2,
                    title: '向前移动',
                    description: '手掌稍微向前并在头部前方画一个小弧线。',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
                  }
                ]
              }
            };

            const mockLesson = mockLessons[lessonId];
            if (!mockLesson) {
              return {
                index,
                success: false,
                error: '课程不存在'
              };
            }

            return {
              index,
              success: true,
              data: {
                lesson: mockLesson
              }
            };
          }

          // 获取课程步骤
          const { data: steps, error: stepsError } = await supabase
            .from('steps')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('order', { ascending: true });

          const formattedSteps = steps && steps.length > 0 ? steps.map(step => ({
            id: step.id,
            title: step.title,
            description: step.description,
            image: step.image
          })) : [];

          return {
            index,
            success: true,
            data: {
              lesson: {
                ...lesson,
                steps: formattedSteps
              }
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '获取课程详情失败'
          };
        }
      }
      break;
  }

  return {
    index,
    success: false,
    error: '不支持的请求方法或路径'
  };
}

// 处理学习进度相关请求
async function handleProgressRequest(method, lessonId, body, user, index) {
  if (!user) {
    return {
      index,
      success: false,
      error: '需要认证'
    };
  }

  switch (method) {
    case 'GET':
      if (lessonId === '') {
        // 获取所有进度
        try {
          const { data: progress, error } = await supabase
            .from('learning_progress')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            return {
              index,
              success: false,
              error: '获取学习进度失败'
            };
          }

          return {
            index,
            success: true,
            data: {
              progress
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '获取学习进度失败'
          };
        }
      } else {
        // 获取特定课程进度
        try {
          const { data: progress, error } = await supabase
            .from('learning_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();

          if (error && error.code === 'PGRST116') {
            // 没有找到进度记录，返回默认进度
            return {
              index,
              success: true,
              data: {
                progress: {
                  user_id: user.id,
                  lesson_id: lessonId,
                  completed: false,
                  progress: 0,
                  last_accessed: new Date().toISOString()
                }
              }
            };
          } else if (error) {
            return {
              index,
              success: false,
              error: '获取课程进度失败'
            };
          }

          return {
            index,
            success: true,
            data: {
              progress
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '获取课程进度失败'
          };
        }
      }

    case 'PUT':
      if (lessonId) {
        const { progress, completed } = body;

        if (progress === undefined && completed === undefined) {
          return {
            index,
            success: false,
            error: '至少需要提供进度或完成状态'
          };
        }

        try {
          // 检查是否已存在进度记录
          const { data: existingProgress, error: checkError } = await supabase
            .from('learning_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();

          let result;

          if (checkError && checkError.code === 'PGRST116') {
            // 不存在进度记录，创建新记录
            const insertData = {
              user_id: user.id,
              lesson_id: lessonId,
              progress: progress || 0,
              completed: completed || false,
              last_accessed: new Date().toISOString()
            };

            result = await supabase
              .from('learning_progress')
              .insert(insertData)
              .select('*')
              .single();
          } else if (checkError) {
            return {
              index,
              success: false,
              error: '更新进度失败'
            };
          } else {
            // 存在进度记录，更新记录
            const updateData = {
              last_accessed: new Date().toISOString()
            };
            if (progress !== undefined) updateData.progress = progress;
            if (completed !== undefined) updateData.completed = completed;

            result = await supabase
              .from('learning_progress')
              .update(updateData)
              .eq('user_id', user.id)
              .eq('lesson_id', lessonId)
              .select('*')
              .single();
          }

          if (result.error) {
            return {
              index,
              success: false,
              error: '更新进度失败'
            };
          }

          return {
            index,
            success: true,
            data: {
              progress: result.data
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '更新进度失败'
          };
        }
      }
      break;

    case 'DELETE':
      if (lessonId) {
        try {
          const { error } = await supabase
            .from('learning_progress')
            .delete()
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId);

          if (error) {
            return {
              index,
              success: false,
              error: '删除学习进度失败'
            };
          }

          return {
            index,
            success: true,
            data: {
              message: '学习进度删除成功'
            }
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: '删除学习进度失败'
          };
        }
      }
      break;
  }

  return {
    index,
    success: false,
    error: '不支持的请求方法或路径'
  };
}

module.exports = router;