import React, { useState } from 'react';
import { CheckCircle2, Clock, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetConsents, useRecordConsent } from '../hooks/useQueries';
import { ConsentType } from '../backend';
import PolicyModal from './PolicyModal';

type PolicyType = 'privacy' | 'terms';

export default function ComplianceCard() {
  const { data: consents, isLoading } = useGetConsents();
  const recordConsentMutation = useRecordConsent();
  const [policyModal, setPolicyModal] = useState<PolicyType | null>(null);

  const getConsentRecord = (type: ConsentType) => {
    return consents?.find((c) => c.consentType === type) ?? null;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAccept = async (consentType: ConsentType) => {
    await recordConsentMutation.mutateAsync(consentType);
    // Also store in localStorage as a fallback
    localStorage.setItem(`consent_${consentType}`, new Date().toISOString());
  };

  const privacyConsent = getConsentRecord(ConsentType.privacyPolicy);
  const termsConsent = getConsentRecord(ConsentType.termsOfService);

  const consentItems = [
    {
      type: ConsentType.privacyPolicy,
      label: 'Privacy Policy',
      policyType: 'privacy' as PolicyType,
      record: privacyConsent,
    },
    {
      type: ConsentType.termsOfService,
      label: 'Terms of Service',
      policyType: 'terms' as PolicyType,
      record: termsConsent,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {consentItems.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-4 rounded-xl bg-background border border-border"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.record ? 'bg-green-500/10' : 'bg-muted'
                    }`}
                  >
                    {item.record ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    {item.record ? (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        Accepted {formatDate(item.record.timestamp)}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">Not yet accepted</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPolicyModal(item.policyType)}
                    className="text-primary hover:text-primary hover:bg-primary/10 text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  {!item.record && (
                    <Button
                      size="sm"
                      onClick={() => handleAccept(item.type)}
                      disabled={recordConsentMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-xs"
                    >
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              We adhere to{' '}
              <span className="font-semibold text-foreground">GDPR principles</span> and{' '}
              <span className="font-semibold text-foreground">Indian IT data protection standards</span>{' '}
              to ensure your mental health data is secure and under your control. Your consent is
              tracked with timestamps for full transparency.
            </p>
          </div>
        </div>
      </div>

      {policyModal && (
        <PolicyModal
          open={policyModal !== null}
          onOpenChange={(open) => !open && setPolicyModal(null)}
          type={policyModal}
        />
      )}
    </>
  );
}
