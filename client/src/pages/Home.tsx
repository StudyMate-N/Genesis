import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  BookOpen, Brain, Flame, GraduationCap, Layers, Lightbulb,
  Zap, Trophy, Star, ChevronRight, Check, ArrowRight,
  Sparkles, Target, Clock, Users, Shield, BarChart3, MessageCircle
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#001F3F' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: '#001F3F' }}>Veritas Academy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => setLocation('/dashboard')} className="text-white font-semibold px-6" style={{ background: '#001F3F' }}>
                Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => window.location.href = getLoginUrl()} className="text-sm font-medium">
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = getLoginUrl()} className="text-white font-semibold px-6" style={{ background: '#001F3F' }}>
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0,31,63,0.03) 0%, rgba(255,215,0,0.05) 50%, rgba(0,31,63,0.02) 100%)' }} />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10" style={{ background: '#FFD700', filter: 'blur(80px)' }} />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full opacity-5" style={{ background: '#001F3F', filter: 'blur(100px)' }} />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(255,215,0,0.15)', color: '#001F3F' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#FFD700' }} />
              AI-Powered Adaptive Learning Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6" style={{ color: '#001F3F' }}>
              Unlocking Your<br />
              <span className="relative">
                True Potential
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Master any exam with personalized study plans, interactive flashcards, AI-powered quizzes, and a gamified experience that makes learning addictive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => isAuthenticated ? setLocation('/dashboard') : window.location.href = getLoginUrl()}
                className="text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: '#001F3F' }}
              >
                Start Learning Free <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-semibold text-lg px-8 py-6 rounded-xl border-2"
                style={{ borderColor: '#001F3F', color: '#001F3F' }}
              >
                See How It Works
              </Button>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {[
                { value: '10K+', label: 'Active Students' },
                { value: '500+', label: 'Study Modules' },
                { value: '95%', label: 'Pass Rate' },
                { value: '4.9/5', label: 'Student Rating' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: '#001F3F' }}>{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" style={{ background: '#F0F0F0' }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(0,31,63,0.08)', color: '#001F3F' }}>
              <Zap className="w-4 h-4" style={{ color: '#FFD700' }} />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#001F3F' }}>
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with proven learning science to deliver results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'Adaptive Learning', desc: 'AI analyzes your performance and adjusts content difficulty in real-time, ensuring optimal challenge at every step.', color: '#001F3F' },
              { icon: MessageCircle, title: 'AI Tutor', desc: 'Get instant explanations, hints, and personalized feedback from our intelligent tutoring system.', color: '#4A90D9' },
              { icon: Trophy, title: 'Gamification', desc: 'Earn XP, level up, maintain streaks, and unlock achievements. Learning has never been this engaging.', color: '#FFD700' },
              { icon: Layers, title: 'Smart Flashcards', desc: 'Spaced repetition algorithm ensures you review cards at the perfect time for maximum retention.', color: '#10B981' },
              { icon: Target, title: 'Interactive Quizzes', desc: 'Timed quizzes with instant feedback, detailed explanations, and performance tracking.', color: '#8B5CF6' },
              { icon: BarChart3, title: 'Progress Analytics', desc: 'Detailed dashboards showing your mastery levels, study time, and exam readiness score.', color: '#F59E0B' },
            ].map(feature => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: `${feature.color}15` }}>
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#001F3F' }}>{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(255,215,0,0.15)', color: '#001F3F' }}>
              <Lightbulb className="w-4 h-4" style={{ color: '#FFD700' }} />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#001F3F' }}>
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and begin your journey to exam success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your free account and tell us about your exam goals.', icon: Users },
              { step: '02', title: 'Choose Courses', desc: 'Browse our catalog and enroll in courses tailored to your exams.', icon: BookOpen },
              { step: '03', title: 'Study Smart', desc: 'Follow your personalized plan with flashcards, quizzes, and guides.', icon: Brain },
              { step: '04', title: 'Ace Your Exam', desc: 'Track your progress, earn achievements, and crush your exam.', icon: Trophy },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                )}
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center relative" style={{ background: '#001F3F' }}>
                  <item.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#FFD700', color: '#001F3F' }}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#001F3F' }}>{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24" style={{ background: '#F0F0F0' }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(0,31,63,0.08)', color: '#001F3F' }}>
              <Star className="w-4 h-4" style={{ color: '#FFD700' }} />
              Pricing Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#001F3F' }}>
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free', price: '$0', period: '/forever', desc: 'Perfect for getting started',
                features: ['3 courses access', 'Basic flashcards', 'Limited quizzes', 'Progress tracking', 'Community support'],
                cta: 'Get Started Free', popular: false, style: { bg: 'bg-white', border: 'border-gray-200' }
              },
              {
                name: 'Pro', price: '$19', period: '/month', desc: 'Most popular for serious students',
                features: ['All courses access', 'Unlimited flashcards', 'Unlimited quizzes', 'AI-powered study plans', 'Detailed analytics', 'Priority support', 'Achievement badges'],
                cta: 'Start Pro Trial', popular: true, style: { bg: '', border: '' }
              },
              {
                name: 'Premium', price: '$39', period: '/month', desc: 'For maximum exam readiness',
                features: ['Everything in Pro', 'AI Tutor (unlimited)', 'Mock exam generator', '1-on-1 tutoring sessions', 'Custom study plans', 'Exam guarantee', 'Early access to features'],
                cta: 'Go Premium', popular: false, style: { bg: 'bg-white', border: 'border-gray-200' }
              },
            ].map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 relative ${plan.popular ? 'text-white shadow-2xl scale-105' : `${plan.style.bg} border ${plan.style.border} shadow-sm`}`}
                style={plan.popular ? { background: '#001F3F' } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: '#FFD700', color: '#001F3F' }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : ''}`} style={!plan.popular ? { color: '#001F3F' } : {}}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : ''}`} style={!plan.popular ? { color: '#001F3F' } : {}}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 shrink-0" style={{ color: '#FFD700' }} />
                      <span className={plan.popular ? 'text-gray-200' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full font-semibold py-5 rounded-xl"
                  variant={plan.popular ? 'default' : 'outline'}
                  style={plan.popular ? { background: '#FFD700', color: '#001F3F' } : { borderColor: '#001F3F', color: '#001F3F' }}
                  onClick={() => isAuthenticated ? setLocation('/dashboard') : window.location.href = getLoginUrl()}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(255,215,0,0.15)', color: '#001F3F' }}>
              <Star className="w-4 h-4" style={{ color: '#FFD700' }} />
              Student Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#001F3F' }}>
              Loved by Students
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our students have to say about their learning journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Sarah Chen', role: 'Biology Major, Stanford', rating: 5,
                text: 'Veritas Academy completely transformed my study habits. The gamification kept me coming back every day, and I scored in the 95th percentile on my MCAT biology section!',
              },
              {
                name: 'Marcus Johnson', role: 'CS Student, MIT', rating: 5,
                text: 'The flashcard system with spaced repetition is incredible. I went from struggling with data structures to acing my algorithms final. The XP system made studying feel like a game.',
              },
              {
                name: 'Emily Rodriguez', role: 'Pre-Med, Johns Hopkins', rating: 5,
                text: 'The personalized study plans saved me so much time. Instead of guessing what to study, the AI knew exactly where I needed to focus. Best investment in my education.',
              },
            ].map(testimonial => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#FFD700' }} />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#001F3F' }}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#001F3F' }}>{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#001F3F' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full opacity-10" style={{ background: '#FFD700', filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full opacity-10" style={{ background: '#FFD700', filter: 'blur(60px)' }} />
        </div>
        <div className="container relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Unlock Your Potential?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of students who are already studying smarter, not harder. Start your free account today.
          </p>
          <Button
            size="lg"
            className="font-bold text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: '#FFD700', color: '#001F3F' }}
            onClick={() => isAuthenticated ? setLocation('/dashboard') : window.location.href = getLoginUrl()}
          >
            Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#001F3F' }}>
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: '#001F3F' }}>Veritas Academy</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Unlocking Your True Potential through AI-powered adaptive learning and gamified exam preparation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#001F3F' }}>Platform</h4>
              <ul className="space-y-2">
                {['Courses', 'Flashcards', 'Quizzes', 'Study Plans', 'AI Tutor'].map(item => (
                  <li key={item}><span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#001F3F' }}>Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map(item => (
                  <li key={item}><span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#001F3F' }}>Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(item => (
                  <li key={item}><span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">&copy; 2026 Veritas Academy. All rights reserved.</p>
            <p className="text-sm text-gray-400 italic">"Unlocking Your True Potential"</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
