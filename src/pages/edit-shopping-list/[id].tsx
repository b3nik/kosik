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

    try {
      await supabase
        .from('shopping_list')
        .update({ name: listName })
        .eq('id', id);
      console.log('Název seznamu byl aktualizován:', listName);
      router.push('/');
    } catch (error) {
      console.error('Error updating shopping list name:', error.message);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);
      console.log('Seznam byl smazán');
      router.push('/');
    } catch (error) {
      console.error('Error deleting shopping list:', error.message);
    }
  };

  return (
    <div className="custom-layout">
      <Header />
      <div>
        <h2>Upravit nákupní seznam</h2>
        <form onSubmit={handleSubmit}>
            <input placeholder="Nový název" type="text" value={listName} onChange={(e) => setListName(e.target.value)} />
            <button type="submit">Upravit</button>
        <button className="delete-item" onClick={handleDelete}>Smazat</button>
        </form>
      </div>
      <div>
        <nav>
          <Link href='/'>Nákupní seznamy</Link> {'>'} <span>Úprava</span>
        </nav>
      </div>
    </div>
  );
};

export default EditShoppingList;
