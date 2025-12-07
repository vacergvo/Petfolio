import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-lilac-200 via-lilac-300 to-lilac-500">
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-pop-pink/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(147,51,234,0.25)] w-full max-w-md border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-2 flex items-center justify-center animate-float">
            <img 
              src="images/lps-logo.png" 
              alt="LPS Logo" 
              className="h-28 w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-sm font-bold text-lilac-700 mb-2 ml-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-lilac-100 bg-lilac-50/50 focus:bg-white focus:border-lilac-400 focus:ring-4 focus:ring-lilac-200 transition-all outline-none text-lilac-900 font-medium placeholder-lilac-300"
              placeholder="lps.collector@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-lilac-700 mb-2 ml-2">Secret Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-lilac-100 bg-lilac-50/50 focus:bg-white focus:border-lilac-400 focus:ring-4 focus:ring-lilac-200 transition-all outline-none text-lilac-900 font-medium placeholder-lilac-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-sm text-center font-bold border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-lilac-500 to-lilac-700 text-white font-bold text-xl shadow-xl shadow-lilac-500/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Opening Portal...' : (isLogin ? 'Enter Collection' : 'Start Collecting')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-lilac-500 hover:text-lilac-700 font-bold text-sm transition-colors decoration-2 hover:underline underline-offset-4"
          >
            {isLogin ? "Need a collector pass? Sign up" : "Have a pass? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};