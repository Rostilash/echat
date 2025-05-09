export const deleteItemById = ({ items, idToDelete, setItems, setDeletingIds, storageKey, onFinish, delay = 500 }) => {
  if (!idToDelete) return;

  setDeletingIds((prev) => [...prev, idToDelete]);

  setTimeout(() => {
    const updated = items.filter((item) => item.id !== idToDelete);
    setItems(updated);
    setDeletingIds((prev) => prev.filter((id) => id !== idToDelete));
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    if (onFinish) onFinish(); // for closing a modal or other
  }, delay);
};
