import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stats, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">{stats.value}</div>
                <div className="text-gray-600">{stats.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center font-extrabold mb-12 text-indigo-700">Everything you need to manage your Finances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((features, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-2xl border border-blue-100 transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="pt-2 space-y-4">
                  <div className="text-indigo-500 text-3xl">{features.icon}</div>
                  <h3 className="text-xl font-semibold text-indigo-800">{features.title}</h3>
                  <p className="text-gray-600">{features.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center p-4 hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 text-2xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center font-extrabold mb-12 text-indigo-700">What our users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonialsData.map((testimonials, index) => (
              <Card key={index} className="p-6 shadow-lg border border-indigo-100 transition-all duration-300 bg-white hover:shadow-xl">
                <CardContent className="pt-2 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonials.image}
                      alt="UserImages"
                      height={60}
                      width={60}
                      className="rounded-full border"
                    />
                    <div>
                      <div className="font-semibold text-indigo-800">{testimonials.name}</div>
                      <div className="text-sm text-gray-500">{testimonials.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">“{testimonials.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances smarter with FinSight AI
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-100 transition animate-bounce">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>



{/* Footer Section */}
<footer className="bg-gray-800 text-white py-10">
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    
    {/* Brand Info */}
    <div>
      <h3 className="text-2xl font-bold mb-2 text-indigo-400">FinSight AI</h3>
      <p className="text-gray-400">
        Empowering smarter financial decisions with real-time AI-powered insights and tools.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-semibold mb-3 text-indigo-300">Quick Links</h4>
      <ul className="space-y-2 text-gray-300">
        <li>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </li>
        <li>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </li>
      </ul>
    </div>

    {/* Social / Legal */}
    <div className="flex flex-col items-center md:items-end">
      <h4 className="text-lg font-semibold mb-3 text-indigo-300">Connect</h4>
      <div className="flex space-x-4 mb-4">
        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
          <svg className="w-6 h-6 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.7.7 2 .9.2-1 .5-1.7.9-2-2.6-.3-5.3-1.3-5.3-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.7-2.7 5.7-5.3 6 .5.4.9 1.3.9 2.6v3.9c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z"/>
          </svg>
        </Link>
        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <svg className="w-6 h-6 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.6c-.9.4-1.8.6-2.7.8a4.7 4.7 0 0 0 2-2.6c-.9.5-2 .9-3 .9a4.5 4.5 0 0 0-7.6 4.1A12.9 12.9 0 0 1 1.7 3.2a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1c0 2.2 1.6 4 3.7 4.4a4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.2A9 9 0 0 1 0 19.5a12.7 12.7 0 0 0 6.9 2c8.3 0 12.9-6.8 12.9-12.6 0-.2 0-.5 0-.7a9 9 0 0 0 2.2-2.3z"/>
          </svg>
        </Link>
      </div>
      <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} FinSight AI. All rights reserved.</p>
    </div>
  </div>
</footer>


    </div>
  );
}
