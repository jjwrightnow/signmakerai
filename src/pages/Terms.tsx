import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Nature of the Service</h2>
            <p>
              SignMaker.ai is an informational reference and data-organization tool.
            </p>
            <p className="mt-4">The Service allows users to store, retrieve, and reference:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>User-submitted preferences, constraints, and decisions</li>
              <li>Company-approved reference information</li>
            </ul>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <p>
                The Service does not provide instructions, specifications, recommendations, or guidance 
                related to physical activities, regulated work, or professional judgment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. No Professional or Operational Advice</h2>
            <p>SignMaker.ai does not provide advice or guidance related to:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Fabrication or manufacturing</li>
              <li>Installation or assembly</li>
              <li>Electrical systems</li>
              <li>Structural support or load considerations</li>
              <li>Safety procedures or risk mitigation</li>
              <li>Regulatory, code, or compliance matters</li>
              <li>"Best practices" or standards implying correctness</li>
            </ul>
            <p className="mt-4">
              All information is provided for general informational purposes only.
            </p>
            <p className="mt-4">
              Users remain solely responsible for any real-world actions or decisions made outside the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User-Controlled Memory</h2>
            <p>Any stored "memory" exists only because a user explicitly saved it.</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>The Service does not autonomously learn or infer preferences</li>
              <li>The Service does not write to memory without user action</li>
              <li>Users may edit or delete memory at any time</li>
              <li>Deleted memory is no longer used in future responses</li>
            </ul>
            <p className="mt-4">The Service does not retain hidden, inferred, or implied memory.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Company Knowledge</h2>
            <p>Company knowledge is created and governed by the user's organization.</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>It is visible only to members of the same company</li>
              <li>It is not verified, endorsed, or validated by SignMaker.ai</li>
            </ul>
            <p className="mt-4">The Service acts only as a reference mechanism.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SignMaker.ai and its operators disclaim all liability for:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Decisions made by users outside the Service</li>
              <li>Reliance on informational content</li>
              <li>Errors, omissions, or outdated information</li>
              <li>Outcomes resulting from actions taken based on Service output</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Assumption of Responsibility</h2>
            <p>By using the Service, you acknowledge that:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>The Service is informational only</li>
              <li>It does not replace professional judgment</li>
              <li>You retain full responsibility for real-world decisions and actions</li>
            </ul>
          </section>

          <div className="border-t border-border pt-8 mt-12 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/privacy">Privacy Policy</Link>
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
