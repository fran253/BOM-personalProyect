// Utilidades para manejar el almacenamiento local
const STORAGE_KEY = 'vlog_entries';

export const getEntries = () => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error al leer entradas:', error);
    return [];
  }
};

export const saveEntries = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Error al guardar entradas:', error);
    return false;
  }
};

export const addEntry = (entry) => {
  const entries = getEntries();
  const newEntry = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...entry
  };
  entries.unshift(newEntry);
  saveEntries(entries);
  return newEntry;
};

export const updateEntry = (id, updatedData) => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);
  
  if (index !== -1) {
    entries[index] = {
      ...entries[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    saveEntries(entries);
    return entries[index];
  }
  return null;
};

export const deleteEntry = (id) => {
  const entries = getEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  saveEntries(filteredEntries);
  return true;
};

export const getEntryById = (id) => {
  const entries = getEntries();
  return entries.find(entry => entry.id === id);
};