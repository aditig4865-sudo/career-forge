import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function CreativeTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#333',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      display: 'flex',
      fontSize: '10pt',
      lineHeight: '1.5'
    }}>
      {/* Left Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#2B2D42', color: '#EDF2F4', padding: '40px 30px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 800, margin: '0 0 5px 0', lineHeight: 1.1, textTransform: 'uppercase', color: '#fff' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ fontSize: '11pt', color: '#8D99AE', marginBottom: '30px' }}>{personalInfo.location}</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '9.5pt', marginBottom: '40px' }}>
          {personalInfo.email && <div style={{ display: 'flex', gap: '8px' }}><span>✉</span> {personalInfo.email}</div>}
          {personalInfo.phone && <div style={{ display: 'flex', gap: '8px' }}><span>☎</span> {personalInfo.phone}</div>}
          {personalInfo.linkedin && <div style={{ display: 'flex', gap: '8px' }}><span>in</span> {personalInfo.linkedin}</div>}
          {personalInfo.portfolio && <div style={{ display: 'flex', gap: '8px' }}><span>🔗</span> {personalInfo.portfolio}</div>}
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '2px solid #EF233C', paddingBottom: '5px', marginBottom: '15px' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, index) => (
                <span key={index} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '2px solid #EF233C', paddingBottom: '5px', marginBottom: '15px' }}>Languages</h3>
            <div>
              {languages.map((lang, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>{lang}</div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '2px solid #EF233C', paddingBottom: '5px', marginBottom: '15px' }}>Certifications</h3>
            <div>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>{cert.name}</div>
                  <div style={{ fontSize: '9pt', color: '#8D99AE' }}>{cert.issuer} {cert.date && `(${cert.date})`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '2px solid #EF233C', paddingBottom: '5px', marginBottom: '15px' }}>Interests</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interests.map((interest, index) => (
                <span key={index} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{interest}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px 40px' }}>
        {experience.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16pt', color: '#2B2D42', borderBottom: '2px solid #EDF2F4', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '12pt', color: '#EF233C' }}>{exp.position}</h4>
                  <span style={{ fontSize: '9pt', color: '#666', fontWeight: 600 }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div style={{ fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>{exp.company}</div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16pt', color: '#2B2D42', borderBottom: '2px solid #EDF2F4', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '12pt', color: '#EF233C' }}>{proj.title}</h4>
                  {proj.link && <span style={{ fontSize: '9pt' }}>{proj.link}</span>}
                </div>
                <div style={{ fontSize: '9pt', fontWeight: 600, color: '#666', marginBottom: '6px' }}>{proj.technologies}</div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{proj.description}</div>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16pt', color: '#2B2D42', borderBottom: '2px solid #EDF2F4', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '11pt', color: '#2B2D42' }}>{edu.degree} in {edu.fieldOfStudy}</h4>
                  <span style={{ fontSize: '9pt', color: '#666', fontWeight: 600 }}>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div style={{ color: '#666', marginTop: '4px' }}>{edu.institution} {edu.score ? `| Score: ${edu.score}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {achievements.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16pt', color: '#2B2D42', borderBottom: '2px solid #EDF2F4', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Achievements</h2>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#444' }}>
              {achievements.map((ach, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>{ach}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
