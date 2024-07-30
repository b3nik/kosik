import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Link from "next/link";
import { supabase } from "../pages/api/supabase";

const CreateShoppingListPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    supabase
      .from("shopping_list")
      .insert([{ name }])
      .then(({ data, error }) => {
        if (error) {
            console.error("Chyba při vytváření nákupního seznamu:", error.message)
        }
        console.log("Vytvořený seznam");
        router.push("/");
      });
  };

  return (
    <div className="custom-layout">
      <Header />
      <div>
        <h2>Create new ToDo</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="ToDo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </div>
      <div>
        <nav>
          <Link href="/" className="nav-link">
            All ToDo's
          </Link>{" "}
          {">"} <span>Create a new ToDo</span>
        </nav>
      </div>
    </div>
  );
};

export default CreateShoppingListPage;
