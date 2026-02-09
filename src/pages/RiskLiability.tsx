import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function RiskLiability() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center px-6 py-4 border-b border-border">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Logo size="sm" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Risk & Liability Posture Summary</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Product Classification</h2>
            <p>
              SignMaker.ai is an information governance and reference platform, not an advisory or operational system.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-4">
              <p className="mb-2 font-medium text-foreground">The AI is:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Read-only with respect to long-term data</li>
                <li>User-initiated in all data persistence</li>
                <li>Transparent in source attribution</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Risk Controls</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>No autonomous learning</li>
              <li>No implicit personalization</li>
              <li>No operational guidance</li>
              <li>No safety, electrical, structural, or compliance advice</li>
              <li>Explicit user control over stored data</li>
              <li>Strong access isolation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Liability Mitigation</h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <ul className="list-disc list-inside space-y-2">
                <li>Output is informational only</li>
                <li>No best-practice recommendations</li>
                <li>No instruction or procedural guidance</li>
                <li>No duty-creating language</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access-controlled data storage</li>
              <li>User-owned personal memory</li>
              <li>Company-scoped shared knowledge</li>
              <li>Versioned access policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Summary</h2>
            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-4">
              <p className="mb-2">
                The product does not assume responsibility for physical outcomes, compliance, or professional judgment.
              </p>
              <p>
                Risk exposure is limited to information handling, not real-world execution.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
