import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/pages/api/supabase";
import Header from "@/components/Header";
import Link from "next/link";

interface Item {
  id: number;
  name: string;
  shopping_list_id: number;
}

const ShoppingListDetailPage: React.FC = () => {
  const router = useRouter();
  const {id} = router.query;
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchItems = async () => {
      const {data: items, error} = await supabase
        .from("items")
        .select("*")
        .eq("shopping_list_id", id);

      if (error) {
        console.error("Error fetching items:", error.message)
      }

      setItems(items || []);
    }

    fetchItems();
  }, [id]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newItem.trim()) return;

    supabase
      .from("items")
      .insert({name: newItem, shopping_list_id: parseInt(id as string)})
      .select()
      .then(({data, error}) => {
        if (error) {
          console.error("Error adding item:", error.message);
          return;
        }

        setItems([...items, data![0]]);
        setNewItem("");
      });
  };

  const handleRemoveItem = (itemId: number) => {
    supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .then(({error}) => {
        if (error) {
          console.error("Error deleting item:", error.message)
        }

        setItems(items.filter((item) => item.id !== itemId));
      });
  };

  return (
    <div className="custom-layout">
      <Header/>
      <div>
        <h2>Položky seznamu</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name}
              <button className="delete-item-x" onClick={() => handleRemoveItem(item.id)}>X</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Nová položka"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit">Přidat</button>
        </form>
      </div>
      <div>
        <nav>
          <Link href="/" className="nav-link">
            Nákupní seznamy
          </Link>{" "}
          {">"} <span>Položky seznamu</span>
        </nav>
      </div>
    </div>
  );
};

export default ShoppingListDetailPage;
