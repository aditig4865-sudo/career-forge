import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function CertificationsForm() {
  const { data, updateData } = useResume();
  const certifications = data.certifications || [];

  const handleAdd = () => {
    const newCert = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: ''
    };
    updateData({ certifications: [...certifications, newCert] });
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    updateData({ certifications: updated });
  };

  const handleRemove = (id: string) => {
    const updated = certifications.filter(cert => cert.id !== id);
    updateData({ certifications: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Certifications</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Add any relevant certifications, licenses, or online courses.
      </p>

      {certifications.map((cert, index) => (
        <div key={cert.id} style={{ 
          background: 'var(--color-subtle-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-base)', 
          marginBottom: '1rem',
          border: '1px solid var(--color-structural-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Certification {index + 1}</h3>
            <Button variant="ghost" onClick={() => handleRemove(cert.id)} style={{ color: 'var(--color-error)' }}>
              Remove
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Certification Name</label>
              <input 
                type="text" 
                value={cert.name} 
                onChange={(e) => handleUpdate(cert.id, 'name', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="Python Programming Certificate"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Issuing Organization</label>
              <input 
                type="text" 
                value={cert.issuer} 
                onChange={(e) => handleUpdate(cert.id, 'issuer', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="Certification Provider"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date Earned</label>
              <DatePicker
                selected={cert.date ? new Date(cert.date) : null}
                onChange={(date: Date | null) => handleUpdate(cert.id, 'date', date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                customInput={
                  <input style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }} />
                }
                placeholderText="Select Month & Year"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={handleAdd} style={{ width: '100%' }}>
        + Add Certification
      </Button>
    </div>
  );
}
