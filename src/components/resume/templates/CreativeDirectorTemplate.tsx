import React from 'react';
import { useResume } from '../../../context/ResumeContext';

export function CreativeDirectorTemplate() {
  const { templateData: data } = useResume();
  const { personalInfo, education, experience, skills, projects } = data;

  return (
    <div style={{ 
      fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", sans-serif', 
      color: '#1a1a1a', 
      display: 'flex',
      minHeight: '1122px', // A4 proportion roughly
      maxWidth: '800px',
      margin: '0 auto',
      background: '#fafafa',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)'
    }}>
      {/* Left Column (Dark) */}
      <div style={{ 
        width: '35%', 
        background: '#1a1a1a', 
        color: '#ffffff',
        padding: '40px 30px'
      }}>
        {/* Name / Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            margin: '0 0 10px 0', 
            fontWeight: 800, 
            lineHeight: 1.1,
            color: '#FF6B6B' // Vibrant coral accent
          }}>
            {personalInfo.fullName.split(' ').map((name, i) => (
              <div key={i}>{name.toUpperCase()}</div>
            ))}
          </h1>
          <div style={{ 
            fontSize: '12px', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: '#a0a0a0',
            marginTop: '15px'
          }}>
            Creative Professional
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px', color: '#fff' }}>Contact</h2>
          <div style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
            {personalInfo.github && <div>{personalInfo.github}</div>}
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px', color: '#fff' }}>Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '15px', fontSize: '11px' }}>
                <div style={{ fontWeight: 'bold', color: '#FF6B6B', marginBottom: '4px' }}>{edu.degree}</div>
                <div style={{ color: '#fff' }}>{edu.institution}</div>
                <div style={{ color: '#a0a0a0' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px', color: '#fff' }}>Expertise</h2>
            <div style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {skills.map((skill, i) => (
                <span key={i} style={{ background: '#333', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', color: '#fff' }}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Light) */}
      <div style={{ 
        width: '65%', 
        padding: '40px'
      }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '30px', height: '3px', background: '#FF6B6B', display: 'inline-block' }}></span>
              Profile
            </h2>
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#555' }}>{personalInfo.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '30px', height: '3px', background: '#FF6B6B', display: 'inline-block' }}></span>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{exp.position}</h3>
                    <span style={{ fontSize: '11px', color: '#FF6B6B', fontWeight: 600 }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600, marginBottom: '8px' }}>{exp.company} {exp.location && `| ${exp.location}`}</div>
                  <ul style={{ margin: '0', paddingLeft: '15px', fontSize: '11px', color: '#555', lineHeight: 1.5 }}>
                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '30px', height: '3px', background: '#FF6B6B', display: 'inline-block' }}></span>
              Selected Works
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 5px 0' }}>{proj.name}</h3>
                  {proj.technologies && <div style={{ fontSize: '10px', color: '#FF6B6B', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>{proj.technologies}</div>}
                  <p style={{ margin: 0, fontSize: '11px', color: '#555', lineHeight: 1.5 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
