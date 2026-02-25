import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 tranquil-gradient opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center max-w-sm w-full">
        {/* Logo */}
        <div className="animate-float">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center shadow-glow mb-2">
            <span className="text-4xl">🧘</span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">TRANQUIL</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Your personal stress relief companion. Monitor, breathe, and find your calm.
          </p>
        </div>

        {/* Features */}
        <div className="w-full space-y-3">
          {[
            { emoji: '💓', text: 'Real-time stress monitoring' },
            { emoji: '🌬️', text: 'Guided breathing exercises' },
            { emoji: '📊', text: 'Weekly wellness analytics' },
            { emoji: '🌙', text: 'Sleep quality tracking' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border">
              <span className="text-lg">{f.emoji}</span>
              <span className="text-sm text-foreground/80">{f.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base
            shadow-glow hover:opacity-90 active:scale-[0.98] transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            'Get Started'
          )}
        </button>

        <p className="text-xs text-muted-foreground">
          Secure login powered by Internet Identity
        </p>
      </div>
    </div>
  );
}
