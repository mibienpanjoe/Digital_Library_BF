"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2 } from "lucide-react";
// import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Mock Login logic for now
      // const response = await authService.login({ email, password });
      // login(response.data.token, response.data.user);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      login("mock-token", {
        id: "1",
        name: "Test User",
        email: email,
        role: "user",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="mb-4 flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Digital Library BF
            </span>
          </Link>
        </div>

        <Card className="rounded-xl shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                className="w-full rounded-lg" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
              <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  S&apos;inscrire
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
