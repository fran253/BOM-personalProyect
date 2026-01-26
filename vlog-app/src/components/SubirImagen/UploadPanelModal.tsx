import { useState, useEffect, ChangeEvent, DragEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImageToS3, compressImage } from '../../utils/s3';
import { useAuth } from '../../contexts/AuthContext';
import type { Categoria } from '../../lib/supabase';
import './UploadPanelModal.css';

interface UploadPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UploadPanelModal = ({ isOpen, onClose, onSuccess }: UploadPanelModalProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Cargar categorías
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('orden_visualizacion', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede superar 10MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Generar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !title || !categoryId) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!user) {
      setError('Debes estar autenticado');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Comprimir imagen
      console.log('Comprimiendo imagen...');
      const compressedImage = await compressImage(imageFile);

      // 2. Subir a S3
      console.log('Subiendo a S3...');
      const imageUrl = await uploadImageToS3(compressedImage, `panels/${categoryId}`);

      // 3. Guardar en Supabase
      console.log('Guardando en base de datos...');
      const { error: dbError } = await supabase
        .from('paneles_manga')
        .insert({
          titulo: title,
          descripcion: description || null,
          imagen_url: imageUrl,
          categoria_id: categoryId,
          creado_por: user.id,
          cantidad_likes: 0,
          es_destacado: false,
          estado: 'aprobado'
        });

      if (dbError) throw dbError;

      // Éxito
      console.log('Panel subido correctamente!');
      resetForm();
      onSuccess?.();
      onClose();
      
    } catch (err) {
      console.error('Error uploading panel:', err);
      setError(err instanceof Error ? err.message : 'Error al subir el panel');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Panel de Manga</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={loading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Selector de Categoría */}
          <div className="form-group">
            <label htmlFor="category">
              Categoría <span className="required">*</span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="form-group">
            <label htmlFor="title">
              Título <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: La verdadera fuerza..."
              maxLength={200}
              required
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción (opcional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Autor, contexto, o cualquier información adicional..."
              rows={3}
              maxLength={500}
              disabled={loading}
            />
          </div>

          {/* Upload de Imagen */}
          <div className="form-group">
            <label>
              Imagen <span className="required">*</span>
            </label>
            
            {!imagePreview ? (
              <div
                className={`image-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="image-input"
                  disabled={loading}
                />
                <label htmlFor="imageFile" className="image-upload-label">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="upload-text">
                    <strong>Haz clic para seleccionar</strong> o arrastra una imagen aquí
                  </p>
                  <p className="upload-hint">PNG, JPG, WEBP (máx. 10MB)</p>
                </label>
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Cambiar imagen
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Botones de acción */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !imageFile || !title || !categoryId}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Subiendo...
                </>
              ) : (
                'Publicar Panel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPanelModal;