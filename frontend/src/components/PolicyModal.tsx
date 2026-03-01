import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

const PRIVACY_POLICY = `
TRANQUIL Privacy Policy
Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

1. INFORMATION WE COLLECT
TRANQUIL collects the following categories of personal health data:
• Biometric data: heart rate, skin temperature, motion/activity levels
• Mental wellness data: stress scores, mood journal entries, notes
• Sleep data: bedtime, wake time, sleep duration, quality ratings
• Breathing session records: technique used, duration
• Device information: paired wearable device identifiers
• Account data: display name, avatar preference

2. HOW WE USE YOUR DATA
Your data is used exclusively to:
• Provide personalized stress and wellness insights
• Generate trend analysis and improvement recommendations
• Enable AI-powered wellness predictions (when enabled)
• Sync data across your authenticated sessions

3. DATA STORAGE & SECURITY
All data is stored on the Internet Computer (ICP) blockchain — a decentralized, cryptographically secured platform. Your data is:
• Encrypted at rest using ICP's native security model
• Accessible only through your authenticated Internet Identity
• Never stored on centralized servers or third-party cloud providers
• Not accessible to TRANQUIL developers or any third parties

4. YOUR RIGHTS (GDPR & Indian IT Act Compliance)
You have the right to:
• Access: View all stored data via the Privacy Dashboard
• Portability: Download your data in JSON, CSV, or PDF format
• Erasure: Permanently delete your account and all associated data
• Rectification: Update or correct your personal information
• Restriction: Toggle analytics and AI prediction features on/off

5. DATA RETENTION
• Active accounts: Data retained indefinitely until user deletion
• Deleted accounts: All data permanently removed within 30 days
• No backups are retained after account deletion

6. THIRD-PARTY SHARING
TRANQUIL does NOT share, sell, or transfer your personal data to any third parties. No advertising networks, analytics services, or data brokers have access to your information.

7. CHILDREN'S PRIVACY
TRANQUIL is not intended for users under 13 years of age. We do not knowingly collect data from children.

8. CONTACT
For privacy-related inquiries, please contact us through the app's feedback mechanism.
`;

const TERMS_OF_SERVICE = `
TRANQUIL Terms & Conditions
Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

1. ACCEPTANCE OF TERMS
By using TRANQUIL, you agree to these Terms & Conditions. If you do not agree, please do not use the application.

2. DESCRIPTION OF SERVICE
TRANQUIL is a mental wellness application that connects to a stress-relief wearable band via Bluetooth Low Energy (BLE) to monitor and help manage stress levels. The app provides:
• Real-time stress monitoring and visualization
• Guided breathing exercises
• Mood journaling
• Sleep tracking
• Personalized wellness tips

3. HEALTH DISCLAIMER
TRANQUIL is a wellness tool and is NOT a medical device. It is not intended to diagnose, treat, cure, or prevent any medical condition. Always consult a qualified healthcare professional for medical advice.

4. USER RESPONSIBILITIES
You agree to:
• Provide accurate information when setting up your profile
• Use the app for personal, non-commercial purposes only
• Not attempt to reverse-engineer or tamper with the application
• Keep your Internet Identity credentials secure

5. DATA OWNERSHIP
You retain full ownership of all personal data you input into TRANQUIL. We claim no ownership rights over your health data.

6. ACCOUNT DELETION
You may delete your account at any time through Settings > Privacy & Data Control. A 30-day grace period applies before permanent deletion.

7. LIMITATION OF LIABILITY
TRANQUIL is provided "as is" without warranties of any kind. We are not liable for any health decisions made based on app data.

8. CHANGES TO TERMS
We may update these terms periodically. Continued use of the app after changes constitutes acceptance of the new terms.

9. GOVERNING LAW
These terms are governed by applicable Indian IT laws and GDPR regulations where applicable.
`;

export function PolicyModal({ open, onClose, type }: PolicyModalProps) {
  const title = type === 'privacy' ? '🔒 Privacy Policy' : '📋 Terms & Conditions';
  const content = type === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 rounded-3xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold font-display text-foreground">
              {title}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 rounded-xl border border-border p-4 mt-2">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans pr-2">
            {content}
          </pre>
        </ScrollArea>

        <div className="flex-shrink-0 pt-3">
          <Button onClick={onClose} className="w-full rounded-xl">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
