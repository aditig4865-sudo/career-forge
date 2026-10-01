import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function ProfessionalTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      color: '#222',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      display: 'flex',
      fontSize: '10.5pt',
      lineHeight: '1.5'
    }}>
      
      {/* Left Sidebar (Light Gray) */}
      <div style={{ width: '32%', backgroundColor: '#f8f9fa', padding: '48px 32px', borderRight: '1px solid #eaeaea' }}>
        <h1 style={{ fontSize: '22pt', margin: '0 0 16px 0', fontWeight: 'bold', color: '#111', lineHeight: '1.1' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        
        <div style={{ marginBottom: '32px', fontSize: '9.5pt', display: 'flex', flexDirection: 'column', gap: '10px', color: '#444' }}>
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin.replace('https://', '')}</div>}
          {personalInfo.portfolio && <div>{personalInfo.portfolio.replace('https://', '')}</div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '11pt', color: '#111', borderBottom: '2px solid #ddd', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Skills
            </h2>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '9.5pt', color: '#444' }}>
              {skills.map((skill, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education (Sidebar) */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', color: '#111', borderBottom: '2px solid #ddd', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Education
            </h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', color: '#111', fontSize: '10.5pt', marginBottom: '4px' }}>{edu.degree}</div>
                <div style={{ fontSize: '9.5pt', color: '#444', marginBottom: '2px' }}>{edu.institution}</div>
                <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>{edu.startDate} – {edu.endDate}</div>
                {edu.score && <div style={{ fontSize: '9pt', color: '#555', marginTop: '2px', fontWeight: 'bold' }}>GPA: {edu.score}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Languages & Interests (Sidebar) */}
        {(languages?.length > 0 || interests?.length > 0) && (
          <div style={{ marginTop: '16px' }}>
            <h2 style={{ fontSize: '11pt', color: '#111', borderBottom: '2px solid #ddd', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Additional Info
            </h2>
            {languages && languages.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', color: '#111', fontSize: '9.5pt', marginBottom: '4px' }}>Languages</div>
                <div style={{ fontSize: '9.5pt', color: '#444' }}>{languages.join(', ')}</div>
              </div>
            )}
            {interests && interests.length > 0 && (
              <div>
                <div style={{ fontWeight: 'bold', color: '#111', fontSize: '9.5pt', marginBottom: '4px' }}>Interests</div>
                <div style={{ fontSize: '9.5pt', color: '#444' }}>{interests.join(', ')}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ width: '68%', padding: '48px 40px' }}>
        
        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14pt', color: '#111', borderBottom: '2px solid #111', paddingBottom: '6px', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              Experience
            </h2>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', margin: 0, color: '#111' }}>{exp.position}</h3>
                  <span style={{ fontSize: '9.5pt', color: '#666', fontWeight: 'bold' }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '10.5pt', color: '#333', marginBottom: '10px', fontWeight: '600' }}>{exp.company}</div>
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
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14pt', color: '#111', borderBottom: '2px solid #111', paddingBottom: '6px', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              Projects
            </h2>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '11.5pt', fontWeight: 'bold', margin: 0, color: '#111' }}>{proj.title}</h3>
                  {proj.link && <span style={{ fontSize: '9.5pt', color: '#666' }}>{proj.link.replace('https://', '')}</span>}
                </div>
                <div style={{ fontSize: '9.5pt', color: '#555', marginBottom: '8px', fontWeight: '600' }}>Technologies: {proj.technologies}</div>
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

        {/* Certifications & Achievements */}
        {(certifications?.length > 0 || achievements?.length > 0) && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14pt', color: '#111', borderBottom: '2px solid #111', paddingBottom: '6px', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              Awards & Certifications
            </h2>
            {certifications && certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '11.5pt', fontWeight: 'bold', margin: 0, color: '#111' }}>{cert.name}</h3>
                  {cert.date && <span style={{ fontSize: '9.5pt', color: '#666' }}>{cert.date}</span>}
                </div>
                <div style={{ fontSize: '9.5pt', color: '#555', fontWeight: '600' }}>{cert.issuer}</div>
              </div>
            ))}
            {achievements && achievements.length > 0 && (
              <ul style={{ margin: '12px 0 0 0', paddingLeft: '18px', color: '#444' }}>
                {achievements.map((ach, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{ach}</li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
