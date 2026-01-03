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
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>Email Address:</strong> Required for account creation and authentication
              </li>
              <li>
                <strong>Company Information (Optional):</strong> You may optionally provide company 
                details to enhance your experience
              </li>
              <li>
                <strong>User-Generated Content:</strong> Knowledge, notes, and questions you submit
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our platform
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Information We Don't Collect</h2>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-4">
              <ul className="list-disc list-inside space-y-2">
                <li>We do <strong>not</strong> collect your phone number</li>
                <li>We do <strong>not</strong> sell your personal data to third parties</li>
                <li>We do <strong>not</strong> share your information with advertisers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our service</li>
              <li>To authenticate your account and protect your data</li>
              <li>To improve our platform based on usage patterns</li>
              <li>To communicate important updates about our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Third-Party AI Processing</h2>
            <div className="bg-secondary/50 border border-border rounded-lg p-6 my-4">
              <p className="mb-4">
                <strong>AI Disclosure:</strong> SignMaker.ai uses Anthropic's Claude AI to process 
                certain requests and generate responses.
              </p>
              <p>
                When you interact with our AI features, your queries may be processed by Anthropic's 
                systems. Anthropic's privacy policy governs their handling of this data. We recommend 
                reviewing <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic's Privacy Policy</a> for more information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase infrastructure with encryption at rest 
              and in transit. We implement industry-standard security measures to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your data</li>
            </ul>
            <p className="mt-4">
              You can delete your account at any time through your Profile settings. This will 
              permanently remove all your data from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use 
              tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, please contact us at privacy@signmaker.ai
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
