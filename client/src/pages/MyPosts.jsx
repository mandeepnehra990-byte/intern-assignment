import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await postsAPI.getUserPosts(user.id, page, 10);
      setPosts(response.posts || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, user]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await postsAPI.delete(postId);
      if (response.message && !response.details) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert(response.message || 'Failed to delete post');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Posts</h1>
        <Link to="/create" style={styles.createButton}>
          + Create New Post
        </Link>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading your posts...</div>
      ) : posts.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't created any posts yet</p>
          <Link to="/create" style={styles.createLink}>
            Create your first post
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {posts.map((post) => (
              <div key={post.id} style={styles.card}>
                <div style={styles.cardContent}>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={styles.thumbnail}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div style={styles.info}>
                    <h2 style={styles.postTitle}>{post.title}</h2>
                    <p style={styles.excerpt}>
                      {post.content.substring(0, 100)}...
                    </p>
                    <span style={styles.date}>
                      Created: {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>
                <div style={styles.actions}>
                  <Link
                    to={`/post/${post.id}`}
                    style={styles.viewButton}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => navigate(`/edit/${post.id}`)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  ...styles.pageButton,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === pagination.totalPages}
                style={{
                  ...styles.pageButton,
                  opacity: page === pagination.totalPages ? 0.5 : 1,
                  cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem'
  },
  createButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  },
  loading: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '3rem'
  },
  empty: {
    textAlign: 'center',
    color: '#ccc',
    padding: '3rem'
  },
  createLink: {
    color: '#4CAF50',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '1rem',
    fontSize: '1.1rem'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  cardContent: {
    display: 'flex',
    gap: '1.5rem',
    flex: 1,
    minWidth: '300px'
  },
  thumbnail: {
    width: '120px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  postTitle: {
    color: '#fff',
    fontSize: '1.25rem',
    margin: 0
  },
  excerpt: {
    color: '#ccc',
    fontSize: '0.9rem',
    margin: 0
  },
  date: {
    color: '#888',
    fontSize: '0.85rem'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  viewButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer'
  },
  editButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  pageButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  pageInfo: {
    color: '#ccc'
  }
};

export default MyPosts;
