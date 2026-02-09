import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Data We Collect</h2>
            <p>We collect and store only data that users explicitly provide, including:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Account information</li>
              <li>User-submitted memories (preferences, constraints, decisions)</li>
              <li>Company-approved reference information</li>
            </ul>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-4">
              <p>We do not collect inferred preferences, behavioral profiles, or implicit learning data.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How Memory Works</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Memory is created only through explicit user action</li>
              <li>Memory is stored in structured records</li>
              <li>The AI does not autonomously learn from usage</li>
              <li>Memory can be edited or deleted at any time</li>
            </ul>
            <p className="mt-4">There is no hidden or background memory generation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Separation</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Personal memory is private to the user</li>
              <li>Company knowledge is visible only to company members</li>
              <li>Data access is restricted through access controls</li>
            </ul>
            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-4">
              <p>There is no cross-customer data sharing.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Deletion and Control</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Deleting a memory removes it from future responses</li>
              <li>Deleting an account removes all associated personal memory</li>
              <li>The Service does not retain concealed copies of deleted data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Use of Data</h2>
            <p>User data is used solely to provide the Service.</p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <ul className="list-disc list-inside space-y-2">
                <li>Data is not used for external AI training</li>
                <li>Data is not sold or repurposed</li>
                <li>Data is not used beyond user-initiated functionality</li>
              </ul>
            </div>
          </section>

          <div className="border-t border-border pt-8 mt-12 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/terms">Terms of Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/risk-liability">Risk & Liability Posture</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/review-control">Review & Change Control</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
