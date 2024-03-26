import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { supabase } from "../pages/api/supabase";

function IndexPage() {
  const [shoppingLists, setShoppingLists] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchShoppingLists = () => {
      supabase
        .from("shopping_list")
        .select("*")
        .then(({ data }) => {
          setShoppingLists(data || []);
        })
        .catch((error) => {
          console.error("Chyba při načítání nákupních seznamů:", error.message);
        });
    };

    fetchShoppingLists();
  }, []);

  const deleteShoppingList = (id: number) => {
    supabase
      .from("shopping_list")
      .delete()
      .eq("id", id)
      .then(() => {
        setShoppingLists(shoppingLists.filter((list) => list.id !== id));
      })
      .catch((error) => {
        console.error("Chyba při mazání nákupního seznamu:", error.message);
      });
  };

  return (
    <div className="custom-layout">
      <Header />
      <div>
        <h2>Nákupní seznamy</h2>
        <Link href="/create-shopping-list">
          <button>Vytvořit nový</button>
        </Link>
        <ul>
          {shoppingLists.map((list) => (
            <li key={list.id}>
              <Link href={`/shopping-list-item/${list.id}`}>{list.name}</Link>
              <Link href={`/edit-shopping-list/${list.id}`}>
                <button>Upravit</button>
              </Link>
              <button onClick={() => deleteShoppingList(list.id)}>
                Smazat
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IndexPage;
