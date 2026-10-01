import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function BoldTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  const getInitials = (name: string) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const primaryColor = '#111827';
  const accentColor = '#3B82F6';

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#1f2937', padding: '40px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', borderBottom: `4px solid ${primaryColor}`, paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: primaryColor, color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
          {getInitials(personalInfo.fullName || '')}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '36px', margin: '0 0 5px 0', color: primaryColor, textTransform: 'uppercase', letterSpacing: '1px' }}>{personalInfo.fullName}</h1>
          <p style={{ fontSize: '14px', margin: '0', color: '#4b5563', fontWeight: '500' }}>
            {personalInfo.email} {personalInfo.phone && `• ${personalInfo.phone}`} {personalInfo.location && `• ${personalInfo.location}`}
          </p>
          <div style={{ marginTop: '5px', fontSize: '13px' }}>
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: accentColor, textDecoration: 'none', marginRight: '15px' }}>LinkedIn</a>}
            {personalInfo.github && <a href={personalInfo.github} style={{ color: accentColor, textDecoration: 'none', marginRight: '15px' }}>GitHub</a>}
            {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ color: accentColor, textDecoration: 'none' }}>Portfolio</a>}
          </div>
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '25px', fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
          <strong style={{ color: primaryColor }}>PROFESSIONAL SUMMARY: </strong> {personalInfo.summary}
        </div>
      )}

      {/* Main Content Split */}
      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Left Column (Main) */}
        <div style={{ flex: '2' }}>
          
          {experience && experience.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', backgroundColor: primaryColor, padding: '6px 12px', margin: '0 0 15px 0', letterSpacing: '2px', display: 'inline-block' }}>Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: primaryColor }}>{exp.position}</h3>
                    <span style={{ fontSize: '13px', color: accentColor, fontWeight: 'bold' }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>{exp.company} {exp.location && `| ${exp.location}`}</div>
                  <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {projects && projects.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', backgroundColor: primaryColor, padding: '6px 12px', margin: '0 0 15px 0', letterSpacing: '2px', display: 'inline-block' }}>Projects</h2>
              {projects.map((proj, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: primaryColor }}>
                      {proj.title} {proj.link && <a href={proj.link} style={{ fontSize: '12px', color: accentColor, textDecoration: 'none', marginLeft: '8px' }}>View</a>}
                    </h3>
                  </div>
                  <div style={{ fontSize: '12px', color: accentColor, marginBottom: '6px', fontWeight: '600' }}>{proj.technologies}</div>
                  <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#fff', backgroundColor: primaryColor, padding: '6px 12px', margin: '0 0 15px 0', letterSpacing: '2px', display: 'inline-block' }}>Achievements</h2>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                {achievements.map((ach, index) => (
                  <li key={index} style={{ marginBottom: '6px' }}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ flex: '1' }}>
          
          {education && education.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', margin: '0 0 15px 0', letterSpacing: '1px' }}>Education</h2>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: primaryColor }}>{edu.degree} in {edu.fieldOfStudy}</h3>
                  <div style={{ fontSize: '13px', color: '#4b5563' }}>{edu.institution}</div>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: 'bold', marginTop: '2px' }}>{edu.startDate} - {edu.endDate || 'Present'}</div>
                  {edu.gpa && <div style={{ fontSize: '12px', marginTop: '2px' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {skills && skills.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', margin: '0 0 15px 0', letterSpacing: '1px' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#f3f4f6', color: primaryColor, padding: '4px 8px', fontSize: '12px', borderRadius: '4px', fontWeight: '500', border: '1px solid #e5e7eb' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', margin: '0 0 15px 0', letterSpacing: '1px' }}>Certifications</h2>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: primaryColor }}>{cert.name}</div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>{cert.issuer} {cert.date && `(${cert.date})`}</div>
                </div>
              ))}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', margin: '0 0 15px 0', letterSpacing: '1px' }}>Languages</h2>
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                {languages.join(', ')}
              </div>
            </div>
          )}

          {interests && interests.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', margin: '0 0 15px 0', letterSpacing: '1px' }}>Interests</h2>
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                {interests.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
