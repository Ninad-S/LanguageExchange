import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [comments, setComments] = useState({});
  const [commentInputMap, setCommentInputMap] = useState({});
  const [currentUserName, setCurrentUserName] = useState('Anonymous');

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const loadedPosts = [];
      const unsubscribesComments = {};

      snapshot.docs.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        loadedPosts.push(post);

        const commentsQuery = query(collection(db, 'posts', doc.id, 'comments'), orderBy('timestamp', 'asc'));
        const unsubscribeComments = onSnapshot(commentsQuery, (commentSnapshot) => {
          setComments((prevComments) => ({
            ...prevComments,
            [post.id]: commentSnapshot.docs.map((c) => ({
              id: c.id,
              ...c.data(),
            })),
          }));
        });

        unsubscribesComments[post.id] = unsubscribeComments;
      });

      setPosts(loadedPosts);

      return () => {
        Object.values(unsubscribesComments).forEach((unsub) => unsub());
      };
    });

    return () => unsubscribePosts();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users'), where('id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setCurrentUserName(userDoc.data().name);
        }
      }
    };

    fetchUserName();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    await addDoc(collection(db, 'posts'), {
      title: newPostTitle,
      content: newPostContent,
      author: currentUserName,
      timestamp: serverTimestamp(),
    });

    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleCreateComment = async (postId) => {
    const commentText = commentInputMap[postId];
    if (!commentText) return;

    await addDoc(collection(db, 'posts', postId, 'comments'), {
      content: commentText,
      author: currentUserName,
      timestamp: serverTimestamp(),
    });

    setCommentInputMap((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div style={styles.container}>
      <p style={styles.welcome}>Welcome, {currentUserName} 👋</p>

      <h1 style={styles.header}>Discussion Board</h1>

      {/* Create a new post */}
      <form onSubmit={handleCreatePost} style={styles.form}>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Enter post title"
          required
          style={styles.input}
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Enter post content"
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Create Post</button>
      </form>

      {/* Display all posts */}
      <div style={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <h3 style={styles.postTitle}>{post.title}</h3>
            <p>{post.content}</p>
            <small>
              Posted by <strong>{post.author}</strong> on{' '}
              {post.timestamp?.seconds
                ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                : '...'}
            </small>

            {/* Comments section */}
            <div style={styles.commentsSection}>
              <h4>Comments:</h4>
              {(comments[post.id] || []).map((comment) => (
                <div key={comment.id} style={styles.commentCard}>
                  <p>{comment.content}</p>
                  <small>
                    <strong>{comment.author}</strong> commented on{' '}
                    {comment.timestamp?.seconds
                      ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
                      : '...'}
                  </small>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div style={{ marginTop: '10px' }}>
              <textarea
                value={commentInputMap[post.id] || ''}
                onChange={(e) =>
                  setCommentInputMap((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                placeholder="Write a comment here"
                style={styles.textarea}
              />
              <button onClick={() => handleCreateComment(post.id)} style={styles.replyButton}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Inter, sans-serif',
  },
  welcome: {
    fontSize: '24px',        
    color: '#333',
    marginBottom: '10px',
    fontWeight: 'bold',      
  },
  header: {
    textAlign: 'left',       
    fontSize: '32px',        
    marginBottom: '30px',
    color: '#2c3e50',
  },
  form: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    minHeight: '80px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#6755d7',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  replyButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  postsContainer: {
    marginTop: '20px',
  },
  postCard: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  postTitle: {
    marginBottom: '10px',
    color: '#34495e',
  },
  commentsSection: {
    marginTop: '20px',
  },
  commentCard: {
    background: '#f1f2f6',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
  },
};

export default DiscussionBoard;
