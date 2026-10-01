import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useResume } from '../../context/ResumeContext';
import { generateResume } from '../../services/resumeAi';
import { Wand2, Loader2 } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIGeneratorModal({ isOpen, onClose }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateData } = useResume();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const generatedData = await generateResume(prompt);
      updateData(generatedData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the resume.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card className="modal-animate-in" style={{ width: '500px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wand2 size={24} color="var(--color-primary)" />
          Generate Resume with AI
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
          Describe your background, skills, and the role you are targeting. Our AI will automatically structure and format a resume for you!
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., I am a Software Engineer with 3 years of experience in React and Node.js. I previously worked at TechCorp and have a B.S. in Computer Science..."
            style={{ 
              width: '100%', 
              height: '120px', 
              padding: '0.75rem', 
              background: 'var(--color-surface-elevation)', 
              border: '1px solid var(--color-structural-border)', 
              color: 'white', 
              borderRadius: '4px',
              resize: 'none',
              fontFamily: 'inherit'
            }}
            disabled={isGenerating}
            autoFocus
          />
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={onClose} disabled={isGenerating} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 'Generate'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
