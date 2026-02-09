import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { TrainMeModal } from '@/components/TrainMeModal';
import { useAuth } from '@/lib/auth';
import { ArrowRight, BookOpen, MessageSquare } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trainMeOpen, setTrainMeOpen] = useState(false);

  const handleAskQuestion = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/chat');
    }
  };

  const handleTrainMe = () => {
    if (user) {
      setTrainMeOpen(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Logo />
        {user ? (
          <Button variant="ghost" asChild>
            <Link to="/chat">Go to Chat</Link>
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your decisions,{' '}
            <span className="text-primary">organized.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto">
            An informational reference and decision-tracking tool for sign industry professionals.
          </p>

          <p className="text-sm text-muted-foreground mb-10 max-w-lg mx-auto">
            SignMaker.ai is an information and reference tool only and does not provide instructions, specifications, or advice related to physical work, safety, compliance, or regulated activities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleAskQuestion}
              className="gap-2 text-base px-8"
            >
              <MessageSquare className="h-5 w-5" />
              Ask a question
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleTrainMe}
              className="gap-2 text-base px-8"
            >
              <BookOpen className="h-5 w-5" />
              Save what I know
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SignMaker.ai
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>

      <TrainMeModal open={trainMeOpen} onOpenChange={setTrainMeOpen} />
    </div>
  );
};

export default Index;
