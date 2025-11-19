import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsAPI.getById(id);
        if (data.message) {
          setError(data.message);
        } else {
          setPost(data);
        }
      } catch (error) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div style={styles.error}>
        <h2>{error || 'Post not found'}</h2>
        <Link to="/" style={styles.link}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Back to Posts
      </Link>

      <article style={styles.article}>
        <header style={styles.header}>
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <span style={styles.author}>By {post.username}</span>
            <span style={styles.date}>{formatDate(post.created_at)}</span>
          </div>
        </header>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            style={styles.image}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        <div style={styles.content}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {post.updated_at !== post.created_at && (
          <div style={styles.updated}>
            Last updated: {formatDate(post.updated_at)}
          </div>
        )}
      </article>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  backLink: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontSize: '1rem',
    display: 'inline-block',
    marginBottom: '2rem'
  },
  loading: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '3rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#f44336'
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '1rem'
  },
  article: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '2rem',
    overflow: 'hidden'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem',
    marginBottom: '1rem',
    lineHeight: '1.3'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.95rem',
    flexWrap: 'wrap'
  },
  author: {
    color: '#4CAF50',
    fontWeight: '500'
  },
  date: {
    color: '#888'
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  content: {
    color: '#ccc',
    fontSize: '1.1rem',
    lineHeight: '1.8'
  },
  paragraph: {
    marginBottom: '1rem'
  },
  updated: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #333',
    color: '#888',
    fontSize: '0.9rem',
    fontStyle: 'italic'
  }
};

export default PostDetail;
