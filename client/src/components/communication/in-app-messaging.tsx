import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus, 
  Paperclip, 
  Image, 
  CheckCheck, 
  Check,
  Clock,
  User,
  Settings,
  Filter,
  MoreHorizontal
} from 'lucide-react';

export default function InAppMessaging() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientInitials: 'SJ',
      lastMessage: 'Thank you for the aftercare instructions!',
      timestamp: '10 mins ago',
      unreadCount: 0,
      isOnline: true,
      treatmentType: 'Botox'
    },
    {
      id: 2,
      clientName: 'Emma Thompson',
      clientInitials: 'ET',
      lastMessage: 'When should I book my next appointment?',
      timestamp: '2 hours ago',
      unreadCount: 2,
      isOnline: false,
      treatmentType: 'Dermal Fillers'
    },
    {
      id: 3,
      clientName: 'Michael Roberts',
      clientInitials: 'MR',
      lastMessage: 'The treatment went really well, feeling great!',
      timestamp: '1 day ago',
      unreadCount: 0,
      isOnline: false,
      treatmentType: 'Chemical Peel'
    },
    {
      id: 4,
      clientName: 'Lisa Anderson',
      clientInitials: 'LA',
      lastMessage: 'I have a question about the aftercare products',
      timestamp: '2 days ago',
      unreadCount: 1,
      isOnline: true,
      treatmentType: 'Skin Consultation'
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      senderId: 'client',
      senderName: 'Sarah Johnson',
      content: 'Hi, I had my Botox treatment yesterday and wanted to check when I can exercise again?',
      timestamp: '2025-01-23 14:30',
      status: 'read',
      type: 'text'
    },
    {
      id: 2,
      senderId: 'practitioner',
      senderName: 'You',
      content: 'Hi Sarah! Great question. You should avoid strenuous exercise for 24 hours after your Botox treatment. Since it was yesterday, you can resume normal activities from today.',
      timestamp: '2025-01-23 14:45',
      status: 'read',
      type: 'text'
    },
    {
      id: 3,
      senderId: 'practitioner',
      senderName: 'You',
      content: 'Here are your complete aftercare instructions for reference:',
      timestamp: '2025-01-23 14:46',
      status: 'read',
      type: 'text'
    },
    {
      id: 4,
      senderId: 'practitioner',
      senderName: 'You',
      content: 'botox-aftercare-guide.pdf',
      timestamp: '2025-01-23 14:46',
      status: 'read',
      type: 'file'
    },
    {
      id: 5,
      senderId: 'client',
      senderName: 'Sarah Johnson',
      content: 'Perfect, thank you so much! The information is really helpful.',
      timestamp: '2025-01-23 15:20',
      status: 'read',
      type: 'text'
    },
    {
      id: 6,
      senderId: 'client',
      senderName: 'Sarah Johnson',
      content: 'Thank you for the aftercare instructions!',
      timestamp: '2025-01-24 11:20',
      status: 'read',
      type: 'text'
    }
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'delivered': return <Check className="w-3 h-3 text-gray-400" />;
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      default: return null;
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-lea-deep-charcoal">In-App Messaging</h2>
          <p className="text-lea-charcoal-grey">Communicate directly with your clients</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Messaging Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">24</div>
            <p className="text-xs text-muted-foreground">+3 new today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">12 min</div>
            <p className="text-xs text-muted-foreground">average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">3</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">7</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lea-deep-charcoal">98%</div>
            <p className="text-xs text-muted-foreground">positive feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Messaging Interface */}
      <Card className="h-[600px]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conv.id ? 'bg-lea-pearl-white border-l-4 border-l-lea-elegant-silver' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-lea-elegant-silver text-white">
                          {conv.clientInitials}
                        </AvatarFallback>
                      </Avatar>
                      {conv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lea-deep-charcoal truncate">
                          {conv.clientName}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-lea-charcoal-grey truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-lea-charcoal-grey">{conv.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          {conv.treatmentType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {selectedConv && (
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-lea-elegant-silver text-white text-sm">
                          {selectedConv.clientInitials}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-lea-deep-charcoal">{selectedConv.clientName}</h3>
                      <p className="text-sm text-lea-charcoal-grey">
                        {selectedConv.isOnline ? 'Online now' : 'Last seen 2 hours ago'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedConv.treatmentType}</Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
                  
                  return (
                    <div key={message.id}>
                      {/* Date Separator */}
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div className={`flex ${message.senderId === 'practitioner' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === 'practitioner' 
                            ? 'bg-lea-elegant-silver text-white' 
                            : 'bg-gray-100 text-lea-deep-charcoal'
                        }`}>
                          {message.type === 'file' ? (
                            <div className="flex items-center space-x-2">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm underline cursor-pointer">
                                {message.content}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                          
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            message.senderId === 'practitioner' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                            {message.senderId === 'practitioner' && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageText.trim()) {
                      // Handle send message
                      setMessageText('');
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  disabled={!messageText.trim()}
                  onClick={() => setMessageText('')}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Appointment Confirmation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Aftercare Instructions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Follow-up Check-in
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Treatment Reminder
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">New message from Emma Thompson</p>
                <p className="text-lea-charcoal-grey">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Lisa Anderson marked as resolved</p>
                <p className="text-lea-charcoal-grey">4 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Sent aftercare guide to 3 clients</p>
                <p className="text-lea-charcoal-grey">6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Auto-Reply Messages
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
