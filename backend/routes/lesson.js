const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authenticate = require('../middleware/auth');

/**
 * @route GET /api/lessons
 * @description 获取课程列表
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    let lessons = [];
    let error = null;
    
    try {
      const result = await supabase
        .from('lessons')
        .select('*');
      
      lessons = result.data || [];
      error = result.error;
    } catch (err) {
      console.error('获取课程列表失败:', err);
      error = err;
    }

    if (error || lessons.length === 0) {
      // 使用模拟课程数据
      lessons = [
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
    }

    res.status(200).json({
      success: true,
      lessons
    });
  } catch (error) {
    console.error('获取课程列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route GET /api/lessons/:id
 * @description 获取课程详情（包含步骤）
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let lesson = null;
    let lessonError = null;
    let steps = [];
    let stepsError = null;

    try {
      // 获取课程信息
      const lessonResult = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

      lesson = lessonResult.data;
      lessonError = lessonResult.error;

      // 获取课程步骤
      if (!lessonError && lesson) {
        const stepsResult = await supabase
          .from('steps')
          .select('*')
          .eq('lesson_id', id)
          .order('order', { ascending: true });

        steps = stepsResult.data || [];
        stepsError = stepsResult.error;
      }
    } catch (error) {
      console.error('获取课程详情失败:', error);
      lessonError = error;
    }

    if (lessonError || !lesson) {
      // 使用模拟课程数据
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

      lesson = mockLessons[id] || null;

      if (!lesson) {
        return res.status(404).json({ error: '课程不存在' });
      }
    }

    // 格式化步骤数据
    const formattedSteps = steps.length > 0 ? steps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
      image: step.image
    })) : lesson.steps;

    res.status(200).json({
      success: true,
      lesson: {
        ...lesson,
        steps: formattedSteps
      }
    });
  } catch (error) {
    console.error('获取课程详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route GET /api/lessons/featured
 * @description 获取推荐课程
 * @access Public
 */
router.get('/featured', async (req, res) => {
  try {
    let lessons = [];
    let error = null;

    try {
      // 获取推荐课程（这里简单返回前2个课程）
      const result = await supabase
        .from('lessons')
        .select('*')
        .limit(2);

      lessons = result.data || [];
      error = result.error;
    } catch (err) {
      console.error('获取推荐课程失败:', err);
      error = err;
    }

    if (error || lessons.length === 0) {
      // 使用模拟课程数据
      lessons = [
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
    }

    res.status(200).json({
      success: true,
      lessons
    });
  } catch (error) {
    console.error('获取推荐课程错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route POST /api/lessons
 * @description 创建新课程
 * @access Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { id, title, pinyin, thumbnail, tip, steps } = req.body;

    if (!id || !title) {
      return res.status(400).json({ error: '课程ID和标题不能为空' });
    }

    // 创建课程
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert([{
        id,
        title,
        pinyin,
        thumbnail,
        tip
      }])
      .select('*')
      .single();

    if (lessonError) {
      console.error('创建课程失败:', lessonError);
      return res.status(500).json({ error: '创建课程失败' });
    }

    // 创建课程步骤
    if (steps && steps.length > 0) {
      const stepData = steps.map((step, index) => ({
        lesson_id: id,
        title: step.title,
        description: step.description,
        image: step.image,
        order: index + 1
      }));

      const { error: stepsError } = await supabase
        .from('steps')
        .insert(stepData);

      if (stepsError) {
        console.error('创建课程步骤失败:', stepsError);
        return res.status(500).json({ error: '创建课程步骤失败' });
      }
    }

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('创建课程错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route PUT /api/lessons/:id
 * @description 更新课程
 * @access Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pinyin, thumbnail, tip } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (pinyin) updateData.pinyin = pinyin;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (tip) updateData.tip = tip;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: '至少需要提供一个更新字段' });
    }

    const { data: updatedLesson, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('更新课程失败:', error);
      return res.status(500).json({ error: '更新课程失败' });
    }

    res.status(200).json({
      success: true,
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('更新课程错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route DELETE /api/lessons/:id
 * @description 删除课程
 * @access Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // 删除课程步骤
    const { error: stepsError } = await supabase
      .from('steps')
      .delete()
      .eq('lesson_id', id);

    if (stepsError) {
      console.error('删除课程步骤失败:', stepsError);
      return res.status(500).json({ error: '删除课程步骤失败' });
    }

    // 删除课程
    const { error: lessonError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (lessonError) {
      console.error('删除课程失败:', lessonError);
      return res.status(500).json({ error: '删除课程失败' });
    }

    res.status(200).json({
      success: true,
      message: '课程删除成功'
    });
  } catch (error) {
    console.error('删除课程错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;