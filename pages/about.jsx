import Link from 'next/link'
import { GraduationCap, Target, Users, Zap, Globe, Award } from 'lucide-react'

const team = [
  {
    name: 'Erti Beqiri',
    role: 'UI/UX',
    initials: 'EB',
    bio: 'Crafted the visual identity and user experience of EduFlow, ensuring every interaction feels intuitive and polished.',
  },
  {
    name: 'Orges Shala',
    role: 'Auth & Dashboard',
    initials: 'OS',
    bio: 'Built the authentication system and user dashboard, keeping learner data secure and accessible.',
  },
  {
    name: 'Enis Mamusha',
    role: 'Backend',
    initials: 'EM',
    bio: 'Architected the API layer and database, powering course delivery, enrollments, and all backend logic.',
  },
  {
    name: 'Eriona Kolica',
    role: 'Frontend',
    initials: 'EK',
    bio: 'Developed the public-facing pages and course browsing experience, bringing the platform to life.',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Learn at Your Own Pace',
    desc: 'Access course content anytime, anywhere. No deadlines, no pressure — just learning on your schedule.',
  },
  {
    icon: Award,
    title: 'Expert-Led Courses',
    desc: 'Every course is created by industry professionals with real-world experience in their field.',
  },
  {
    icon: Globe,
    title: 'Wide Range of Topics',
    desc: 'From development and design to business and science — find courses that match your goals.',
  },
  {
    icon: Users,
    title: 'Community of Learners',
    desc: 'Join thousands of students growing their skills and building careers through EduFlow.',
  },
]

export async function getStaticProps() {
  return { props: {}, revalidate: 3600 }
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            About EduFlow
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Learning that moves<br />with you
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            EduFlow is a university project built by four students passionate about making quality
            education accessible to everyone — regardless of location, schedule, or background.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm mb-4">
            <Target className="w-4 h-4" />
            Our Mission
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Empowering learners everywhere
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We believe education should be flexible, affordable, and engaging. EduFlow connects
            curious learners with expert instructors through a platform designed to make the
            experience of online learning feel natural, motivating, and rewarding.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the team</h2>
            <p className="text-gray-500">Four developers, one shared goal.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <span className="inline-block text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full mb-3">
                  {member.role}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EduFlow */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why EduFlow?</h2>
            <p className="text-gray-500">Everything you need to grow, in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Browse our catalog and find the course that fits your goals.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  )
}
