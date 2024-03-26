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
        .then(({ data, error }) => {
          if (error) {
            console.error("Chyba při načítání nákupních seznamů:", error.message);
          }
          setShoppingLists(data || []);
        });
    };

    fetchShoppingLists();
  }, []);

  const deleteShoppingList = (id: number) => {
    supabase
      .from("shopping_list")
      .delete()
      .eq("id", id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Chyba při mazání nákupního seznamu:", error.message);
        }

        setShoppingLists(shoppingLists.filter((list) => list.id !== id));
      })
  };

  return (
    <div className="custom-layout">
      <Header />
      <div className="content-container">
        <h2>Nákupní seznamy</h2>
        <Link href="/create-shopping-list">
          <button className="create-new">Vytvořit nový</button>
        </Link>
        <hr className="hr-custom"></hr>
        <ul>
          {shoppingLists.map((list) => (
            <li key={list.id} className="list">
              <div className="list-info">
                <Link href={`/shopping-list-items/${list.id}`}>{list.name}</Link>
              </div>
              <div className="button-container">
                <Link href={`/edit-shopping-list/${list.id}`}>
                  <button className="list-buttons">Upravit</button>
                </Link>
                <button
                  className="delete-name"
                  onClick={() => deleteShoppingList(list.id)}
                >
                  Smazat
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}

export default IndexPage;
