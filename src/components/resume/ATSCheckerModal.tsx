import React, { useState } from 'react';
import { X, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useResume } from '../../context/ResumeContext';
import { checkATSMatch } from '../../services/resumeAi';

interface ATSCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ATSCheckerModal({ isOpen, onClose }: ATSCheckerModalProps) {
  const { data } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<{
    score: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const matchResult = await checkATSMatch(data, jobDescription);
      setResult(matchResult);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card className="modal-animate-in" style={{ width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={24} className="text-primary" /> 
          ATS Match Checker
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Paste the job description below to see how well your resume matches.
        </p>

        {!result ? (
          <>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              style={{
                width: '100%',
                height: '200px',
                padding: '1rem',
                backgroundColor: 'var(--color-canvas-base)',
                border: '1px solid var(--color-structural-border)',
                color: 'var(--color-text)',
                borderRadius: '8px',
                marginBottom: '1rem',
                resize: 'vertical'
              }}
            />
            {error && <p style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
            <Button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isAnalyzing ? (
                <>Analyzing Match...</>
              ) : (
                <>Analyze Resume</>
              )}
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--color-surface-elevation)', borderRadius: '8px', border: '1px solid var(--color-structural-border)' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Match Score</h3>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: result.score > 75 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#ef4444', marginTop: '0.5rem' }}>
                {result.score}%
              </div>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', marginBottom: '0.75rem' }}>
                <CheckCircle size={18} /> Matching Keywords
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.matchingKeywords.length > 0 ? result.matchingKeywords.map((kw, i) => (
                  <span key={i} style={{ padding: '4px 10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', fontSize: '0.875rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {kw}
                  </span>
                )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None found.</span>}
              </div>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', marginBottom: '0.75rem' }}>
                <XCircle size={18} /> Missing Keywords
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                  <span key={i} style={{ padding: '4px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {kw}
                  </span>
                )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>None missing!</span>}
              </div>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '0.75rem' }}>
                <AlertCircle size={18} /> Suggestions to Improve
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <Button onClick={() => setResult(null)} variant="secondary" style={{ marginTop: '1rem', width: '100%' }}>
              Check Another Job Description
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
