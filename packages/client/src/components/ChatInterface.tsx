    import { useState, useRef, useEffect } from 'react';
    import { Send, Bot, User } from 'lucide-react';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

    interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    }

    export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'assistant', content: "Hello! How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    const handleSend = async() => {
        if (!input.trim()) return;

        const userMessageValue = input;
        const userMsg: Message = { id: Date.now(), role: 'user', content: userMessageValue };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try{
            const res = await fetch('/api/chat',{
                method:'POST',
                headers:{   'Content-Type':'application/json'},
                body:JSON.stringify({message:userMessageValue})
            });

            const data = await res.json();
            const botMsg: Message = { id: Date.now(), role: 'assistant', content: data.message };
            setMessages(prev => [...prev, botMsg]);
        }catch(error){
            console.error('Error sending message:', error);
        }
        
    };

    return (
        <div className="flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-2xl h-[520px] flex flex-col shadow-xl">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Assistant
                </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                    <div className="space-y-4">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="w-8 h-8 border">
                            {m.role === 'assistant' ? (
                            <>
                                <AvatarImage src="/bot-avatar.png" />
                                <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                            </>
                            ) : (
                            <>
                                <AvatarImage src="/user-avatar.png" />
                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                            </>
                            )}
                        </Avatar>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            m.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}>
                            {m.content}
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 border-t">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex w-full items-center space-x-2"
            >
                <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
                </Button>
            </form>
            </CardFooter>
        </Card>
        </div>
    );
    }