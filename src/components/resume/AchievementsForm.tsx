import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';

export function AchievementsForm() {
  const { data, updateData } = useResume();
  const achievements = data.achievements || [];

  const handleAdd = () => {
    updateData({ achievements: [...achievements, ''] });
  };

  const handleUpdate = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    updateData({ achievements: updated });
  };

  const handleRemove = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index);
    updateData({ achievements: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Achievements</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Add notable awards, scholarships, or competition rankings.
      </p>

      <div style={{ 
        background: 'var(--color-subtle-surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-base)', 
        border: '1px solid var(--color-structural-border)'
      }}>
        {achievements.map((ach, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text" 
              value={ach} 
              onChange={(e) => handleUpdate(index, e.target.value)}
              style={{ flex: 1, padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
              placeholder="Secured 1st place in a college hackathon"
            />
            <Button variant="ghost" onClick={() => handleRemove(index)} style={{ color: 'var(--color-error)' }}>
              X
            </Button>
          </div>
        ))}

        <Button variant="secondary" onClick={handleAdd} style={{ marginTop: '1rem' }}>
          + Add Achievement
        </Button>
      </div>
    </div>
  );
}
