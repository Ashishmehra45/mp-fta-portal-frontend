import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/portal/BrandMark';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/tariff-savings-calculator';
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);

  const signInWithApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiKeyInput = document.getElementById("api_key") as HTMLInputElement;
    const apiKey = apiKeyInput?.value;
    if (!apiKey) { toast({ title: "Error", description: "Please enter an API key" }); return; }
    setIsApiKeyLoading(true);
    try {
      await signIn({ email: 'api_key_user', password: apiKey });
      toast({ title: "Signed in successfully!" });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Invalid API key" });
    } finally { setIsApiKeyLoading(false); }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (!email || !password) { toast({ title: "Error", description: "Please fill in all fields" }); return; }
    setIsLoading(true);
    try {
      await signIn({ email, password });
      toast({ title: "Signed in successfully!" });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Sign in failed" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="container max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-fit"><BrandMark /></div>
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">Global Duty Calculator</p>
              <CardTitle className="text-2xl">{t('signInPage.welcomeBack')}</CardTitle>
              <CardDescription>{t('signInPage.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('signInPage.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="you@company.com" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('signInPage.password')}</Label>
                    <Link to="#" className="text-sm text-primary hover:underline">{t('signInPage.forgotPassword')}</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('signInPage.signingIn')}</>) : t('signInPage.signIn')}
                </Button>
              </form>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">{t('signInPage.or')}</span>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="api_key" type="password" placeholder={t('signInPage.apiKeyPlaceholder')} className="pl-10" disabled={isApiKeyLoading} />
                  <Button type="button" className="absolute right-0 top-1/2 -translate-y-1/2" onClick={signInWithApiKeySubmit} disabled={isApiKeyLoading}>
                    {isApiKeyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">{t('signInPage.or')}</span>
              </div>

              <p className="mb-3 text-center text-xs text-muted-foreground">
                Sign-in is needed only for the Global Duty Calculator. Every other tool on this portal is open to all.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                {t('signInPage.noAccount')}{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">{t('signInPage.signUpLink')}</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
