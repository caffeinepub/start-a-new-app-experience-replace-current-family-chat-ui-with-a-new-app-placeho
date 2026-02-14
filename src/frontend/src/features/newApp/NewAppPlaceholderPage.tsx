import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function NewAppPlaceholderPage() {
  const [appDescription, setAppDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCapture = () => {
    if (appDescription.trim()) {
      setShowConfirmation(true);
      // Hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Your New App</h1>
        <p className="text-lg text-muted-foreground">
          Let's start building something amazing together
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>What do you want to build?</CardTitle>
          <CardDescription>
            Describe your app idea in as much detail as you'd like. This will help shape what we create together.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-description">Describe your app</Label>
            <Textarea
              id="app-description"
              placeholder="I want to build an app that..."
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {showConfirmation && (
            <Alert className="bg-primary/10 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                Great! Your app description has been captured. We're ready to start building!
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleCapture}
            disabled={!appDescription.trim()}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Capture My Idea
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">💡 Get Inspired</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Think about problems you want to solve or experiences you want to create.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">🎯 Be Specific</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The more details you provide, the better we can understand your vision.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">🚀 Start Simple</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Begin with core features and we can always expand from there.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
