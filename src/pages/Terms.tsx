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
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SignMaker.ai, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
            <p>
              SignMaker.ai is a knowledge platform designed for sign industry professionals. 
              We provide information, guidance, and tools to help you make better decisions in your work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Important Disclaimers</h2>
            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">⚠️ Professional Advice Disclaimer</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Not Engineering Advice:</strong> Information provided is not professional engineering advice. 
                  Consult licensed engineers for structural and engineering requirements.
                </li>
                <li>
                  <strong>Not Electrical Advice:</strong> We do not provide electrical installation guidance. 
                  Always consult licensed electricians and follow local electrical codes.
                </li>
                <li>
                  <strong>Not Safety Certification:</strong> Our platform does not certify that any installation 
                  or product meets safety standards. Always follow manufacturer guidelines and safety regulations.
                </li>
                <li>
                  <strong>Local Codes Vary:</strong> Building codes, zoning regulations, and permit requirements 
                  vary by jurisdiction. Always verify with your local authorities.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. AI-Generated Content</h2>
            <p>
              Some content on SignMaker.ai is generated using artificial intelligence technology. 
              While we strive for accuracy:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>AI-generated content may contain errors or inaccuracies</li>
              <li>Information should be independently verified before use in professional applications</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. User-Contributed Content</h2>
            <p>
              By submitting knowledge or content to SignMaker.ai, you grant us a non-exclusive, 
              royalty-free license to use, modify, and distribute that content for the purpose 
              of improving our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              SignMaker.ai shall not be liable for any direct, indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at support@signmaker.ai
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
