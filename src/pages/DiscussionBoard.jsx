// src/pages/DiscussionBoard.jsx
import React, { useState } from 'react';

const DiscussionBoard = () => {
  // 帖子状态
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // 评论状态
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({}); // 按帖子 ID 存储评论

  // 创建新帖子
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    const newPost = {
      id: Date.now(), // 使用时间戳作为唯一 ID
      title: newPostTitle,
      content: newPostContent,
      author: 'Anonymous',
      timestamp: new Date().toLocaleString(),
    };

    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // 创建新评论
  const handleCreateComment = (postId) => {
    if (!newComment) return;

    const newCommentObj = {
      id: Date.now(), // 使用时间戳作为唯一 ID
      postId,
      content: newComment,
      author: 'Anonymous',
      timestamp: new Date().toLocaleString(),
    };

    // 更新评论状态
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), newCommentObj],
    }));

    setNewComment('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Discussion Board</h1>

      {/* 创建新帖子表单 */}
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

      {/* 显示所有帖子 */}
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>Posted by {post.author} on {post.timestamp}</small>

            {/* 显示评论 */}
            <div style={{ marginTop: '10px' }}>
              <h4>Comments:</h4>
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <p>{comment.content}</p>
                  <small>Commented by {comment.author} on {comment.timestamp}</small>
                </div>
              ))}
            </div>

            {/* 回复表单 */}
            <div style={{ marginTop: '10px' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
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