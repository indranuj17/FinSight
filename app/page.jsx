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
<footer className="bg bg-gray-600 text-white">
  <div className="container mx-auto px-4 text-center">
    <p className="text-sm md:text-base">
      © {new Date().getFullYear()} FinSight AI. Built with ❤️ by Indranuj.
    </p>
    <div className="mt-4 flex justify-center space-x-4">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/about" className="hover:underline">
        About
      </Link>
      <Link href="/contact" className="hover:underline">
        Contact
      </Link>
    </div>
  </div>
</footer>


    </div>
  );
}
