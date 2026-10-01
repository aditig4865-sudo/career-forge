import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function IvyLeagueTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, skills, projects, certifications } = data;

  return (
    <div style={{ 
      fontFamily: '"Times New Roman", Times, serif', 
      color: '#000', 
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      background: '#fff',
      lineHeight: 1.4
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>{personalInfo.fullName}</h1>
        <div style={{ fontSize: '11px' }}>
          {personalInfo.address && <span>{personalInfo.address} • </span>}
          {personalInfo.phone && <span>{personalInfo.phone} • </span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
        </div>
        <div style={{ fontSize: '11px', marginTop: '2px' }}>
          {personalInfo.linkedin && <span style={{ marginRight: '8px' }}>LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', margin: '0 0 8px 0', paddingBottom: '2px' }}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{edu.institution}</span>
                <span>{edu.location || edu.startDate + ' - ' + edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic' }}>
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                {edu.score && <span>GPA/Score: {edu.score}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', margin: '0 0 8px 0', paddingBottom: '2px' }}>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '12px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{exp.company}</span>
                <span>{exp.location || exp.startDate + ' - ' + exp.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{exp.position}</div>
              <ul style={{ margin: '0', paddingLeft: '16px' }}>
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{line.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', margin: '0 0 8px 0', paddingBottom: '2px' }}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '10px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{proj.name}</span>
                {proj.date && <span>{proj.date}</span>}
              </div>
              {proj.technologies && <div style={{ fontStyle: 'italic', marginBottom: '2px' }}>{proj.technologies}</div>}
              <ul style={{ margin: '0', paddingLeft: '16px' }}>
                {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{line.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', margin: '0 0 8px 0', paddingBottom: '2px' }}>Skills & Interests</h2>
          <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
            <span style={{ fontWeight: 'bold' }}>Skills: </span>
            <span>{skills.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', margin: '0 0 8px 0', paddingBottom: '2px' }}>Certifications</h2>
          <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '11px' }}>
            {certifications.map((cert, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                <span style={{ fontWeight: 'bold' }}>{cert.name}</span> - {cert.issuer} {cert.date && `(${cert.date})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
