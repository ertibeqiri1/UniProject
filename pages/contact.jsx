import { useState } from 'react'
import { Mail, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | { error: string }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ error: data.message || 'Something went wrong. Please try again.' })
      }
    } catch {
      setStatus({ error: 'Network error. Please check your connection and try again.' })
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in touch</h1>
        <p className="text-gray-500 text-lg">Have a question or feedback? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email us</h3>
            <p className="text-sm text-gray-500 mb-2">Send us an email anytime.</p>
            <a
              href="mailto:contact@eduflow.com"
              className="text-primary-600 font-medium text-sm hover:underline"
            >
              contact@eduflow.com
            </a>
          </div>

          <div className="card p-6">
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Response time</h3>
            <p className="text-sm text-gray-500">
              We reply within <span className="font-semibold text-gray-700">24 hours</span> on weekdays.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-gray-500 mb-6">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="btn-secondary"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status?.error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {status.error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here…"
                  required
                  rows={5}
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
