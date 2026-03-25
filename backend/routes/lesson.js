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
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
          steps: [
            {
              id: 1,
              title: '食指相对',
              description: '双手食指伸出，指尖相对。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '相钩结合',
              description: '左右食指互相钩在一起，轻轻拉动。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'hello',
          title: '你好',
          pinyin: 'Nǐ Hǎo',
          thumbnail: '/api/images/default/thumbnail',
          tip: '做“你好”这个动作时，记得要保持微笑哦！',
          steps: [
            {
              id: 1,
              title: '举起手掌',
              description: '张开你的手掌，举到额头附近，就像敬礼一样。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '向前移动',
              description: '手掌稍微向前并在头部前方画一个小弧线。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'thank',
          title: '谢谢',
          pinyin: 'Xiè Xiè',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“谢谢”时，双手合十，轻轻点头，表达感激之情。',
          steps: [
            {
              id: 1,
              title: '双手合十',
              description: '双手掌心相对，手指并拢，合十于胸前。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '轻轻点头',
              description: '保持双手合十的姿势，轻轻点头表示感谢。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'goodbye',
          title: '再见',
          pinyin: 'Zài Jiàn',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“再见”时，挥手的动作要轻盈，面带微笑。',
          steps: [
            {
              id: 1,
              title: '举起手臂',
              description: '举起一只手臂，手掌张开，手指自然伸直。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '左右摆动',
              description: '手臂轻轻左右摆动，手掌向外，表示再见。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'sorry',
          title: '对不起',
          pinyin: 'Duì Bù Qǐ',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“对不起”时，表情要诚恳，动作要轻柔。',
          steps: [
            {
              id: 1,
              title: '双手交叉',
              description: '双手掌心向下，交叉放在胸前。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '轻轻点头',
              description: '保持双手交叉的姿势，轻轻点头表示歉意。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'please',
          title: '请',
          pinyin: 'Qǐng',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“请”时，手势要温和，体现礼貌和尊重。',
          steps: [
            {
              id: 1,
              title: '手掌向上',
              description: '一只手手掌向上，手指并拢，轻轻抬起。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '微微摆动',
              description: '手掌微微向内侧摆动，表示邀请或请求。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'love',
          title: '我爱你',
          pinyin: 'Wǒ Ài Nǐ',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“我爱你”时，手势要充满感情，用心传达爱意。',
          steps: [
            {
              id: 1,
              title: '伸出手指',
              description: '一只手伸出拇指、食指和小指，中指和无名指弯曲。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '放在胸前',
              description: '将手势放在胸前，轻轻晃动，表示我爱你。',
              image: '/api/images/default/step'
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
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
          steps: [
            {
              id: 1,
              title: '食指相对',
              description: '双手食指伸出，指尖相对。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '相钩结合',
              description: '左右食指互相钩在一起，轻轻拉动。',
              image: '/api/images/default/step'
            }
          ]
        },
        hello: {
          id: 'hello',
          title: '你好',
          pinyin: 'Nǐ Hǎo',
          thumbnail: '/api/images/default/thumbnail',
          tip: '做“你好”这个动作时，记得要保持微笑哦！',
          steps: [
            {
              id: 1,
              title: '举起手掌',
              description: '张开你的手掌，举到额头附近，就像敬礼一样。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '向前移动',
              description: '手掌稍微向前并在头部前方画一个小弧线。',
              image: '/api/images/default/step'
            }
          ]
        },
        thank: {
          id: 'thank',
          title: '谢谢',
          pinyin: 'Xiè Xiè',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“谢谢”时，双手合十，轻轻点头，表达感激之情。',
          steps: [
            {
              id: 1,
              title: '双手合十',
              description: '双手掌心相对，手指并拢，合十于胸前。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '轻轻点头',
              description: '保持双手合十的姿势，轻轻点头表示感谢。',
              image: '/api/images/default/step'
            }
          ]
        },
        goodbye: {
          id: 'goodbye',
          title: '再见',
          pinyin: 'Zài Jiàn',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“再见”时，挥手的动作要轻盈，面带微笑。',
          steps: [
            {
              id: 1,
              title: '举起手臂',
              description: '举起一只手臂，手掌张开，手指自然伸直。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '左右摆动',
              description: '手臂轻轻左右摆动，手掌向外，表示再见。',
              image: '/api/images/default/step'
            }
          ]
        },
        sorry: {
          id: 'sorry',
          title: '对不起',
          pinyin: 'Duì Bù Qǐ',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“对不起”时，表情要诚恳，动作要轻柔。',
          steps: [
            {
              id: 1,
              title: '双手交叉',
              description: '双手掌心向下，交叉放在胸前。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '轻轻点头',
              description: '保持双手交叉的姿势，轻轻点头表示歉意。',
              image: '/api/images/default/step'
            }
          ]
        },
        please: {
          id: 'please',
          title: '请',
          pinyin: 'Qǐng',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“请”时，手势要温和，体现礼貌和尊重。',
          steps: [
            {
              id: 1,
              title: '手掌向上',
              description: '一只手手掌向上，手指并拢，轻轻抬起。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '微微摆动',
              description: '手掌微微向内侧摆动，表示邀请或请求。',
              image: '/api/images/default/step'
            }
          ]
        },
        love: {
          id: 'love',
          title: '我爱你',
          pinyin: 'Wǒ Ài Nǐ',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“我爱你”时，手势要充满感情，用心传达爱意。',
          steps: [
            {
              id: 1,
              title: '伸出手指',
              description: '一只手伸出拇指、食指和小指，中指和无名指弯曲。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '放在胸前',
              description: '将手势放在胸前，轻轻晃动，表示我爱你。',
              image: '/api/images/default/step'
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
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
          steps: [
            {
              id: 1,
              title: '食指相对',
              description: '双手食指伸出，指尖相对。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '相钩结合',
              description: '左右食指互相钩在一起，轻轻拉动。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'hello',
          title: '你好',
          pinyin: 'Nǐ Hǎo',
          thumbnail: '/api/images/default/thumbnail',
          tip: '做“你好”这个动作时，记得要保持微笑哦！',
          steps: [
            {
              id: 1,
              title: '举起手掌',
              description: '张开你的手掌，举到额头附近，就像敬礼一样。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '向前移动',
              description: '手掌稍微向前并在头部前方画一个小弧线。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'thank',
          title: '谢谢',
          pinyin: 'Xiè Xiè',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“谢谢”时，双手合十，轻轻点头，表达感激之情。',
          steps: [
            {
              id: 1,
              title: '双手合十',
              description: '双手掌心相对，手指并拢，合十于胸前。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '轻轻点头',
              description: '保持双手合十的姿势，轻轻点头表示感谢。',
              image: '/api/images/default/step'
            }
          ]
        },
        {
          id: 'goodbye',
          title: '再见',
          pinyin: 'Zài Jiàn',
          thumbnail: '/api/images/default/thumbnail',
          tip: '表达“再见”时，挥手的动作要轻盈，面带微笑。',
          steps: [
            {
              id: 1,
              title: '举起手臂',
              description: '举起一只手臂，手掌张开，手指自然伸直。',
              image: '/api/images/default/step'
            },
            {
              id: 2,
              title: '左右摆动',
              description: '手臂轻轻左右摆动，手掌向外，表示再见。',
              image: '/api/images/default/step'
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