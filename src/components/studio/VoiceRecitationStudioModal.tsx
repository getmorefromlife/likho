import React from 'react';
import { PoemDraft, VoiceRecordingMeta } from '../../types/editor';
import { VoiceRecitationStudioPage } from './VoiceRecitationStudioPage';

interface VoiceRecitationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: PoemDraft;
  fontFamily: string;
  onSaveVoiceRecording: (recording?: VoiceRecordingMeta) => void;
}

export const VoiceRecitationStudioModal: React.FC<VoiceRecitationStudioModalProps> = ({
  isOpen,
  onClose,
  draft,
  fontFamily,
  onSaveVoiceRecording,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[var(--bg-canvas)]">
      <VoiceRecitationStudioPage
        draft={draft}
        fontFamily={fontFamily}
        onSaveVoiceRecording={onSaveVoiceRecording}
        onExit={onClose}
      />
    </div>
  );
};

export default VoiceRecitationStudioModal;
