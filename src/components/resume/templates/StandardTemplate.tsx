import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function StandardTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#000',
      padding: '48px',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      lineHeight: '1.3',
      fontSize: '10.5pt'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18pt', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: 'bold', color: '#000' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ fontSize: '9.5pt', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>|</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div style={{ fontSize: '9.5pt', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin.replace('https://', '')}</span>}
          {personalInfo.linkedin && personalInfo.portfolio && <span>|</span>}
          {personalInfo.portfolio && <span>Portfolio: {personalInfo.portfolio.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Technical Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontWeight: 'bold' }}>Core Competencies: </span>
            {skills.map((skill, idx) => (
              <span key={idx}>{skill}{idx < skills.length - 1 ? ',' : ''}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Education
          </h2>
          <div>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{edu.institution}</span>
                  {edu.score && <span style={{ fontWeight: 'bold' }}>GPA / Score: {edu.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Work Experience
          </h2>
          <div>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{exp.position}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>
                  {exp.company}
                </div>
                {exp.description && (
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{bullet.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Projects
          </h2>
          <div>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{proj.title}</span>
                  {proj.link && <span>{proj.link.replace('https://', '')}</span>}
                </div>
                <div style={{ marginBottom: '4px', fontSize: '9.5pt' }}>
                  <span style={{ fontWeight: 'bold' }}>Technologies: </span>{proj.technologies}
                </div>
                {proj.description && (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{bullet.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Certifications
          </h2>
          <div>
            {certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span><span style={{ fontWeight: 'bold' }}>{cert.name}</span>, {cert.issuer}</span>
                {cert.date && <span>{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Achievements
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {achievements.map((ach, idx) => (
              <li key={idx} style={{ marginBottom: '3px' }}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages & Interests */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <div style={{ marginBottom: '18px', color: '#000' }}>
          <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#000' }}>
            Additional Information
          </h2>
          <div>
            {languages && languages.length > 0 && <div style={{ marginBottom: '4px' }}><span style={{ fontWeight: 'bold' }}>Languages: </span>{languages.join(', ')}</div>}
            {interests && interests.length > 0 && <div><span style={{ fontWeight: 'bold' }}>Interests: </span>{interests.join(', ')}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
