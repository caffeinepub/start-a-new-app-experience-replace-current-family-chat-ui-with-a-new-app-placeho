import { useState, useEffect, useRef } from 'react';
import { useMembershipStatus } from '../auth/hooks/useMembershipStatus';
import { useChatMessages } from './hooks/useChatMessages';
import { usePostMessage } from './hooks/usePostMessage';
import AccessDeniedScreen from '../../components/auth/AccessDeniedScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, RefreshCw } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';

export default function ChatPage() {
  const { identity } = useInternetIdentity();
  const { isMember, isLoading: membershipLoading, isFetched } = useMembershipStatus();
  const { messages, isLoading: messagesLoading, refetch } = useChatMessages();
  const { postMessage, isPending } = usePostMessage();
  const [messageContent, setMessageContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = messageContent.trim();
    if (!trimmed || isPending) return;

    if (trimmed.length > 500) {
      alert('Message is too long. Please keep it under 500 characters.');
      return;
    }

    await postMessage(trimmed);
    setMessageContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (membershipLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isFetched && !isMember) {
    return (
      <AccessDeniedScreen message="You are not a member of this family chat. Please contact the administrator to be added." />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-card/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Family Chat</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={messagesLoading}
            >
              <RefreshCw className={`w-4 h-4 ${messagesLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
            {messagesLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender.toString() === currentPrincipal;
                  const senderShort = `${message.sender.toString().slice(0, 8)}...`;
                  const timestamp = new Date(Number(message.timestamp) / 1000000);

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] space-y-1 ${
                          isOwn ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isOwn ? (
                            <>
                              <span className="text-xs text-muted-foreground">
                                {timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {senderShort}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4 bg-card/50">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none"
                disabled={isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!messageContent.trim() || isPending}
                size="lg"
                className="px-6"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {messageContent.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

