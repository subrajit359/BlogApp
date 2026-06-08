import React, { useState, useEffect } from 'react'

function timeAgo(dateStr) {
  const secs = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)} hr ago`
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch('/posts')
      if (!res.ok) throw new Error('something went wrong')
      const data = await res.json()
      setPosts(data)
    } catch {
      setFetchError('Could not load posts. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')

    if (!title.trim()) { setFormError('Please enter a title.'); return }
    if (!body.trim()) { setFormError('Post body cannot be empty.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create post')
      setPosts(prev => [data, ...prev])
      setTitle('')
      setBody('')
      setSuccessMsg('Post published!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id, postTitle) {
    if (!window.confirm(`Delete "${postTitle}"? This can't be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 pb-16">

        {/* Header */}
        <header className="text-center py-10 border-b border-slate-200 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Blog Post Manager
          </h1>
          <p className="mt-2 text-slate-500 text-sm">Write, publish and manage your posts</p>
          {!loading && (
            <span className="inline-block mt-3 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          )}
        </header>

        {/* Create Post Form */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4">New Post</h2>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="What's this post about?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={submitting}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white disabled:opacity-50 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600" htmlFor="body">
                Body
              </label>
              <textarea
                id="body"
                rows={4}
                placeholder="Write something interesting..."
                value={body}
                onChange={e => setBody(e.target.value)}
                disabled={submitting}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white disabled:opacity-50 transition resize-y"
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            {successMsg && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                ✓ {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="self-start bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition cursor-pointer"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </section>

        {/* Posts List */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            All Posts{' '}
            {!loading && (
              <span className="text-slate-400 font-normal">({posts.length})</span>
            )}
          </h2>

          {loading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 flex flex-col items-center gap-3 text-slate-400 text-sm">
              <div className="spinner" />
              <p>Loading...</p>
            </div>
          )}

          {!loading && fetchError && (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 flex flex-col items-center gap-3 text-red-500 text-sm">
              <p>{fetchError}</p>
              <button
                onClick={loadPosts}
                className="border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !fetchError && posts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center text-slate-400 text-sm">
              No posts yet — be the first to write one!
            </div>
          )}

          {!loading && !fetchError && posts.length > 0 && (
            <ul className="flex flex-col gap-3">
              {posts.map(post => (
                <li
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-4 flex items-start justify-between gap-4 hover:shadow-md transition"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 break-words">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed break-words">
                      {post.body}
                    </p>
                    {post.createdAt && (
                      <span className="block mt-2 text-xs text-slate-400">
                        {timeAgo(post.createdAt)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="flex-shrink-0 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50 transition cursor-pointer"
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  )
}
