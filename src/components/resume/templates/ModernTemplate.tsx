import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function ModernTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: '"Outfit", "Inter", sans-serif',
      color: '#333',
      padding: '48px',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      lineHeight: '1.5',
      fontSize: '10.5pt'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26pt', margin: '0 0 8px 0', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9.5pt', color: '#555' }}>
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span style={{ color: 'var(--color-primary)', fontWeight: '500' }}>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace('https://', '')}</span>}
          {personalInfo.portfolio && <span style={{ color: 'var(--color-primary)', fontWeight: '500' }}>{personalInfo.portfolio.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Experience
          </h2>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: '700', color: '#111' }}>{exp.position}</h3>
                <span style={{ fontSize: '9.5pt', color: '#777', fontWeight: '500' }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontSize: '10.5pt', color: '#444', marginBottom: '8px', fontWeight: '500' }}>{exp.company}</div>
              {exp.description && (
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#444' }}>
                  {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{bullet.replace(/^- /, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: '700', color: '#111' }}>{proj.title}</h3>
                {proj.link && <span style={{ fontSize: '9.5pt', color: 'var(--color-primary)', fontWeight: '500' }}>{proj.link.replace('https://', '')}</span>}
              </div>
              <div style={{ fontSize: '9.5pt', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{proj.technologies}</div>
              {proj.description && (
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#444' }}>
                  {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{bullet.replace(/^- /, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '11.5pt', fontWeight: '700', color: '#111' }}>{edu.degree} in {edu.fieldOfStudy}</h3>
                <span style={{ fontSize: '9.5pt', color: '#777', fontWeight: '500' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '10.5pt', color: '#444', fontWeight: '500' }}>{edu.institution}</div>
                {edu.score && <div style={{ fontSize: '9.5pt', color: '#666', fontWeight: '600' }}>GPA: {edu.score}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((skill, idx) => (
              <span key={idx} style={{ 
                background: '#f4f4f5', 
                border: '1px solid #e4e4e7',
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '9.5pt', 
                color: '#3f3f46',
                fontWeight: '500'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications?.length > 0 || achievements?.length > 0) && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Awards & Certifications
          </h2>
          {certifications && certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: '700', color: '#111' }}>{cert.name}</h3>
                {cert.date && <span style={{ fontSize: '9.5pt', color: '#777', fontWeight: '500' }}>{cert.date}</span>}
              </div>
              <div style={{ fontSize: '9.5pt', color: '#444' }}>{cert.issuer}</div>
            </div>
          ))}
          {achievements && achievements.length > 0 && (
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', color: '#444' }}>
              {achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{ach}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Additional Info */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 16px 0', fontWeight: '700', letterSpacing: '1px' }}>
            Additional Info
          </h2>
          {languages && languages.length > 0 && <div style={{ marginBottom: '6px', color: '#444' }}><span style={{ fontWeight: '700', color: '#111' }}>Languages: </span>{languages.join(' · ')}</div>}
          {interests && interests.length > 0 && <div style={{ color: '#444' }}><span style={{ fontWeight: '700', color: '#111' }}>Interests: </span>{interests.join(' · ')}</div>}
        </div>
      )}
    </div>
  );
}
