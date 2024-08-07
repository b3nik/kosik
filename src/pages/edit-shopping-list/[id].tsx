import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../pages/api/supabase';
import Header from '@/components/Header';
import Link from 'next/link';

const EditShoppingList: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listName, setListName] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Fetch seznamu pro zobrazení aktuálního jména
      supabase
        .from('shopping_list')
        .select('name')
        .eq('id', id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching shopping list:', error.message);
          }
          if (data && data.length > 0) {
            setListName(data[0].name);
          }
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

      const {error} = await supabase
        .from('shopping_list')
        .update({ name: listName })
        .eq('id', id);
      
     if (error) {
      console.error('Error updating shopping list name:', error.message);
      return;
    }
    console.log('Název seznamu byl aktualizován:', listName);
      router.push('/');
  };

  const handleDelete = async () => {
    if (!id) return;

      const {error} = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting shopping list:', error.message);
        return;
      }
      console.log('Seznam byl smazán');
      router.push('/');
  };

  return (
    <div className="custom-layout">
      <Header />
      <div>
        <h2>Edit ToDo</h2>
        <form onSubmit={handleSubmit}>
            <input placeholder="New name" type="text" value={listName} onChange={(e) => setListName(e.target.value)} />
            <button type="submit">Edit</button>
        <button className="delete-item" onClick={handleDelete}>Delete</button>
        </form>
      </div>
      <div>
        <nav>
          <Link className="edit-todo" href='/'>ToDo</Link> {'>'} <span>Editing</span>
        </nav>
      </div>
    </div>
  );
};

export default EditShoppingList;
