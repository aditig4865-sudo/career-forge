import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function ClassicTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: '"Times New Roman", Times, serif',
      color: '#111',
      padding: '48px',
      backgroundColor: '#fff',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      lineHeight: '1.4',
      fontSize: '11pt'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20pt', margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 'bold', color: '#000', letterSpacing: '1px' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ fontSize: '10pt', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', color: '#333' }}>
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && (personalInfo.phone || personalInfo.email) && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>|</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace('https://', '')}</span>}
          {personalInfo.linkedin && personalInfo.portfolio && <span>|</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.institution}</span>
                <span style={{ fontSize: '10pt' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <span style={{ fontStyle: 'italic' }}>{edu.degree} in {edu.fieldOfStudy}</span>
                {edu.score && <span>GPA: {edu.score}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Professional Experience
          </h2>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{exp.company}</span>
                <span style={{ fontSize: '10pt' }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '6px' }}>{exp.position}</div>
              {exp.description && (
                <ul style={{ margin: 0, paddingLeft: '24px', paddingRight: '12px' }}>
                  {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{bullet.replace(/^- /, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{proj.title}</span>
                {proj.link && <span style={{ fontSize: '10pt' }}>{proj.link.replace('https://', '')}</span>}
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '6px', fontSize: '10.5pt' }}>Technologies: {proj.technologies}</div>
              {proj.description && (
                <ul style={{ margin: 0, paddingLeft: '24px', paddingRight: '12px' }}>
                  {proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{bullet.replace(/^- /, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Skills
          </h2>
          <div style={{ lineHeight: '1.6' }}>
            {skills.join(', ')}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Certifications
          </h2>
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span><span style={{ fontWeight: 'bold' }}>{cert.name}</span> — {cert.issuer}</span>
              {cert.date && <span style={{ fontSize: '10pt' }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Achievements
          </h2>
          <ul style={{ margin: 0, paddingLeft: '24px', paddingRight: '12px' }}>
            {achievements.map((ach, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{ach}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages & Interests */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 12px 0', paddingBottom: '4px', fontWeight: 'bold', color: '#000' }}>
            Additional Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {languages && languages.length > 0 && <div><span style={{ fontWeight: 'bold' }}>Languages: </span>{languages.join(' · ')}</div>}
            {interests && interests.length > 0 && <div><span style={{ fontWeight: 'bold' }}>Interests: </span>{interests.join(' · ')}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
