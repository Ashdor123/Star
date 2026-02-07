const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authenticate = require('../middleware/auth');

/**
 * @route GET /api/progress
 * @description 获取用户学习进度
 * @access Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { user } = req;

    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('获取学习进度失败:', error);
      return res.status(500).json({ error: '获取学习进度失败' });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('获取学习进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route GET /api/progress/:lessonId
 * @description 获取用户特定课程的学习进度
 * @access Private
 */
router.get('/:lessonId', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { lessonId } = req.params;

    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code === 'PGRST116') {
      // 没有找到进度记录，返回默认进度
      return res.status(200).json({
        success: true,
        progress: {
          user_id: user.id,
          lesson_id: lessonId,
          completed: false,
          progress: 0,
          last_accessed: new Date().toISOString()
        }
      });
    } else if (error) {
      console.error('获取课程进度失败:', error);
      return res.status(500).json({ error: '获取课程进度失败' });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('获取课程进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route PUT /api/progress/:lessonId
 * @description 更新用户学习进度
 * @access Private
 */
router.put('/:lessonId', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { lessonId } = req.params;
    const { progress, completed } = req.body;

    if (progress === undefined && completed === undefined) {
      return res.status(400).json({ error: '至少需要提供进度或完成状态' });
    }

    // 检查是否已存在进度记录
    const { data: existingProgress, error: checkError } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    const updateData = {
      last_accessed: new Date().toISOString()
    };

    if (progress !== undefined) {
      updateData.progress = progress;
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

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
      console.error('检查进度记录失败:', checkError);
      return res.status(500).json({ error: '更新进度失败' });
    } else {
      // 存在进度记录，更新记录
      result = await supabase
        .from('learning_progress')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .select('*')
        .single();
    }

    if (result.error) {
      console.error('更新进度失败:', result.error);
      return res.status(500).json({ error: '更新进度失败' });
    }

    res.status(200).json({
      success: true,
      progress: result.data
    });
  } catch (error) {
    console.error('更新进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @route DELETE /api/progress/:lessonId
 * @description 删除用户特定课程的学习进度
 * @access Private
 */
router.delete('/:lessonId', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { lessonId } = req.params;

    const { error } = await supabase
      .from('learning_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('删除学习进度失败:', error);
      return res.status(500).json({ error: '删除学习进度失败' });
    }

    res.status(200).json({
      success: true,
      message: '学习进度删除成功'
    });
  } catch (error) {
    console.error('删除学习进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;