import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';

export function ProjectsForm() {
  const { data, updateData } = useResume();
  const projects = data.projects || [];

  const handleAdd = () => {
    const newProj = {
      id: crypto.randomUUID(),
      title: '',
      technologies: '',
      link: '',
      description: ''
    };
    updateData({ projects: [...projects, newProj] });
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    updateData({ projects: updated });
  };

  const handleRemove = (id: string) => {
    const updated = projects.filter(proj => proj.id !== id);
    updateData({ projects: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Projects</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Highlight personal, academic, or open-source projects.
      </p>

      {projects.map((proj, index) => (
        <div key={proj.id} style={{ 
          background: 'var(--color-subtle-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-base)', 
          marginBottom: '1rem',
          border: '1px solid var(--color-structural-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Project {index + 1}</h3>
            <Button variant="ghost" onClick={() => handleRemove(proj.id)} style={{ color: 'var(--color-error)' }}>
              Remove
            </Button>
          </div>

          <div className="form-grid form-grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Project Name</label>
              <input 
                type="text" 
                value={proj.title} 
                onChange={(e) => handleUpdate(proj.id, 'title', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder={index === 0 ? "Resume Builder" : "Career Guidance"}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Technologies Used</label>
              <input 
                type="text" 
                value={proj.technologies} 
                onChange={(e) => handleUpdate(proj.id, 'technologies', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder={index === 0 ? "Python, Django, HTML, CSS" : "Python, React, JavaScript"}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
            <textarea 
              value={proj.description} 
              onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px', resize: 'vertical' }}
              placeholder={index === 0 ? "A web application for creating professional resumes." : "A platform that helps students explore suitable career paths."}
            />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={handleAdd} style={{ width: '100%' }}>
        + Add Project
      </Button>
    </div>
  );
}
