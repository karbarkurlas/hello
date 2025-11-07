"use client";
import { useEffect, useMemo, useState } from "react";

type Post = { id: number; title: string; body: string; user_id: number };
type User = { id: number; name: string; email: string };
type Team = { id: number; name: string };
type Shift = { id: number; date: string; start_time: string; end_time: string; team_id: number };
type Assignment = { id: number; user_id: number; shift_id: number };
type Leave = { id: number; user_id: number; date: string; start_time: string; end_time: string; reason: string; status: string };

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  // Shared
  const [error, setError] = useState("");

  // Posts
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Other models
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  // Forms
  const [teamName, setTeamName] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [shiftTeamId, setShiftTeamId] = useState<number | "">("");

  const [asUserId, setAsUserId] = useState<number | "">("");
  const [asShiftId, setAsShiftId] = useState<number | "">("");

  const [leaveUserId, setLeaveUserId] = useState<number | "">("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("pending");

  function hhmm(v: string) {
    const m = String(v).match(/(\d{2}):(\d{2})/);
    return m ? m[0] : v;
  }

  const usersById = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);
  const teamsById = useMemo(() => Object.fromEntries(teams.map(t => [t.id, t])), [teams]);

  async function fetchJSON(url: string, init?: RequestInit) {
    setError("");
    if (!API) throw new Error("NEXT_PUBLIC_API_BASE is not set");
    const r = await fetch(url, init);
    if (!r.ok) throw new Error(`${init?.method || 'GET'} ${url} ${r.status}`);
    return r.json();
  }

  async function loadPosts() { try { setPosts(await fetchJSON(`${API}/posts`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadUsers() { try { setUsers(await fetchJSON(`${API}/users`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadTeams() { try { setTeams(await fetchJSON(`${API}/teams`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadShifts() { try { setShifts(await fetchJSON(`${API}/shifts`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadAssignments() { try { setAssignments(await fetchJSON(`${API}/assignments`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadLeaves() { try { setLeaves(await fetchJSON(`${API}/leaves`)); } catch (e: any) { setError(e.message || String(e)); } }
  async function loadAll() { await Promise.all([loadUsers(), loadTeams(), loadShifts(), loadAssignments(), loadLeaves(), loadPosts()]); }
  useEffect(() => { loadAll(); }, []);

  async function ensureUser() {
    if (userId) return userId;
    const j = await fetchJSON(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { name, email } }),
    });
    setUserId(j.id);
    await loadUsers();
    return j.id as number;
  }

  async function onSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    try {
      const uid = await ensureUser();
      await fetchJSON(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: { user_id: uid, title, body } }),
      });
      setTitle(""); setBody("");
      await loadPosts();
    } catch (e: any) { setError(e.message || String(e)); }
  }

  async function onCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetchJSON(`${API}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: { name: teamName } }),
      });
      setTeamName("");
      await loadTeams();
    } catch (e: any) { setError(e.message || String(e)); }
  }

  async function onCreateShift(e: React.FormEvent) {
    e.preventDefault();
    if (!shiftTeamId) { setError("Select a team for the shift"); return; }
    try {
      await fetchJSON(`${API}/shifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shift: { date: shiftDate, start_time: shiftStart, end_time: shiftEnd, team_id: shiftTeamId } }),
      });
      setShiftDate(""); setShiftStart(""); setShiftEnd(""); setShiftTeamId("");
      await loadShifts();
    } catch (e: any) { setError(e.message || String(e)); }
  }

  async function onSubmitAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!asUserId || !asShiftId) { setError("Select user and shift"); return; }
    try {
      const r = await fetch(`${API}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment: { user_id: asUserId, shift_id: asShiftId } }),
      });
      if (!r.ok && r.status !== 422) throw new Error(`POST /assignments ${r.status}`);
      setAsUserId(""); setAsShiftId("");
      await loadAssignments();
    } catch (e: any) { setError(e.message || String(e)); }
  }

  async function onCreateLeave(e: React.FormEvent) {
    e.preventDefault();
    if (!leaveUserId) { setError("Select a user for leave"); return; }
    try {
      await fetchJSON(`${API}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leave: { user_id: leaveUserId, date: leaveDate, start_time: leaveStart, end_time: leaveEnd, reason: leaveReason, status: leaveStatus } }),
      });
      setLeaveReason(""); setLeaveDate(""); setLeaveStart(""); setLeaveEnd(""); setLeaveStatus("pending"); setLeaveUserId("");
      await loadLeaves();
    } catch (e: any) { setError(e.message || String(e)); }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      {error && (
        <div style={{ background: "#ffe", border: "1px solid #cc0", padding: 8, marginBottom: 12, whiteSpace: "pre-wrap" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Posts */}
      <section>
        <h1>Hello – Create Post</h1>
        <form onSubmit={onSubmitPost} style={{ display: "grid", gap: 8 }}>
          <input data-cy="nameInput"  placeholder="Name"  value={name}  onChange={(e)=>setName(e.target.value)} required/>
          <input data-cy="emailInput" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
          <input data-cy="titleInput" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
          <textarea data-cy="bodyInput" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)} required/>
          <button data-cy="savePostBtn" type="submit">Save Post</button>
        </form>
        <h2 style={{ marginTop: 24 }}>Posts</h2>
        <ul data-cy="postsList">
          {posts.map(p => (
            <li key={p.id}><strong>{p.title}</strong> – {p.body}</li>
          ))}
        </ul>
      </section>

      {/* Teams */}
      <section style={{ marginTop: 32 }}>
        <h2>Teams</h2>
        <form onSubmit={onCreateTeam} style={{ display: "flex", gap: 8 }}>
          <input data-cy="teamNameInput" placeholder="Team name" value={teamName} onChange={(e)=>setTeamName(e.target.value)} />
          <button type="submit">Create Team</button>
        </form>
        <ul data-cy="teamsList">
          {teams.map(t => (<li key={t.id}>{t.name}</li>))}
        </ul>
      </section>

      {/* Shifts */}
      <section style={{ marginTop: 32 }}>
        <h2>Shifts</h2>
        <form onSubmit={onCreateShift} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(5, minmax(0,1fr))"}}>
          <input data-cy="shiftDateInput" type="date" value={shiftDate} onChange={(e)=>setShiftDate(e.target.value)} />
          <input data-cy="shiftStartInput" type="time" value={shiftStart} onChange={(e)=>setShiftStart(e.target.value)} />
          <input data-cy="shiftEndInput" type="time" value={shiftEnd} onChange={(e)=>setShiftEnd(e.target.value)} />
          <select data-cy="shiftTeamSelect" value={shiftTeamId as any} onChange={(e)=>setShiftTeamId(e.target.value ? Number(e.target.value) : "") }>
            <option value="">Select team</option>
            {teams.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
          <button type="submit">Create Shift</button>
        </form>
        <ul data-cy="shiftsList">
          {shifts.map(s => (
            <li key={s.id}>{s.date} {hhmm(s.start_time)}-{hhmm(s.end_time)} ({teamsById[s.team_id]?.name || `Team #${s.team_id}`})</li>
          ))}
        </ul>
      </section>

      {/* Assignments */}
      <section style={{ marginTop: 32 }}>
        <h2>Assignments</h2>
        <form onSubmit={onSubmitAssignment} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, minmax(0,1fr))"}}>
          <select data-cy="assignmentUserSelect" value={asUserId as any} onChange={(e)=>setAsUserId(e.target.value ? Number(e.target.value) : "") }>
            <option value="">Select user</option>
            {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
          <select data-cy="assignmentShiftSelect" value={asShiftId as any} onChange={(e)=>setAsShiftId(e.target.value ? Number(e.target.value) : "") }>
            <option value="">Select shift</option>
            {shifts.map(s => (<option key={s.id} value={s.id}>{s.date} {hhmm(s.start_time)}-{hhmm(s.end_time)}</option>))}
          </select>
          <button type="submit">Submit Assignment</button>
        </form>
        <ul data-cy="assignmentsList">
          {assignments.map(a => {
            const s = shifts.find(sh => sh.id === a.shift_id);
            const u = usersById[a.user_id];
            return (
              <li key={a.id}>{u?.name || `User #${a.user_id}`} – {s ? `${s.date} ${hhmm(s.start_time)}-${hhmm(s.end_time)}` : `Shift #${a.shift_id}`}</li>
            );
          })}
        </ul>
      </section>

      {/* Leaves */}
      <section style={{ marginTop: 32 }}>
        <h2>Leaves</h2>
        <form onSubmit={onCreateLeave} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(7, minmax(0,1fr))"}}>
          <select data-cy="leaveUserSelect" value={leaveUserId as any} onChange={(e)=>setLeaveUserId(e.target.value ? Number(e.target.value) : "") }>
            <option value=""></option>
            {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
          <input data-cy="leaveDateInput" type="date" value={leaveDate} onChange={(e)=>setLeaveDate(e.target.value)} />
          <input data-cy="leaveStartInput" type="time" value={leaveStart} onChange={(e)=>setLeaveStart(e.target.value)} />
          <input data-cy="leaveEndInput" type="time" value={leaveEnd} onChange={(e)=>setLeaveEnd(e.target.value)} />
          <input data-cy="leaveReasonInput" placeholder="Reason" value={leaveReason} onChange={(e)=>setLeaveReason(e.target.value)} />
          <select data-cy="leaveStatusSelect" value={leaveStatus} onChange={(e)=>setLeaveStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
          <button type="submit">Create Leave</button>
        </form>
        <ul data-cy="leavesList">
          {leaves.map(l => {
            const u = usersById[l.user_id];
            return (
              <li key={l.id}>{u?.name || `User #${l.user_id}`} – [{l.status}] {l.date} {hhmm(l.start_time)}-{hhmm(l.end_time)} {l.reason && `– ${l.reason}`}</li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

