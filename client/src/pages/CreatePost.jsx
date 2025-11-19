import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.trim().length > 120) {
      newErrors.title = 'Title must not exceed 120 characters';
    }

    if (!formData.content || formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (formData.image_url && formData.image_url.trim() !== '') {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(formData.image_url)) {
        newErrors.image_url = 'Image URL must be a valid URL';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await postsAPI.create(formData);

      if (response.post) {
        navigate(`/post/${response.post.id}`);
      } else {
        setErrors({ form: response.message || 'Failed to create post' });
      }
    } catch (error) {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Post</h1>

        {errors.form && (
          <div style={styles.errorBox}>{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter post title (5-120 characters)"
            />
            {errors.title && (
              <span style={styles.error}>{errors.title}</span>
            )}
            <span style={styles.charCount}>
              {formData.title.length}/120
            </span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Image URL <span style={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_url && (
              <span style={styles.error}>{errors.image_url}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Content <span style={styles.required}>*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Write your blog post content (minimum 50 characters)"
              rows="12"
            />
            {errors.content && (
              <span style={styles.error}>{errors.content}</span>
            )}
            <span style={styles.charCount}>
              {formData.content.length} characters
            </span>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  title: {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '1.5rem'
  },
  errorBox: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    color: '#ccc',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  required: {
    color: '#f44336'
  },
  optional: {
    color: '#888',
    fontWeight: 'normal'
  },
  input: {
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none'
  },
  textarea: {
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6'
  },
  error: {
    color: '#f44336',
    fontSize: '0.85rem'
  },
  charCount: {
    color: '#888',
    fontSize: '0.85rem',
    textAlign: 'right'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  cancelButton: {
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem'
  }
};

export default CreatePost;
