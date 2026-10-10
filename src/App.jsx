import { useState } from 'react'
import { announcements, discussions as seed, timetable } from './data.js'

const pages = ['Feed', 'Discussions', 'Announcements', 'Timetable', 'Profile']

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const submit = () => {
    if (!email.trim().toLowerCase().endsWith('@nsut.ac.in')) {
      setError('Use your college email ending in @nsut.ac.in.')
      return
    }
    onLogin(email.trim())
  }
  return (
    <main className="login">
      <h1>NSUT Connect</h1>
      <p>Discussions, announcements and your timetable in one place.</p>
      <input placeholder="you@nsut.ac.in" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} />
      {error && <p className="error">{error}</p>}
      <button onClick={submit}>Continue with college email</button>
    </main>
  )
}

function Feed({ go }) {
  return (
    <>
      <h2>Feed</h2>
      <h3>Latest announcements</h3>
      {announcements.slice(0, 2).map((a) => (
        <article className="card" key={a.id}><span className="tag">{a.tag}</span><h4>{a.title}</h4><p>{a.body}</p><small>{a.by} · {a.date}</small></article>
      ))}
      <h3>Trending discussions</h3>
      {seed.slice(0, 2).map((d) => (
        <article className="card" key={d.id}><h4>{d.title}</h4><small>{d.author} ({d.branch}) · {d.replies} replies · {d.time}</small></article>
      ))}
      <button className="ghost" onClick={() => go('Discussions')}>See all discussions</button>
    </>
  )
}

function Discussions() {
  const [list, setList] = useState(seed)
  const [text, setText] = useState('')
  const add = () => {
    if (!text.trim()) return
    setList([{ id: Date.now(), title: text.trim(), author: 'You', branch: '', replies: 0, time: 'just now' }, ...list])
    setText('')
  }
  return (
    <>
      <h2>Discussions</h2>
      <div className="row">
        <input placeholder="Start a discussion" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={add}>Post</button>
      </div>
      {list.map((d) => (
        <article className="card" key={d.id}><h4>{d.title}</h4><small>{d.author}{d.branch && ` (${d.branch})`} · {d.replies} replies · {d.time}</small></article>
      ))}
    </>
  )
}

function Announcements() {
  const [filter, setFilter] = useState('All')
  const tags = ['All', ...new Set(announcements.map((a) => a.tag))]
  return (
    <>
      <h2>Announcements</h2>
      <div className="chips">{tags.map((t) => <button key={t} className={t === filter ? 'chip on' : 'chip'} onClick={() => setFilter(t)}>{t}</button>)}</div>
      {announcements.filter((a) => filter === 'All' || a.tag === filter).map((a) => (
        <article className="card" key={a.id}><span className="tag">{a.tag}</span><h4>{a.title}</h4><p>{a.body}</p><small>{a.by} · {a.date}</small></article>
      ))}
    </>
  )
}

function Timetable() {
  const days = Object.keys(timetable)
  const [day, setDay] = useState(days[0])
  return (
    <>
      <h2>Timetable</h2>
      <div className="chips">{days.map((d) => <button key={d} className={d === day ? 'chip on' : 'chip'} onClick={() => setDay(d)}>{d}</button>)}</div>
      {timetable[day].map(([time, subject, room]) => (
        <article className="card slot" key={time}><b>{time}</b><div><h4>{subject}</h4><small>{room}</small></div></article>
      ))}
    </>
  )
}

function Profile({ email, onLogout }) {
  const name = email.split('@')[0]
  return (
    <>
      <h2>Profile</h2>
      <article className="card">
        <h4>{name}</h4>
        <p>{email}</p>
        <small>Role: Student · Semester 1</small>
      </article>
      <button className="ghost" onClick={onLogout}>Log out</button>
    </>
  )
}

export default function App() {
  const [email, setEmail] = useState(null)
  const [page, setPage] = useState('Feed')
  if (!email) return <Login onLogin={setEmail} />
  return (
    <div className="shell">
      <nav>
        <b className="brand">NSUT Connect</b>
        {pages.map((p) => <button key={p} className={p === page ? 'nav on' : 'nav'} onClick={() => setPage(p)}>{p}</button>)}
      </nav>
      <main className="content">
        {page === 'Feed' && <Feed go={setPage} />}
        {page === 'Discussions' && <Discussions />}
        {page === 'Announcements' && <Announcements />}
        {page === 'Timetable' && <Timetable />}
        {page === 'Profile' && <Profile email={email} onLogout={() => setEmail(null)} />}
      </main>
    </div>
  )
}
