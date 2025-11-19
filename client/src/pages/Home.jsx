import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAll(search, page, 10);
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
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
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
        <h1 style={styles.title}>Blog Posts</h1>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={styles.empty}>
          <p>No posts found</p>
          <p style={styles.emptySubtext}>Be the first to create a post!</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                style={styles.card}
              >
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
                <div style={styles.cardContent}>
                  <h2 style={styles.postTitle}>{post.title}</h2>
                  <p style={styles.excerpt}>
                    {post.content.substring(0, 150)}...
                  </p>
                  <div style={styles.meta}>
                    <span style={styles.author}>By {post.username}</span>
                    <span style={styles.date}>
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
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
    marginBottom: '2rem'
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    color: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none'
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
  emptySubtext: {
    color: '#666',
    marginTop: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    border: '1px solid #333',
    transition: 'transform 0.2s, border-color 0.2s',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  postTitle: {
    color: '#fff',
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    lineHeight: '1.4'
  },
  excerpt: {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem'
  },
  author: {
    color: '#4CAF50',
    fontWeight: '500'
  },
  date: {
    color: '#888'
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
    fontSize: '0.9rem'
  },
  pageInfo: {
    color: '#ccc'
  }
};

export default Home;
