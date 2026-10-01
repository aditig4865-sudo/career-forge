import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CareerPath } from '../../services/recommendationEngine';

interface Props {
  career: CareerPath;
}

export function CareerPathCard({ career }: Props) {
  return (
    <Card className="mb-lg">
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{career.title}</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-neutral)' }}>{career.overview}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Required Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {career.requiredSkills.map(skill => (
              <Badge key={skill} variant="skill">{skill}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Education Paths</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-muted-text)' }}>
            {career.educationPaths.map((path, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{path}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Career Roadmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {career.roadmap.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '24px', height: '24px', 
                borderRadius: '50%', backgroundColor: 'var(--color-tertiary)', 
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 
              }}>
                {idx + 1}
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem', paddingTop: '2px' }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
