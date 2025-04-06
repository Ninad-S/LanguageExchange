// src/pages/DiscussionBoard.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [comments, setComments] = useState({}); // { postId: [comments] }
  const [commentInputMap, setCommentInputMap] = useState({}); // { postId: "comment" }

  // Load posts and their comments
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const loadedPosts = [];
      const loadedComments = {};

      for (const doc of snapshot.docs) {
        const post = { id: doc.id, ...doc.data() };

        const commentSnap = await getDocs(collection(db, 'posts', doc.id, 'comments'));
        loadedComments[post.id] = commentSnap.docs.map((c) => ({
          id: c.id,
          ...c.data(),
        }));

        loadedPosts.push(post);
      }

      setPosts(loadedPosts);
      setComments(loadedComments);
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    await addDoc(collection(db, 'posts'), {
      title: newPostTitle,
      content: newPostContent,
      author: 'Anonymous',
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
      author: 'Anonymous',
      timestamp: serverTimestamp(),
    });

    // Clear input for just that post
    setCommentInputMap((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Discussion Board</h1>

      {/* Create new post */}
      <form onSubmit={handleCreatePost} style={{ marginBottom: '20px' }}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Enter post content"
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>

      {/* Display posts */}
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>
              Posted by {post.author} on{' '}
              {post.timestamp?.seconds
                ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                : '...'}
            </small>

            {/* Comments */}
            <div style={{ marginTop: '10px' }}>
              <h4>Comments:</h4>
              {(comments[post.id] || []).map((comment) => (
                <div key={comment.id} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <p>{comment.content}</p>
                  <small>
                    Commented by {comment.author} on{' '}
                    {comment.timestamp?.seconds
                      ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
                      : '...'}
                  </small>
                </div>
              ))}
            </div>

            {/* Comment input for each post */}
            <div style={{ marginTop: '10px' }}>
              <textarea
                value={commentInputMap[post.id] || ''}
                onChange={(e) =>
                  setCommentInputMap((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                placeholder="Write a comment"
              />
              <button onClick={() => handleCreateComment(post.id)}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionBoard;
