import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import FirewallLogo from '@/components/FirewallLogo';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Erreurs de validation
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setValidationErrors({});
    let hasErrors = false;
    const errors: {[key: string]: string} = {};

    // Valider le nom d'utilisateur
    if (registerData.username.length < 3) {
      errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
      hasErrors = true;
    }

    // Valider l'email
    if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      errors.email = 'Adresse email invalide';
      hasErrors = true;
    }

    // Valider le mot de passe
    if (registerData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      hasErrors = true;
    }

    // Vérifier que les mots de passe correspondent
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      hasErrors = true;
    }

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    // Envoi du formulaire d'inscription
    const { confirmPassword, ...registerPayload } = registerData;
    registerMutation.mutate(registerPayload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#11131a] p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Partie gauche: Formulaire */}
        <Card className="bg-[#11131a] border-[#1a1d25] w-full">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <FirewallLogo className="w-32 h-32 mb-2" />
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin 
                ? 'Connectez-vous à votre compte FirewallAI'
                : 'Créez un compte pour accéder à FirewallAI'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              /* Formulaire de connexion */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="bg-[#1a1d25] border-[#222631]"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-white">Mot de passe</Label>
                    <a href="#" className="text-xs text-primary-500 hover:text-primary-400">
                      Mot de passe oublié?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-[#1a1d25] border-[#222631]"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>
                
                {loginMutation.isError && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-400">
                    <AlertDescription>
                      {loginMutation.error?.message || "Erreur de connexion. Veuillez réessayer."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-400">
                    Pas encore de compte?{' '}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(false)} 
                      className="text-primary-500 hover:text-primary-400"
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Formulaire d'inscription */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Nom d'utilisateur</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="utilisateur" 
                    className={`bg-[#1a1d25] border-[#222631] ${validationErrors.username ? 'border-red-600' : ''}`}
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    required
                  />
                  {validationErrors.username && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className={`bg-[#1a1d25] border-[#222631] ${validationErrors.email ? 'border-red-600' : ''}`}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-white">Mot de passe</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className={`bg-[#1a1d25] border-[#222631] ${validationErrors.password ? 'border-red-600' : ''}`}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                  />
                  {validationErrors.password && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className={`bg-[#1a1d25] border-[#222631] ${validationErrors.confirmPassword ? 'border-red-600' : ''}`}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
                
                {registerMutation.isError && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-400">
                    <AlertDescription>
                      {registerMutation.error?.message || "Erreur d'inscription. Veuillez réessayer."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Inscription en cours...' : 'Créer un compte'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-400">
                    Déjà un compte?{' '}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(true)} 
                      className="text-primary-500 hover:text-primary-400"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Partie droite: Description */}
        <div className="hidden md:flex flex-col justify-center p-6">
          <h1 className="text-4xl font-bold text-blue-300 mb-4">FirewallAI</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-6">Protection intelligente pour votre réseau</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start">
              <div className="bg-primary-900/30 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-primary-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.928l9.618-13.944A11.955 11.955 0 0112 2.944z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-300">Protection avancée</h3>
                <p className="text-gray-400">Système de pare-feu de nouvelle génération avec détection des intrusions et analyse comportementale.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-900/30 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-primary-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-300">IA intégrée</h3>
                <p className="text-gray-400">Détection et analyse intelligente des menaces avec apprentissage automatique.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-900/30 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-primary-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-300">Surveillance en temps réel</h3>
                <p className="text-gray-400">Tableau de bord avancé avec visualisation du trafic réseau et alertes en temps réel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;