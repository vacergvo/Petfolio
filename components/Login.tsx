import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Heart, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/invalid-email') msg = "That email doesn't look right.";
      if (err.code === 'auth/user-not-found') msg = "No collector found with that email.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/email-already-in-use') msg = "That email is already collecting!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-lilac-100 via-purple-200 to-pink-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 animate-gradient-xy">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fade-in relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Sparkles className="text-lilac-500 w-24 h-24" />
        </div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-lilac-100 text-lilac-500 mb-4 shadow-inner">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lilac-600 to-pink-500 mb-2">
            LPS Collector
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isSignUp ? "Join the collection journey!" : "Welcome back, collector!"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-lilac-50/50 dark:bg-slate-800/50 border border-lilac-200 dark:border-slate-600 focus:ring-2 focus:ring-lilac-400 focus:border-transparent outline-none transition-all"
              placeholder="petshop@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-lilac-50/50 dark:bg-slate-800/50 border border-lilac-200 dark:border-slate-600 focus:ring-2 focus:ring-lilac-400 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-lilac-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                Please wait...
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-lilac-600 hover:text-lilac-700 font-semibold underline decoration-2 underline-offset-2 decoration-lilac-300 hover:decoration-lilac-500 transition-all"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;