import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BrandMark } from '@/components/portal/BrandMark';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const signUpSchema = z.object({
  first_name: z.string().trim().min(1, { message: "First name is required" }).max(50),
  last_name: z.string().trim().min(1, { message: "Last name is required" }).max(50),
  email: z.string().trim().email({ message: "Invalid email address" }),
  mobile: z.string().trim().min(10, { message: "Valid mobile number is required" }).max(15),
  mobile_with_country_code: z.string().trim().min(1, { message: "Country code is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    first_name: '', last_name: '', email: '', mobile: '', mobile_with_country_code: '+91', password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0] as keyof SignUpFormData] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      await signUp({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        mobile_with_country_code: formData.mobile_with_country_code,
        password: formData.password,
      });
      toast({ title: "Account created!", description: "Welcome to intGrow. Please check your email for verification." });
      navigate('/tariff-savings-calculator');
    } catch (error) {
      toast({ title: "Sign up failed", description: error instanceof Error ? error.message : "Sign up failed", variant: "destructive" });
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
              <CardTitle className="text-2xl">{t('signUpPage.createAccount')}</CardTitle>
              <CardDescription>{t('signUpPage.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('signUpPage.firstName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="firstName" placeholder="John" className="pl-10" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} disabled={isLoading} />
                    </div>
                    {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('signUpPage.lastName')}</Label>
                    <Input id="lastName" placeholder="Smith" value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} disabled={isLoading} />
                    {errors.last_name && <p className="text-xs text-destructive">{errors.last_name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('signUpPage.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@company.com" className="pl-10" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} disabled={isLoading} />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">{t('signUpPage.mobile')}</Label>
                  <div className="flex gap-2">
                    <Input id="countryCode" placeholder="+91" className="w-20" value={formData.mobile_with_country_code} onChange={(e) => handleChange('mobile_with_country_code', e.target.value)} disabled={isLoading} />
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="mobile" type="tel" placeholder="9876543210" className="pl-10" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} disabled={isLoading} />
                    </div>
                  </div>
                  {(errors.mobile || errors.mobile_with_country_code) && <p className="text-xs text-destructive">{errors.mobile || errors.mobile_with_country_code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('signUpPage.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} disabled={isLoading} />
                  </div>
                  {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : <p className="text-xs text-muted-foreground">{t('signUpPage.passwordHint')}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('signUpPage.creating')}</>) : t('signUpPage.create')}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {t('signUpPage.terms')}{' '}<Link to="#" className="underline">{t('signUpPage.termsLink')}</Link>{' '}{t('signUpPage.and')}{' '}<Link to="#" className="underline">{t('signUpPage.privacyLink')}</Link>
              </p>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">{t('signInPage.or')}</span>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {t('signUpPage.hasAccount')}{' '}<Link to="/signin" className="text-primary font-medium hover:underline">{t('signUpPage.signInLink')}</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
