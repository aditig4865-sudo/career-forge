import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function MinimalTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      padding: '50px 70px',
      fontSize: '9.5pt',
      lineHeight: '1.7',
      fontWeight: 300
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 200, margin: '0 0 8px 0', letterSpacing: '-0.5px', color: '#000' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '9pt', color: '#888' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Left Column (Main Content) */}
        <div style={{ flex: '2 1 0' }}>
          {experience.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ margin: 0, fontSize: '11pt', fontWeight: 500, color: '#111' }}>{exp.position}</h4>
                    <span style={{ fontSize: '8.5pt', color: '#999' }}>{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '9.5pt', color: '#555', marginBottom: '8px' }}>{exp.company}</div>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ margin: 0, fontSize: '11pt', fontWeight: 500, color: '#111' }}>{proj.title}</h4>
                    {proj.link && <span style={{ fontSize: '8.5pt', color: '#999' }}>{proj.link}</span>}
                  </div>
                  <div style={{ fontSize: '8.5pt', color: '#777', marginBottom: '8px' }}>{proj.technologies}</div>
                  <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{proj.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ flex: '1 1 0' }}>
          {education.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 500, color: '#111' }}>{edu.degree}</h4>
                  <div style={{ color: '#555', fontSize: '9pt' }}>{edu.fieldOfStudy}</div>
                  <div style={{ color: '#888', fontSize: '8.5pt', marginTop: '4px' }}>{edu.institution}</div>
                  <div style={{ color: '#999', fontSize: '8.5pt' }}>{edu.startDate} — {edu.endDate}</div>
                  {edu.score && <div style={{ color: '#777', fontSize: '8.5pt', marginTop: '2px' }}>{edu.score}</div>}
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {skills.map((skill, idx) => (
                  <div key={idx} style={{ color: '#333' }}>{skill}</div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Certifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <div style={{ fontWeight: 500, color: '#111' }}>{cert.name}</div>
                    <div style={{ fontSize: '8.5pt', color: '#888' }}>{cert.issuer} {cert.date && `• ${cert.date}`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontWeight: 500 }}>Languages</h2>
              <div style={{ color: '#333' }}>{languages.join(', ')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
