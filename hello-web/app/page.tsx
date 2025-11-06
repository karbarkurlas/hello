"use client";
import { useEffect, useState } from "react";

type Post = { id: number; title: string; body: string; user_id: number; category_id?: number };
type Category = { id: number; name: string };

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_BASE;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const mustHaveAPI = () => {
    if (!API) throw new Error("NEXT_PUBLIC_API_BASE is not set");
  };

  const loadPosts = async () => {
    setError("");
    try {
      mustHaveAPI();
      const r = await fetch(`${API}/posts`, { cache: "no-store" });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`GET /posts ${r.status}: ${text.slice(0, 200)}`);
      }
      setPosts(await r.json());
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  const loadCategories = async () => {
    setError("");
    try {
      mustHaveAPI();
      const r = await fetch(`${API}/categories`, { cache: "no-store" });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`GET /categories ${r.status}: ${text.slice(0, 200)}`);
      }
      const cats: Category[] = await r.json();
      setCategories(cats);
      // varsa ilk kategoriyi otomatik seç
      if (cats.length > 0 && categoryId === "") setCategoryId(cats[0].id);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  useEffect(() => {
    loadPosts();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureUser = async () => {
    mustHaveAPI();
    if (userId) return userId;
    const r = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { name, email } }),
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`POST /users ${r.status}: ${text.slice(0, 200)}`);
    }
    const j = await r.json();
    setUserId(j.id);
    return j.id as number;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      mustHaveAPI();
      if (categoryId === "") throw new Error("Please select a category.");
      const uid = await ensureUser();
      const r = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: { user_id: uid, title, body, category_id: Number(categoryId) },
        }),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`POST /posts ${r.status}: ${text.slice(0, 200)}`);
      }
      setTitle("");
      setBody("");
      await loadPosts();
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
      {!API && (
        <div style={{ background: "#fee", border: "1px solid #f99", padding: 8, marginBottom: 12 }}>
          <strong>Config error:</strong> NEXT_PUBLIC_API_BASE is not set. Create <code>.env.local</code> with
          <code> NEXT_PUBLIC_API_BASE=http://127.0.0.1:3000 </code> and restart <code>npm run dev</code>.
        </div>
      )}

      {error && (
        <div style={{ background: "#ffe", border: "1px solid #cc0", padding: 8, marginBottom: 12, whiteSpace: "pre-wrap" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h1>Hello — Create Post</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} required />

        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Select category
          </option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit">Save Post</button>
      </form>

      <h2 style={{ marginTop: 24 }}>Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.body}
            {p.category_id ? <em style={{ opacity: 0.7 }}> (cat #{p.category_id})</em> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
