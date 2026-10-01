import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function ExecutiveTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  const fontStyle = { fontFamily: '"Times New Roman", Times, serif' };
  const primaryColor = '#2c3e50';
  const dividerColor = '#34495e';

  return (
    <div style={{ ...fontStyle, color: '#333', padding: '50px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', color: primaryColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {personalInfo.fullName}
        </h1>
        <p style={{ fontSize: '14px', margin: '0', color: '#555' }}>
          {personalInfo.location && `${personalInfo.location} | `}
          {personalInfo.phone && `${personalInfo.phone} | `}
          {personalInfo.email}
        </p>
        <p style={{ fontSize: '13px', margin: '5px 0 0 0' }}>
          {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: primaryColor, textDecoration: 'none', margin: '0 10px' }}>LinkedIn</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ color: primaryColor, textDecoration: 'none', margin: '0 10px' }}>Portfolio</a>}
        </p>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '20px', textAlign: 'justify', fontSize: '14px', lineHeight: '1.6' }}>
          {personalInfo.summary}
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '15px' }}>
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', color: primaryColor }}>
                <span>{exp.position}</span>
                <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5', textAlign: 'justify' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '15px' }}>
            Key Projects
          </h2>
          {projects.map((proj, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', color: primaryColor }}>
                <span>{proj.title} {proj.link && <a href={proj.link} style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '5px', color: '#666', textDecoration: 'none' }}>(View)</a>}</span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '6px' }}>Technologies: {proj.technologies}</div>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5', textAlign: 'justify' }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '15px' }}>
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                <span>{edu.institution}</span>
                <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '14px' }}>
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Info Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'space-between' }}>
        
        {skills && skills.length > 0 && (
          <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
            <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '10px' }}>
              Skills & Expertise
            </h2>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {skills.join(' • ')}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
            <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '10px' }}>
              Certifications
            </h2>
            {certifications.map((cert, index) => (
              <div key={index} style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>{cert.name}</strong> – {cert.issuer} {cert.date && `(${cert.date})`}
              </div>
            ))}
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div style={{ flex: '1 1 45%', minWidth: '200px', marginTop: '15px' }}>
            <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '10px' }}>
              Key Achievements
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.5' }}>
              {achievements.map((ach, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {(languages?.length > 0 || interests?.length > 0) && (
          <div style={{ flex: '1 1 45%', minWidth: '200px', marginTop: '15px' }}>
            {languages && languages.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '10px' }}>
                  Languages
                </h2>
                <div style={{ fontSize: '14px' }}>{languages.join(' • ')}</div>
              </div>
            )}
            {interests && interests.length > 0 && (
              <div>
                <h2 style={{ fontSize: '16px', color: primaryColor, textTransform: 'uppercase', borderBottom: `1px solid ${dividerColor}`, paddingBottom: '4px', marginBottom: '10px' }}>
                  Interests
                </h2>
                <div style={{ fontSize: '14px' }}>{interests.join(' • ')}</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
