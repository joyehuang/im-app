import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Users } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

interface CreateConversationDialogProps {
  trigger?: React.ReactNode;
}

export const CreateConversationDialog: React.FC<CreateConversationDialogProps> = ({
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'single' | 'group'>('single');
  const [name, setName] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { createConversation } = useChat();

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createConversation(type, type === 'group' ? name : undefined, memberIds);
      setIsOpen(false);
      setName('');
      setMemberIds([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Conversation</DialogTitle>
          <DialogDescription>
            Create a new conversation with other users
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'single' ? 'default' : 'outline'}
                onClick={() => setType('single')}
                className="flex-1"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Single
              </Button>
              <Button
                type="button"
                variant={type === 'group' ? 'default' : 'outline'}
                onClick={() => setType('group')}
                className="flex-1"
              >
                <Users className="mr-2 h-4 w-4" />
                Group
              </Button>
            </div>
          </div>

          {type === 'group' && (
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Members</Label>
            <Input
              value={memberIds.join(', ')}
              onChange={(e) => setMemberIds(e.target.value.split(',').map(id => id.trim()).filter(Boolean))}
              placeholder="Enter user IDs (comma-separated)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
