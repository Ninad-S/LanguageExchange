import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, update, push, set } from 'firebase/database';

const SavedWords = () => {
  const [words, setWords] = useState([]);
  const [language, setLanguage] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', translation: '', language: 'English' });

  const itemsPerPage = 6;
  const userPath = 'savedUsers/testuser';

  useEffect(() => {
    const wordsRef = ref(rtdb, userPath);
    onValue(wordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedWords = Object.entries(data).map(([id, entry]) => ({
          id,
          word: entry.word,
          definition: entry.translation,
          favorite: entry.isFavorite,
          language: entry.language
        }));
        setWords(fetchedWords);
      } else {
        setWords([]);
      }
    });
  }, []);

  const toggleFavorite = (wordId, currentValue) => {
    const wordRef = ref(rtdb, `${userPath}/${wordId}`);
    update(wordRef, { isFavorite: !currentValue });
  };

  const addNewWord = () => {
    const wordRef = push(ref(rtdb, userPath));
    set(wordRef, {
      word: newWord.word,
      translation: newWord.translation,
      language: newWord.language,
      isFavorite: false
    });
    setShowModal(false);
    setNewWord({ word: '', translation: '', language: 'English' });
  };

  const filtered = words.filter(w =>
    (!favoritesOnly || w.favorite) &&
    (language === 'All' || w.language === language)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main style={{
      maxWidth: '100%',
      margin: '0 auto',
      padding: '100px 24px 40px',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a1a' }}>Your Saved Words</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setShowModal(true)} style={{ padding: '6px 12px', borderRadius: '6px' }}>+ Add Word</button>
          <label style={{ fontSize: '14px', color: '#333' }}>
            language:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: '8px', padding: '4px 8px' }}
            >
              <option>All</option>
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

      {/* Word cards */}
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
            <span
              onClick={() => toggleFavorite(item.id, item.favorite)}
              style={{ fontSize: '20px', color: item.favorite ? '#f1c40f' : '#ccc', cursor: 'pointer' }}
            >
              {item.favorite ? '★' : '☆'}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
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

        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '300px' }}>
            <h3 style={{ marginBottom: '10px' }}>Add New Word</h3>
            <input
              type="text"
              placeholder="Word"
              value={newWord.word}
              onChange={e => setNewWord({ ...newWord, word: e.target.value })}
              style={{ width: '80%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Translation"
              value={newWord.translation}
              onChange={e => setNewWord({ ...newWord, translation: e.target.value })}
              style={{ width: '80%', marginBottom: '10px', padding: '8px' }}
            />
            <select
              value={newWord.language}
              onChange={e => setNewWord({ ...newWord, language: e.target.value })}
              style={{ width: '80%', marginBottom: '10px', padding: '8px' }}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={addNewWord}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SavedWords;
