import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      return res.status(400).json({
        message: 'Failed to fetch posts',
        details: error.message
      });
    }

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({
        message: 'Failed to fetch post',
        details: error.message
      });
    }

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        details: 'No post exists with the given ID'
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.post('/', authenticateToken, validatePost, async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const { userId, username } = req.user;

    const { data: post, error } = await supabase
      .from('posts')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          image_url: image_url ? image_url.trim() : null,
          user_id: userId,
          username
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: 'Failed to create post',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.put('/:id', authenticateToken, validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;
    const { userId } = req.user;

    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return res.status(400).json({
        message: 'Failed to fetch post',
        details: fetchError.message
      });
    }

    if (!existingPost) {
      return res.status(404).json({
        message: 'Post not found',
        details: 'No post exists with the given ID'
      });
    }

    if (existingPost.user_id !== userId) {
      return res.status(403).json({
        message: 'Forbidden',
        details: 'You can only update your own posts'
      });
    }

    const { data: post, error: updateError } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim(),
        image_url: image_url ? image_url.trim() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({
        message: 'Failed to update post',
        details: updateError.message
      });
    }

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return res.status(400).json({
        message: 'Failed to fetch post',
        details: fetchError.message
      });
    }

    if (!existingPost) {
      return res.status(404).json({
        message: 'Post not found',
        details: 'No post exists with the given ID'
      });
    }

    if (existingPost.user_id !== userId) {
      return res.status(403).json({
        message: 'Forbidden',
        details: 'You can only delete your own posts'
      });
    }

    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({
        message: 'Failed to delete post',
        details: deleteError.message
      });
    }

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data: posts, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({
        message: 'Failed to fetch user posts',
        details: error.message
      });
    }

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

export default router;
