import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText } from 'lucide-react';

interface PolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'privacy' | 'terms';
}

const privacyPolicyContent = `
## Privacy Policy

**Last updated: March 1, 2026**

### 1. Introduction
TRANQUIL ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your mental health data.

### 2. Data We Collect
- **Profile Information**: Your display name and avatar preference.
- **Health Data**: Stress readings, mood entries, sleep data, and breathing session records.
- **Device Data**: Vibration commands and device pairing history.
- **Usage Data**: App interaction patterns (anonymized).

### 3. How We Use Your Data
- To provide personalized wellness insights and recommendations.
- To track your mental health trends over time.
- To improve the TRANQUIL experience.
- We **never** sell or share your data with third parties without your explicit consent.

### 4. Data Storage & Security
- All data is stored on the Internet Computer blockchain, which provides cryptographic security.
- Data is encrypted using AES-256 at rest.
- All communications use HTTPS with TLS 1.3.
- Biometric re-authentication is required for sensitive operations.

### 5. Your Rights (GDPR & Indian IT Act)
- **Right to Access**: Download all your data at any time via "Download My Data".
- **Right to Erasure**: Delete your account and all associated data permanently.
- **Right to Portability**: Export your data in JSON, CSV, or PDF format.
- **Right to Rectification**: Update your profile and data at any time.
- **Right to Object**: Opt out of any data processing at any time.

### 6. Data Retention
- Your data is retained as long as your account is active.
- Upon account deletion, all data is permanently erased within 30 seconds (or after the optional 7-day recovery period).
- Anonymized deletion events are logged for compliance purposes (no personal data).

### 7. Consent
- We track your consent to this Privacy Policy and our Terms of Service with timestamps.
- You can withdraw consent at any time by deleting your account.

### 8. Contact
For privacy-related queries, please contact us through the app's support channel.

### 9. Compliance
This policy complies with:
- EU General Data Protection Regulation (GDPR)
- Indian Information Technology Act, 2000 and IT (Amendment) Act, 2008
- Indian Personal Data Protection principles
`;

const termsOfServiceContent = `
## Terms of Service

**Last updated: March 1, 2026**

### 1. Acceptance of Terms
By using TRANQUIL, you agree to these Terms of Service. If you do not agree, please do not use the app.

### 2. Description of Service
TRANQUIL is a mental wellness application that helps you track stress, mood, sleep, and breathing patterns using wearable device integration.

### 3. User Responsibilities
- You are responsible for maintaining the confidentiality of your account.
- You agree to provide accurate information.
- You will not use the app for any unlawful purpose.
- You will not attempt to reverse-engineer or compromise the app's security.

### 4. Health Disclaimer
- TRANQUIL is a wellness tool, **not a medical device**.
- The app does not provide medical advice, diagnosis, or treatment.
- Always consult a qualified healthcare professional for medical concerns.
- Do not rely solely on TRANQUIL for mental health management.

### 5. Data Ownership
- **You own your data**. TRANQUIL does not claim ownership of any personal data you provide.
- You grant TRANQUIL a limited license to process your data solely to provide the service.
- You can export or delete your data at any time.

### 6. Intellectual Property
- The TRANQUIL app, design, and technology are owned by TRANQUIL and protected by intellectual property laws.
- You may not copy, modify, or distribute the app without permission.

### 7. Limitation of Liability
- TRANQUIL is provided "as is" without warranties of any kind.
- We are not liable for any indirect, incidental, or consequential damages.
- Our total liability is limited to the amount you paid for the service (if any).

### 8. Termination
- You may terminate your account at any time via the "Delete Account" feature.
- We reserve the right to terminate accounts that violate these terms.

### 9. Changes to Terms
- We may update these terms from time to time.
- Continued use of the app after changes constitutes acceptance of the new terms.
- We will notify you of significant changes.

### 10. Governing Law
- These terms are governed by the laws of India.
- Disputes will be resolved under the jurisdiction of Indian courts.

### 11. Contact
For questions about these terms, please contact us through the app's support channel.
`;

export default function PolicyModal({ open, onOpenChange, type }: PolicyModalProps) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const content = isPrivacy ? privacyPolicyContent : termsOfServiceContent;
  const Icon = isPrivacy ? Shield : FileText;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold text-foreground mt-2 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base font-semibold text-foreground mt-5 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        const parts = line.replace('- ', '').split('**');
        return (
          <li key={i} className="text-sm text-muted-foreground ml-4 mb-1 list-disc">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </li>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="text-sm font-semibold text-foreground mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      const parts = line.split('**');
      return (
        <p key={i} className="text-sm text-muted-foreground mb-1 leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-foreground">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Please read this document carefully. It describes your rights and our obligations.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-1 pb-4">{renderContent(content)}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
