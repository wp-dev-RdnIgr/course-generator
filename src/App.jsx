import { useState, useRef } from 'react';

// Іконки
const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSparkles = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/>
    <path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z"/>
  </svg>
);

const IconLoader = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

// Конфігурація
const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL'; // Замінити на реальний URL

const AUDIENCE_OPTIONS = [
  { value: 'beginners', label: 'Новачки', desc: 'Без попереднього досвіду' },
  { value: 'intermediate', label: 'Середній рівень', desc: 'Базові знання є' },
  { value: 'advanced', label: 'Просунуті', desc: 'Глибокі знання теми' },
  { value: 'professionals', label: 'Професіонали', desc: 'Експерти галузі' },
  { value: 'management', label: 'Топ-менеджмент', desc: 'Керівники та CEO' },
  { value: 'children', label: 'Діти та підлітки', desc: 'До 18 років' },
];

const TONE_OPTIONS = [
  { value: 'formal', label: 'Формальний', emoji: '👔' },
  { value: 'friendly', label: 'Дружній', emoji: '😊' },
  { value: 'humorous', label: 'З гумором', emoji: '😄' },
  { value: 'inspirational', label: 'Надихаючий', emoji: '🚀' },
  { value: 'academic', label: 'Академічний', emoji: '🎓' },
];

export default function App() {
  // Стани форми
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    audience: '',
    tone: 'friendly',
    courseDuration: '4',
    sectionsCount: '4',
    lessonsPerSection: '4',
    lessonDuration: '15',
  });
  
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const fileInputRef = useRef(null);

  // Обробники
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
      // Формуємо дані
      const submitData = new FormData();
      
      // Текстові дані
      submitData.append('data', JSON.stringify({
        ...formData,
        links: links.filter(l => l.trim() !== ''),
        timestamp: new Date().toISOString(),
      }));
      
      // Файли
      files.forEach((file, index) => {
        submitData.append(`file_${index}`, file);
      });

      // Відправка на webhook
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

  return (
    <div className="app">
      {/* Фоновий ефект */}
      <div className="background-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Хедер */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <IconSparkles />
          </div>
          <span className="logo-text">CourseAI</span>
        </div>
        <div className="header-badge">Deep Research</div>
      </header>

      {/* Головний контент */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="title-gradient">Генератор</span>
            <br />
            навчальних курсів
          </h1>
          <p className="hero-subtitle">
            Створіть професійну програму курсу за допомогою штучного інтелекту
          </p>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {/* Секція 1: Основна інформація */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">Тема курсу</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">Назва курсу</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Наприклад: Основи машинного навчання для бізнесу"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Опис курсу</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Детальний опис того, про що буде курс, які проблеми вирішує, які навички отримає студент..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>
          </section>

          {/* Секція 2: Аудиторія та тон */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">Аудиторія</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Цільова аудиторія</label>
              <div className="audience-grid">
                {AUDIENCE_OPTIONS.map(option => (
                  <label
                    key={option.value}
                    className={`audience-card ${formData.audience === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={option.value}
                      checked={formData.audience === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="audience-label">{option.label}</span>
                    <span className="audience-desc">{option.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Тон викладання</label>
              <div className="tone-grid">
                {TONE_OPTIONS.map(option => (
                  <label
                    key={option.value}
                    className={`tone-card ${formData.tone === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={formData.tone === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="tone-emoji">{option.emoji}</span>
                    <span className="tone-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Секція 3: Структура */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">Структура курсу</h2>
            </div>

            <div className="params-grid">
              <div className="form-group">
                <label className="form-label">Тривалість курсу</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    name="courseDuration"
                    value={formData.courseDuration}
                    onChange={handleInputChange}
                    min="1"
                    max="52"
                    className="form-input"
                  />
                  <span className="input-suffix">тижнів</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Кількість секцій</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    name="sectionsCount"
                    value={formData.sectionsCount}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="form-input"
                  />
                  <span className="input-suffix">секцій</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Уроків в секції</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    name="lessonsPerSection"
                    value={formData.lessonsPerSection}
                    onChange={handleInputChange}
                    min="1"
                    max="15"
                    className="form-input"
                  />
                  <span className="input-suffix">уроків</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Тривалість уроку</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    name="lessonDuration"
                    value={formData.lessonDuration}
                    onChange={handleInputChange}
                    min="5"
                    max="120"
                    className="form-input"
                  />
                  <span className="input-suffix">хвилин</span>
                </div>
              </div>
            </div>

            <div className="structure-preview">
              <div className="preview-label">Прогноз:</div>
              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="stat-value">
                    {formData.sectionsCount * formData.lessonsPerSection}
                  </span>
                  <span className="stat-label">уроків</span>
                </div>
                <div className="preview-divider"></div>
                <div className="preview-stat">
                  <span className="stat-value">
                    {Math.round(formData.sectionsCount * formData.lessonsPerSection * formData.lessonDuration / 60)}
                  </span>
                  <span className="stat-label">годин</span>
                </div>
              </div>
            </div>
          </section>

          {/* Секція 4: База знань */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">База знань</h2>
              <span className="section-hint">Опціонально</span>
            </div>

            {/* Завантаження файлів */}
            <div className="form-group">
              <label className="form-label">Файли для аналізу</label>
              <p className="form-hint">PDF, DOCX, TXT — книги, статті, регламенти (макс. 4 файли)</p>
              
              <div
                className="file-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
                <div className="dropzone-icon">
                  <IconUpload />
                </div>
                <p className="dropzone-text">
                  Натисніть для вибору файлів
                </p>
                <p className="dropzone-hint">
                  {files.length}/4 файлів завантажено
                </p>
              </div>

              {files.length > 0 && (
                <div className="files-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        <IconFile />
                      </div>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="file-remove"
                      >
                        <IconX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Посилання */}
            <div className="form-group">
              <label className="form-label">Корисні посилання</label>
              <p className="form-hint">Сайти конкурентів, вікі-статті, документація</p>
              
              <div className="links-list">
                {links.map((link, index) => (
                  <div key={index} className="link-input-row">
                    <div className="link-icon">
                      <IconLink />
                    </div>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com/article"
                      className="form-input link-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="link-remove"
                    >
                      <IconX />
                    </button>
                  </div>
                ))}
              </div>
              
              {links.length < 4 && (
                <button
                  type="button"
                  onClick={addLink}
                  className="add-link-btn"
                >
                  <IconPlus />
                  <span>Додати посилання</span>
                </button>
              )}
            </div>
          </section>

          {/* Кнопка відправки */}
          <div className="submit-section">
            <button
              type="submit"
              disabled={isSubmitting || !formData.topic || !formData.description || !formData.audience}
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
              <div className="status-message success">
                ✓ Запит відправлено! Програма курсу буде згенерована найближчим часом.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="status-message error">
                ✗ Помилка відправки. Спробуйте ще раз.
              </div>
            )}
          </div>
        </form>
      </main>

      {/* Футер */}
      <footer className="footer">
        <p>Powered by AI • Deep Research Technology</p>
      </footer>
    </div>
  );
}
