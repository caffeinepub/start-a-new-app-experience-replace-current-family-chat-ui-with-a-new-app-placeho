import { useState } from 'react';
import { useFamilyMembers } from './hooks/useFamilyMembers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, UserPlus, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Principal } from '@dfinity/principal';

export default function FamilySettingsPage() {
  const { members, isLoading, addMember, removeMember, isAdding, isRemoving } = useFamilyMembers();
  const [newMemberPrincipal, setNewMemberPrincipal] = useState('');
  const [validationError, setValidationError] = useState('');

  const validatePrincipal = (value: string): boolean => {
    try {
      Principal.fromText(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddMember = async () => {
    const trimmed = newMemberPrincipal.trim();
    
    if (!trimmed) {
      setValidationError('Please enter a Principal ID');
      return;
    }

    if (!validatePrincipal(trimmed)) {
      setValidationError('Invalid Principal ID format');
      return;
    }

    try {
      const principal = Principal.fromText(trimmed);
      await addMember(principal);
      setNewMemberPrincipal('');
      setValidationError('');
    } catch (error: any) {
      setValidationError(error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (member: Principal) => {
    if (confirm(`Are you sure you want to remove this member?\n${member.toString()}`)) {
      await removeMember(member);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Family Settings</CardTitle>
              <CardDescription>Manage who can access your family chat</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal" className="text-base font-semibold">
                Add Family Member
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Enter the Principal ID of the person you want to add
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="principal"
                  placeholder="Enter Principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                  value={newMemberPrincipal}
                  onChange={(e) => {
                    setNewMemberPrincipal(e.target.value);
                    setValidationError('');
                  }}
                  disabled={isAdding}
                  className="font-mono text-sm"
                />
                {validationError && (
                  <p className="text-sm text-destructive mt-1">{validationError}</p>
                )}
              </div>
              <Button onClick={handleAddMember} disabled={isAdding || !newMemberPrincipal.trim()}>
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Family Members</h3>
                <p className="text-sm text-muted-foreground">
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
              <Badge variant="secondary">{members.length}</Badge>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No family members yet. Add members using their Principal ID above.
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[400px] rounded-lg border">
                <div className="p-4 space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.toString()}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate">{member.toString()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        disabled={isRemoving}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

