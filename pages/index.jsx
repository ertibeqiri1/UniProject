import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CourseCard from '@/src/components/courses/CourseCard'
import { GraduationCap, BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home({ featuredCourses }) {
  const [counts, setCounts] = useState({ courses: 0, students: 0, categories: 0 })
  const statsRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true)
          const duration = 1500
          const steps = 60
          const interval = duration / steps
          let step = 0
          const timer = setInterval(() => {
            step++
            const progress = step / steps
            setCounts({
              courses:    Math.floor(progress * 500),
              students:   Math.floor(progress * 10000),
              categories: Math.floor(progress * 6),
            })
            if (step >= steps) clearInterval(timer)
          }, interval)
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [animated])

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-4 h-4" />
              Online Learning Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Without
              <span className="text-yellow-300"> Limits</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
              Discover thousands of courses taught by expert instructors.
              Start learning today and advance your career.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/courses" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition shadow-lg">
                Browse Courses <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition border border-white/20">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { icon: BookOpen, value: counts.courses + '+',   label: 'Courses Available' },
              { icon: Users,    value: counts.students.toLocaleString() + '+', label: 'Active Students' },
              { icon: Award,    value: counts.categories + '+', label: 'Categories' },
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Courses</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hand-picked courses to help you get started on your learning journey.
            </p>
          </div>

          {featuredCourses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">No courses available yet.</p>
          )}

          <div className="text-center mt-10">
            <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Start learning in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Courses', desc: 'Explore our library of courses across development, design, business and more.', icon: BookOpen },
              { step: '02', title: 'Enroll for Free', desc: 'Create a free account and enroll in any course instantly.', icon: CheckCircle },
              { step: '03', title: 'Start Learning', desc: 'Follow the curriculum at your own pace and gain new skills.', icon: GraduationCap },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 text-primary-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of students already learning on EduFlow.
          </p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-10 py-4 rounded-lg transition shadow-lg text-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/courses?limit=6`)
    const data = await res.json()
    return {
      props: { featuredCourses: data.courses || [] },
      revalidate: 60,
    }
  } catch {
    return { props: { featuredCourses: [] }, revalidate: 60 }
  }
}
