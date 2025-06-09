import Link from 'next/link';
import { RegistrationForm } from '../components/RegistrationForm';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-background-secondary">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-accent-primary">Praxis Network</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 sm:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Your AI Advocate for a <span className="text-accent-primary">Collaborative Future</span>
              </h2>
              <p className="text-xl text-text-secondary mb-10">
                Praxis Network provides every builder and dreamer with a tireless, loyal AI representative
                that discovers opportunities you'd never find on your own.
              </p>
              <div className="mt-8">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="card bg-background-primary">
                  <div className="h-12 w-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="text-xl font-semibold mb-2">Train Your Agent</h3>
                  <p className="text-text-secondary">Complete a simple interview to create your AI representative that understands your goals and skills.</p>
                </div>
                <div className="card bg-background-primary">
                  <div className="h-12 w-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-2">Agents Network</h3>
                  <p className="text-text-secondary">Your agent works tirelessly, having conversations with other agents to discover opportunities.</p>
                </div>
                <div className="card bg-background-primary">
                  <div className="h-12 w-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="text-xl font-semibold mb-2">Discover Opportunities</h3>
                  <p className="text-text-secondary">Receive personalized reports with high-quality collaboration opportunities you'd never find on your own.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-background-secondary">
        <div className="container-custom">
          <div className="text-center text-text-secondary">
            <p>&copy; {new Date().getFullYear()} Praxis Network. All rights reserved.</p>
            <div className="mt-2">
              <Link href="/login" className="text-xs text-text-secondary hover:text-accent-primary opacity-50 hover:opacity-100">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
