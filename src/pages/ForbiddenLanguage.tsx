import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ban, AlertTriangle } from 'lucide-react';

export default function ForbiddenLanguage() {
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
        <h1 className="text-4xl font-bold mb-8">Forbidden Language & Review Rules</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Ban className="h-6 w-6 text-destructive" />
              Forbidden Language
            </h2>
            <p>The following terms are prohibited across all UI, prompts, and documentation:</p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <ul className="space-y-3">
                {[
                  'Best practices',
                  'Recommendations',
                  'Standards (when implying correctness)',
                  'Compliance guidance',
                  'How-to instructions',
                  'Safe / unsafe claims',
                  'Approved / certified methods',
                ].map((term) => (
                  <li key={term} className="flex items-start gap-3">
                    <Ban className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Review Rule
            </h2>
            <p>Any change affecting:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Memory behavior</li>
              <li>AI wording</li>
              <li>Trust language</li>
              <li>Capability claims</li>
            </ul>

            <p className="mt-6">Must be reviewed for:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Liability exposure</li>
              <li>Duty of care creation</li>
              <li>Implied professional advice</li>
            </ul>

            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-6">
              <p className="font-medium text-foreground">
                If uncertain, default to less capability, more transparency.
              </p>
            </div>
          </section>

          <div className="border-t border-border pt-8 mt-12 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/terms">Terms of Service</Link>
            </Button>
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
