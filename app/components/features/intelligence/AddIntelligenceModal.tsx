/**
 * @file AddIntelligenceModal.tsx
 * @description Modal for adding manual liquidity intelligence
 */

'use client';

import Modal from '@/app/components/ui/Modal';
import IntelligenceForm from './IntelligenceForm';

interface AddIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddIntelligenceModal({
  isOpen,
  onClose,
  onSuccess,
}: AddIntelligenceModalProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Liquidity Event"
      size="md"
    >
      <IntelligenceForm
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}
