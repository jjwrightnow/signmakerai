import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/Logo';
import { TrainMeModal } from '@/components/TrainMeModal';
import { useAuth } from '@/lib/auth';
import { 
  PlusCircle, 
  MessageSquare, 
  BookOpen, 
  User, 
  Lightbulb,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  group: string;
}

interface ChatSidebarProps {
  chatHistory?: ChatHistory[];
  onNewChat?: () => void;
  currentChatId?: string;
}

export function ChatSidebar({ chatHistory = [], onNewChat, currentChatId }: ChatSidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [trainMeOpen, setTrainMeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Group chats by date
  const groupedChats = chatHistory.reduce((acc, chat) => {
    if (!acc[chat.group]) {
      acc[chat.group] = [];
    }
    acc[chat.group].push(chat);
    return acc;
  }, {} as Record<string, ChatHistory[]>);

  const sidebarContent = (
    <>
      <div className="p-4">
        <Logo size="sm" showBeta={false} />
      </div>

      <div className="px-3 pb-3">
        <Button 
          onClick={onNewChat} 
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator className="bg-border" />

      <ScrollArea className="flex-1 px-3 py-3">
        {Object.entries(groupedChats).map(([group, chats]) => (
          <div key={group} className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
              {group}
            </p>
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 mb-1 text-sm font-normal",
                  currentChatId === chat.id && "bg-secondary"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </div>
        ))}
        {chatHistory.length === 0 && (
          <p className="text-sm text-muted-foreground px-2">
            No chat history yet
          </p>
        )}
      </ScrollArea>

      <Separator className="bg-border" />

      <div className="p-3 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link to="/notes">
            <BookOpen className="h-4 w-4" />
            My Notes
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link to="/profile">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setTrainMeOpen(true)}
        >
          <Lightbulb className="h-4 w-4" />
          Train Me
        </Button>
      </div>

      <Separator className="bg-border" />

      <div className="p-3">
        <p className="text-xs text-muted-foreground truncate mb-2 px-2">
          {user?.email}
        </p>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <TrainMeModal open={trainMeOpen} onOpenChange={setTrainMeOpen} />
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50",
        "transition-transform duration-200 ease-in-out",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
