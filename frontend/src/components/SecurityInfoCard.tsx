import React from 'react';
import { Lock, Bluetooth, Shield, Fingerprint, Globe, ShieldCheck, Key } from 'lucide-react';

const securityFeatures = [
  {
    icon: <Lock className="w-5 h-5 text-primary" />,
    title: 'AES-256 Encryption',
    description: 'All stored data is encrypted using AES-256, the gold standard for data security.',
  },
  {
    icon: <Bluetooth className="w-5 h-5 text-primary" />,
    title: 'Encrypted BLE Communication',
    description: 'Bluetooth Low Energy data is encrypted end-to-end between your device and band.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    title: 'Security Rules Enforcement',
    description: 'Strict access control rules ensure only you can read or modify your data.',
  },
  {
    icon: <Key className="w-5 h-5 text-primary" />,
    title: 'Multi-Factor Authentication',
    description: 'Optional MFA adds an extra layer of protection to your account.',
  },
  {
    icon: <Fingerprint className="w-5 h-5 text-primary" />,
    title: 'Biometric Re-Authentication',
    description: 'Sensitive actions require biometric confirmation for added security.',
  },
  {
    icon: <Globe className="w-5 h-5 text-primary" />,
    title: 'HTTPS Secure Backend',
    description: 'All communications use HTTPS with TLS 1.3 to prevent interception.',
  },
];

export default function SecurityInfoCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {securityFeatures.map((feature) => (
        <div
          key={feature.title}
          className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            {feature.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{feature.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
