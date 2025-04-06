// src/pages/Chat.jsx
import React, { useState, useEffect } from 'react';

const SavedWords = () => {
  // In the future these will be changed to retrieve data from the database
  // Pseudocode: words = database_grab(saved_words)
  // This would also apply for favorites and languges pulling from an array
  const [words, setWords] = useState([]);
  const [language, setLanguage] = useState('English');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

 // Takes the data from the array (all the same right now) and will populate the values
  useEffect(() => {
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      word: 'Word',
      definition: 'Definition of word',
      favorite: i % 2 === 0,
    }));
    setWords(data);
  }, []);

  // constants for if filtered, how to get total pages, and helping pagination
  const filtered = favoritesOnly ? words.filter(w => w.favorite) : words;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '100px 24px 40px',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a1a' }}>Your Saved Words</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <label style={{ fontSize: '14px', color: '#333' }}>
            language:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: '8px', padding: '4px 8px' }}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#333' }}>
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={() => setFavoritesOnly(!favoritesOnly)}
              style={{ marginRight: '6px' }}
            />
            sort by favorites only
          </label>
        </div>
      </div>

      {/* renders list of word cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paginated.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px', color: '#111' }}>{item.word}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>{item.definition}</p>
            </div>
            <span style={{ fontSize: '20px', color: '#ccc' }}>
              {item.favorite ? '★' : '☆'}
            </span>
          </div>
        ))}
      </div>

      {/* pagination controls */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {[...Array(Math.min(5, totalPages)).keys()].map(i => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: currentPage === page ? '#333' : '#eee',
                color: currentPage === page ? 'white' : '#000',
                padding: '6px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          );
        })}

        {totalPages > 5 && (
          <>
            <span>...</span>
            <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </main>
  );
};

export default SavedWords;
