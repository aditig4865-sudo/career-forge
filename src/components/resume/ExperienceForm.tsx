import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function ExperienceForm() {
  const { data, updateData } = useResume();
  const experiences = data.experience || [];

  const handleAdd = () => {
    const newExp = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateData({ experience: [...experiences, newExp] });
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateData({ experience: updated });
  };

  const handleRemove = (id: string) => {
    const updated = experiences.filter(exp => exp.id !== id);
    updateData({ experience: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Work Experience</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        List your relevant work experience. Start with your most recent role. Use bullet points for descriptions.
      </p>

      {experiences.map((exp, index) => (
        <div key={exp.id} style={{ 
          background: 'var(--color-subtle-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-base)', 
          marginBottom: '1rem',
          border: '1px solid var(--color-structural-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Experience {index + 1}</h3>
            <Button variant="ghost" onClick={() => handleRemove(exp.id)} style={{ color: 'var(--color-error)' }}>
              Remove
            </Button>
          </div>

          <div className="form-grid form-grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Job Title / Position</label>
              <input 
                type="text" 
                value={exp.position} 
                onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="Web Development Intern"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Company / Organization</label>
              <input 
                type="text" 
                value={exp.company} 
                onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="form-grid form-grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date</label>
              <DatePicker
                selected={exp.startDate ? new Date(exp.startDate) : null}
                onChange={(date: Date | null) => handleUpdate(exp.id, 'startDate', date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                customInput={
                  <input style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }} />
                }
                placeholderText="Select Month & Year"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Date</label>
              {exp.endDate === 'Present' ? (
                <div style={{ padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px', opacity: 0.7, marginBottom: '0.5rem' }}>Present</div>
              ) : (
                <div style={{ marginBottom: '0.5rem' }}>
                  <DatePicker
                    selected={exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : null}
                    onChange={(date: Date | null) => handleUpdate(exp.id, 'endDate', date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    customInput={
                      <input style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }} />
                    }
                    placeholderText="Select Month & Year"
                  />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={exp.endDate === 'Present'}
                  onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.checked ? 'Present' : '')}
                />
                Currently working here
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description & Achievements</label>
            <textarea 
              value={exp.description} 
              onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px', resize: 'vertical' }}
              placeholder="Developed responsive web pages using React."
            />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={handleAdd} style={{ width: '100%' }}>
        + Add Experience
      </Button>
    </div>
  );
}
