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
              SignMaker.ai is an informational reference and decision-tracking tool for sign industry professionals. 
              It allows users to store, organize, and retrieve their own decisions, preferences, and 
              non-operational reference information.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-4">
              <p className="font-semibold text-foreground mb-2">Important:</p>
              <p>
                SignMaker.ai is an information and reference tool only and does not provide instructions, 
                specifications, or advice related to physical work, safety, compliance, or regulated activities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Service Limitations</h2>
            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">SignMaker.ai Does NOT Provide:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Fabrication or manufacturing instructions</li>
                <li>Installation instructions or procedures</li>
                <li>Electrical or wiring guidance</li>
                <li>Structural or load-bearing guidance</li>
                <li>Safety procedures or risk assessments</li>
                <li>Regulatory or code compliance advice</li>
                <li>Professional recommendations or endorsements</li>
                <li>Validation or approval of real-world decisions</li>
              </ul>
              <p className="mt-4">
                All content is descriptive, not prescriptive. All content is informational, not instructional. 
                All content is neutral, not advisory.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. AI-Generated Content</h2>
            <p>
              Some content on SignMaker.ai is generated using artificial intelligence technology. 
              This content is strictly informational:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>AI-generated content is a descriptive overview only and may contain errors or inaccuracies</li>
              <li>AI responses do not constitute professional judgment, advice, or endorsement</li>
              <li>The AI does not autonomously learn about users — it references only explicitly saved, user-submitted records</li>
              <li>All information should be independently verified by qualified professionals before any application</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. User Memories and Company Knowledge</h2>
            <p>SignMaker.ai allows users to store two types of records:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>User Memories:</strong> User-submitted decision records and preferences. These store 
                what a user has decided or prefers — not instructions or procedures.
              </li>
              <li>
                <strong>Company Knowledge:</strong> Organization-level reference information submitted and 
                approved by authorized users. This stores non-operational reference data — not procedures, 
                methods, or compliance guidance.
              </li>
            </ul>
            <p className="mt-4">
              The AI references these records transparently when relevant, with explicit source attribution. 
              Users maintain full control over their stored data, including the ability to edit and delete records at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. User-Contributed Content</h2>
            <p>
              By submitting reference information or decision records to SignMaker.ai, you grant us a non-exclusive, 
              royalty-free license to use, modify, and distribute that content for the purpose 
              of maintaining and operating our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              SignMaker.ai shall not be liable for any direct, indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to use the service, 
              including but not limited to any decisions made based on information provided by the platform.
            </p>
            <p className="mt-4">
              Users are solely responsible for verifying all information with qualified professionals 
              and local authorities before applying it to any real-world activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at support@signmaker.ai
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
