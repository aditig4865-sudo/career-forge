import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function TechTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  const monoFont = '"Fira Code", "Courier New", Courier, monospace';
  const accentColor = '#0EA5E9'; // Sky blue accent

  return (
    <div style={{
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      color: '#1e293b',
      backgroundColor: '#f8fafc',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      padding: '45px 55px',
      fontSize: '9.5pt',
      lineHeight: '1.6'
    }}>
      <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: monoFont, fontSize: '24pt', margin: '0 0 10px 0', color: '#0f172a', fontWeight: 700 }}>
            <span style={{ color: accentColor }}>const</span> {personalInfo.fullName?.replace(' ', '_') || 'dev_name'}
          </h1>
          <div style={{ fontFamily: monoFont, fontSize: '9pt', color: '#64748b', display: 'flex', gap: '15px' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: monoFont, fontSize: '9pt', color: '#0f172a' }}>
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          {personalInfo.portfolio && <div>{personalInfo.portfolio}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '35px' }}>
        
        {/* Main Column */}
        <div>
          {experience.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '13pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                {'>'} experience.map()
              </h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '18px', paddingLeft: '15px', borderLeft: `2px solid #cbd5e1` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '11.5pt', color: '#0f172a', fontWeight: 600 }}>{exp.position}</h4>
                    <span style={{ fontFamily: monoFont, fontSize: '8.5pt', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '10pt', color: '#334155', fontWeight: 500, marginBottom: '8px' }}>@ {exp.company}</div>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#475569' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '13pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                {'>'} projects.filter()
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '18px', paddingLeft: '15px', borderLeft: `2px solid #cbd5e1` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '11.5pt', color: '#0f172a', fontWeight: 600 }}>{proj.title}</h4>
                    {proj.link && <span style={{ fontFamily: monoFont, fontSize: '8.5pt', color: accentColor }}>{proj.link}</span>}
                  </div>
                  <div style={{ fontFamily: monoFont, fontSize: '8.5pt', color: '#64748b', marginBottom: '8px', padding: '3px 6px', background: '#e2e8f0', display: 'inline-block', borderRadius: '4px' }}>
                    {proj.technologies}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#475569' }}>{proj.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div>
          {skills.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '11pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                {'{'} skills {'}'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill, idx) => (
                  <span key={idx} style={{ fontFamily: monoFont, fontSize: '8.5pt', background: '#0f172a', color: '#f8fafc', padding: '4px 8px', borderRadius: '4px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '11pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                {'['} education {']'}
              </h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '10.5pt', color: '#0f172a', fontWeight: 600 }}>{edu.degree}</h4>
                  <div style={{ color: '#334155', fontSize: '9pt', margin: '2px 0' }}>{edu.fieldOfStudy}</div>
                  <div style={{ color: '#64748b', fontSize: '9pt' }}>{edu.institution}</div>
                  <div style={{ fontFamily: monoFont, fontSize: '8pt', color: '#94a3b8', marginTop: '2px' }}>{edu.startDate} - {edu.endDate} {edu.score ? `| ${edu.score}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '11pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                // certs
              </h2>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '9.5pt' }}>{cert.name}</div>
                  <div style={{ fontSize: '8.5pt', color: '#64748b' }}>{cert.issuer} {cert.date && `(${cert.date})`}</div>
                </div>
              ))}
            </div>
          )}
          
          {languages.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontFamily: monoFont, fontSize: '11pt', color: accentColor, marginBottom: '15px', fontWeight: 600 }}>
                // languages
              </h2>
              <div style={{ color: '#334155', fontSize: '9.5pt' }}>{languages.join(', ')}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
