import { useState, useRef } from 'react';

// Іконки
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/>
    <path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z"/>
  </svg>
);

const IconLoader = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// Конфігурація
const WEBHOOK_URL = 'https://n8n.rnd.webpromo.tools/webhook/course-generator';

export default function App() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    audience: '',
    tone: '',
    modulesCount: '4',
    lessonsPerModule: '4',
    lessonDuration: '15',
  });
  
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx', 'doc', 'txt'].includes(ext);
    });
    
    if (files.length + validFiles.length <= 4) {
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      alert('Максимум 4 файли');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    if (links.length < 4) {
      setLinks(prev => [...prev, '']);
    }
  };

  const removeLink = (index) => {
    if (links.length > 1) {
      setLinks(prev => prev.filter((_, i) => i !== index));
    } else {
      setLinks(['']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = new FormData();
      
      submitData.append('data', JSON.stringify({
        ...formData,
        links: links.filter(l => l.trim() !== ''),
        timestamp: new Date().toISOString(),
      }));
      
      files.forEach((file, index) => {
        submitData.append(`file_${index}`, file);
      });

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        throw new Error('Помилка відправки');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalLessons = formData.modulesCount * formData.lessonsPerModule;
  const totalHours = Math.round(totalLessons * formData.lessonDuration / 60);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <IconSparkles />
            </div>
            <span className="logo-text">CourseAI</span>
          </div>
          <div className="header-badge">Deep Research</div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="container">
          {/* Hero */}
          <div className="hero">
            <h1 className="hero-title">Генератор навчальних курсів</h1>
            <p className="hero-subtitle">Створіть професійну програму курсу за допомогою ШІ</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {/* Етап 1: Тема курсу */}
            <section className="card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="step-badge">1</span>
                  <h2 className="card-title">Тема курсу</h2>
                </div>
                <button 
                  type="button" 
                  className="settings-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  title="База знань"
                >
                  <IconSettings />
                </button>
              </div>

              {/* Settings Panel (База знань) */}
              {showSettings && (
                <div className="settings-panel">
                  <div className="settings-header">
                    <h3 className="settings-title">База знань</h3>
                    <span className="settings-hint">Опціонально — матеріали для аналізу</span>
                  </div>

                  {/* Файли */}
                  <div className="form-group">
                    <label className="label">Файли</label>
                    <p className="hint">PDF, DOCX, TXT — книги, статті, регламенти</p>
                    
                    <div 
                      className="dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <IconUpload />
                      <span>Натисніть для вибору файлів</span>
                      <span className="dropzone-hint">{files.length}/4</span>
                    </div>

                    {files.length > 0 && (
                      <div className="files-list">
                        {files.map((file, index) => (
                          <div key={index} className="file-item">
                            <IconFile />
                            <span className="file-name">{file.name}</span>
                            <button type="button" onClick={() => removeFile(index)} className="remove-btn">
                              <IconX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Посилання */}
                  <div className="form-group">
                    <label className="label">Посилання</label>
                    <p className="hint">Корисні статті, документація, сайти</p>
                    
                    <div className="links-list">
                      {links.map((link, index) => (
                        <div key={index} className="link-row">
                          <div className="link-icon"><IconLink /></div>
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className="input link-input"
                          />
                          <button type="button" onClick={() => removeLink(index)} className="remove-btn">
                            <IconX />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {links.length < 4 && (
                      <button type="button" onClick={addLink} className="add-btn">
                        <IconPlus />
                        <span>Додати посилання</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="card-body">
                <div className="form-group">
                  <label className="label">Назва курсу</label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="Наприклад: Основи машинного навчання для бізнесу"
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Опис курсу</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Детальний опис: про що курс, які проблеми вирішує, які навички отримає студент..."
                    className="textarea"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Етап 2: Аудиторія */}
            <section className="card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="step-badge">2</span>
                  <h2 className="card-title">Аудиторія</h2>
                </div>
              </div>

              <div className="card-body">
                <div className="form-group">
                  <label className="label">Цільова аудиторія</label>
                  <textarea
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    placeholder="Опишіть вашу цільову аудиторію: хто вони, який досвід мають, які цілі переслідують... (необов'язково)"
                    className="textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Тон викладання</label>
                  <textarea
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    placeholder="Опишіть бажаний стиль: формальний, дружній, з гумором, надихаючий... (необов'язково)"
                    className="textarea"
                    rows={2}
                  />
                </div>
              </div>
            </section>

            {/* Етап 3: Структура */}
            <section className="card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="step-badge">3</span>
                  <h2 className="card-title">Структура курсу</h2>
                </div>
              </div>

              <div className="card-body">
                <div className="params-grid">
                  <div className="param-item">
                    <label className="label">Кількість модулів</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="modulesCount"
                        value={formData.modulesCount}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className="input input-number"
                      />
                      <span className="input-suffix">модулів</span>
                    </div>
                  </div>

                  <div className="param-item">
                    <label className="label">Лекцій в модулі</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="lessonsPerModule"
                        value={formData.lessonsPerModule}
                        onChange={handleInputChange}
                        min="1"
                        max="15"
                        className="input input-number"
                      />
                      <span className="input-suffix">лекцій</span>
                    </div>
                  </div>

                  <div className="param-item">
                    <label className="label">Тривалість лекції</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="lessonDuration"
                        value={formData.lessonDuration}
                        onChange={handleInputChange}
                        min="5"
                        max="120"
                        className="input input-number"
                      />
                      <span className="input-suffix">хвилин</span>
                    </div>
                  </div>
                </div>

                <div className="summary">
                  <div className="summary-item">
                    <span className="summary-value">{totalLessons}</span>
                    <span className="summary-label">лекцій</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-item">
                    <span className="summary-value">{totalHours}</span>
                    <span className="summary-label">годин</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="submit-section">
              <button
                type="submit"
                disabled={isSubmitting || !formData.topic || !formData.description}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader />
                    <span>Генерація...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles />
                    <span>Згенерувати програму курсу</span>
                  </>
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className="status success">
                  ✓ Запит відправлено! Програма курсу буде згенерована найближчим часом.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="status error">
                  ✗ Помилка відправки. Спробуйте ще раз.
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Powered by AI • Deep Research</p>
      </footer>
    </div>
  );
}
