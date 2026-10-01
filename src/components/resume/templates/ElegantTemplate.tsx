import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function ElegantTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, projects, skills, certifications, achievements, languages, interests } = data;

  return (
    <div style={{
      fontFamily: 'Georgia, "Times New Roman", serif',
      color: '#2c3e50',
      backgroundColor: '#f9f9f9',
      width: '794px',
      minHeight: '1123px',
      boxSizing: 'border-box',
      padding: '50px 60px',
      fontSize: '10.5pt',
      lineHeight: '1.6'
    }}>
      <div style={{ textAlign: 'center', borderBottom: '1px solid #dcdde1', paddingBottom: '25px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28pt', margin: '0 0 10px 0', color: '#192a56', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {personalInfo.fullName || 'First Last'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '9.5pt', color: '#7f8fa6' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </div>

      {experience.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '14pt', color: '#192a56', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginRight: '15px' }}></span>
            Experience
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginLeft: '15px' }}></span>
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ margin: 0, fontSize: '12pt', color: '#2c3e50' }}>{exp.position}</h4>
                <span style={{ fontSize: '9.5pt', color: '#7f8fa6', fontStyle: 'italic' }}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <div style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#192a56', marginBottom: '6px' }}>{exp.company}</div>
              <div style={{ whiteSpace: 'pre-wrap', color: '#353b48' }}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '14pt', color: '#192a56', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginRight: '15px' }}></span>
            Education
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginLeft: '15px' }}></span>
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ margin: 0, fontSize: '11.5pt', color: '#2c3e50' }}>{edu.degree} in {edu.fieldOfStudy}</h4>
                <span style={{ fontSize: '9.5pt', color: '#7f8fa6', fontStyle: 'italic' }}>{edu.startDate} - {edu.endDate}</span>
              </div>
              <div style={{ color: '#353b48', marginTop: '4px' }}>{edu.institution} {edu.score ? `| ${edu.score}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '14pt', color: '#192a56', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginRight: '15px' }}></span>
            Projects
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginLeft: '15px' }}></span>
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ margin: 0, fontSize: '11.5pt', color: '#2c3e50' }}>{proj.title}</h4>
                {proj.link && <span style={{ fontSize: '9pt', color: '#7f8fa6' }}>{proj.link}</span>}
              </div>
              <div style={{ fontSize: '9.5pt', fontStyle: 'italic', color: '#7f8fa6', marginBottom: '6px' }}>{proj.technologies}</div>
              <div style={{ whiteSpace: 'pre-wrap', color: '#353b48' }}>{proj.description}</div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '14pt', color: '#192a56', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginRight: '15px' }}></span>
            Skills
            <span style={{ backgroundColor: '#192a56', height: '1px', flex: 1, marginLeft: '15px' }}></span>
          </h2>
          <div style={{ color: '#353b48', textAlign: 'center', padding: '0 20px' }}>{skills.join(' • ')}</div>
        </div>
      )}
      
      {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12pt', color: '#192a56', textTransform: 'uppercase', borderBottom: '1px solid #192a56', paddingBottom: '5px', marginBottom: '15px' }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{cert.name}</div>
                  <div style={{ fontSize: '9pt', color: '#7f8fa6' }}>{cert.issuer} {cert.date && `(${cert.date})`}</div>
                </div>
              ))}
            </div>
          )}
          
          {achievements.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12pt', color: '#192a56', textTransform: 'uppercase', borderBottom: '1px solid #192a56', paddingBottom: '5px', marginBottom: '15px' }}>Achievements</h2>
              <ul style={{ paddingLeft: '15px', margin: 0 }}>
                {achievements.map((ach, i) => <li key={i} style={{ marginBottom: '5px' }}>{ach}</li>)}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12pt', color: '#192a56', textTransform: 'uppercase', borderBottom: '1px solid #192a56', paddingBottom: '5px', marginBottom: '15px' }}>Languages</h2>
              <div style={{ color: '#353b48' }}>{languages.join(', ')}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
