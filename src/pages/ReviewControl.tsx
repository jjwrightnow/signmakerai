import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export default function ReviewControl() {
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
        <h1 className="text-4xl font-bold mb-8">Review & Change Control Rules</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-destructive" />
              Locked Concepts (Do Not Change)
            </h2>
            <p>The following concepts are permanently locked and must not be altered:</p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>Explicit memory only</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>User-controlled memory</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>No autonomous AI learning</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>Read-only AI relative to stored memory</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>Informational output only</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>No operational or safety guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <span>Transparency over optimization</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
