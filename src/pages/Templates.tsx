import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ClassicTemplate } from '../components/resume/templates/ClassicTemplate';
import { ModernTemplate } from '../components/resume/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/resume/templates/ProfessionalTemplate';
import { StandardTemplate } from '../components/resume/templates/StandardTemplate';
import { CreativeTemplate } from '../components/resume/templates/CreativeTemplate';
import { ElegantTemplate } from '../components/resume/templates/ElegantTemplate';
import { MinimalTemplate } from '../components/resume/templates/MinimalTemplate';
import { TechTemplate } from '../components/resume/templates/TechTemplate';
import { BoldTemplate } from '../components/resume/templates/BoldTemplate';
import { ExecutiveTemplate } from '../components/resume/templates/ExecutiveTemplate';
import { IvyLeagueTemplate } from '../components/resume/templates/IvyLeagueTemplate';
import { CreativeDirectorTemplate } from '../components/resume/templates/CreativeDirectorTemplate';
import { ResumeContext } from '../context/ResumeContext';
import { ResumeData } from '../types/resume';

// A fully fleshed out dummy resume to show what the templates look like when filled
const mockData: ResumeData = {
  personalInfo: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    portfolio: 'github.com/aaravsharma',
    linkedin: 'linkedin.com/in/aaravsharma'
  },
  education: [
    {
      id: '1',
      institution: 'Zeal College of Engineering & Research, Pune',
      degree: 'Diploma',
      fieldOfStudy: 'Information Technology',
      startDate: '2024',
      endDate: 'Present',
      score: '8.4/10'
    }
  ],
  experience: [
    {
      id: '1',
      company: 'College Technical Club',
      position: 'Technical Team Member',
      startDate: '2025',
      endDate: 'Present',
      description: '- Assisted in organizing technical workshops and student project activities.\n- Collaborated with team members on college-level technical events.'
    }
  ],
  projects: [
    {
      id: '1',
      title: 'Student Attendance Management System',
      technologies: 'Python · Django · SQLite · HTML · CSS',
      link: '',
      description: '- Developed a web-based attendance management system for students and faculty with attendance tracking and record management.'
    },
    {
      id: '2',
      title: 'Weather Data Tracker',
      technologies: 'Python · Django · OpenWeatherMap API',
      link: '',
      description: '- Built a web application that displays real-time weather information for different cities using the OpenWeatherMap API.'
    }
  ],
  skills: ['Python', 'Django', 'Java', 'SQL', 'HTML', 'CSS', 'JavaScript', 'Git'],
  certifications: [
    {
      id: '1',
      name: 'Python Programming',
      issuer: 'Infosys Springboard',
      date: ''
    }
  ],
  achievements: [
    'Participated in a college-level technical project exhibition.'
  ],
  languages: ['English', 'Hindi', 'Marathi'],
  interests: ['Web Development', 'Technology', 'Open Source']
};

// Helper component to render a scaled down preview of a template with mock data
const TemplatePreview = ({ children, onPreviewClick }: { children: React.ReactNode, onPreviewClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setScale(entry.contentRect.width / 794);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      onClick={onPreviewClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '100%', 
        // This ensures the container perfectly matches A4 proportions
        aspectRatio: '794/1123', 
        overflow: 'hidden', 
        backgroundColor: 'var(--color-surface-container-low)', 
        borderRadius: 'var(--radius-base)', 
        marginBottom: 'var(--space-md)',
        display: 'block', // No flex centering needed since we scale from top left
        border: '1px solid var(--color-structural-border)',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Click overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: isHovered ? 'rgba(0,0,0,0.1)' : 'transparent',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20
      }}>
        {isHovered && (
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.75)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '24px', 
            fontSize: '0.9rem',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Click to preview
          </div>
        )}
      </div>

      <div style={{ 
        width: '794px', 
        height: '1123px',
        transformOrigin: 'top left',
        transform: `scale(${scale})`, 
        pointerEvents: 'none' 
      }}>
        {children}
      </div>
    </div>
  );
};

export function Templates() {
  const [previewTemplate, setPreviewTemplate] = useState<React.ReactNode | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [modalScale, setModalScale] = useState(1);

  useEffect(() => {
    if (!previewTemplate || !modalContainerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setModalScale(entry.contentRect.width / 794);
      }
    });
    
    observer.observe(modalContainerRef.current);
    return () => observer.disconnect();
  }, [previewTemplate]);

  return (
    <div className="container mt-xl">
      <div className="mb-lg">
        <h1>Resume Templates</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Choose a resume layout that fits your style and career goals.<br/>
          Preview each template with sample resume data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', paddingBottom: '4rem' }}>
        
        {/* Classic Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'classic', setTemplate: () => {} }}>
              <ClassicTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'classic', setTemplate: () => {} }}>
              <ClassicTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Classic</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A clean, traditional single-column layout with clear sections and professional typography.
          </p>
          <Link to="/resume-builder?template=classic">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Modern Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'modern', setTemplate: () => {} }}>
              <ModernTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'modern', setTemplate: () => {} }}>
              <ModernTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Modern</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A contemporary design with strong typography and subtle accent details for a polished look.
          </p>
          <Link to="/resume-builder?template=modern">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Professional Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'professional', setTemplate: () => {} }}>
              <ProfessionalTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'professional', setTemplate: () => {} }}>
              <ProfessionalTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Professional</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A structured two-column layout that keeps skills and education organized alongside experience and projects.
          </p>
          <Link to="/resume-builder?template=professional">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Standard Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'standard', setTemplate: () => {} }}>
              <StandardTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'standard', setTemplate: () => {} }}>
              <StandardTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Standard</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A straightforward ATS-friendly layout with clear hierarchy and efficient use of space.
          </p>
          <Link to="/resume-builder?template=standard">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Creative Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'creative', setTemplate: () => {} }}>
              <CreativeTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'creative', setTemplate: () => {} }}>
              <CreativeTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Creative</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A bold and modern two-column design with a distinct dark sidebar to make your resume stand out.
          </p>
          <Link to="/resume-builder?template=creative">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Elegant Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'elegant', setTemplate: () => {} }}>
              <ElegantTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'elegant', setTemplate: () => {} }}>
              <ElegantTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Elegant</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A sophisticated and timeless serif-based design with elegant section dividers and muted colors.
          </p>
          <Link to="/resume-builder?template=elegant">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Minimal Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'minimal', setTemplate: () => {} }}>
              <MinimalTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'minimal', setTemplate: () => {} }}>
              <MinimalTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Minimal</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            An extremely clean and spacious layout that focuses entirely on content readability without any distractions.
          </p>
          <Link to="/resume-builder?template=minimal">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Tech Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'tech', setTemplate: () => {} }}>
              <TechTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'tech', setTemplate: () => {} }}>
              <TechTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Tech</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A modern, code-inspired layout with monospaced accents designed specifically for software engineers and IT professionals.
          </p>
          <Link to="/resume-builder?template=tech">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Bold Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'bold', setTemplate: () => {} }}>
              <BoldTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'bold', setTemplate: () => {} }}>
              <BoldTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Bold</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A high-contrast, striking design with bold headers and a prominent header section for maximum impact.
          </p>
          <Link to="/resume-builder?template=bold">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Executive Template Card */}
        <Card>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'executive', setTemplate: () => {} }}>
              <ExecutiveTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'executive', setTemplate: () => {} }}>
              <ExecutiveTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Executive</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A traditional, dense, serif-based template ideal for senior leadership roles and highly experienced professionals.
          </p>
          <Link to="/resume-builder?template=executive">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Ivy League Template Card */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'ivyleague', setTemplate: () => {} }}>
              <IvyLeagueTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'ivyleague', setTemplate: () => {} }}>
              <IvyLeagueTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Ivy League (Ultra Premium)</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A prestige academic layout featuring deep crimson accents and elegant serif typography. Perfect for academia and top-tier roles.
          </p>
          <Link to="/resume-builder?template=ivyleague">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

        {/* Creative Director Template Card */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <TemplatePreview onPreviewClick={() => setPreviewTemplate(
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'creative_director', setTemplate: () => {} }}>
              <CreativeDirectorTemplate />
            </ResumeContext.Provider>
          )}>
            <ResumeContext.Provider value={{ data: mockData, templateData: mockData, updateData: () => {}, selectedTemplate: 'creative_director', setTemplate: () => {} }}>
              <CreativeDirectorTemplate />
            </ResumeContext.Provider>
          </TemplatePreview>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Creative Director (Ultra Premium)</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A dark-mode inspired avant-garde design with neon accents and asymmetrical layout. Ideal for design and creative fields.
          </p>
          <Link to="/resume-builder?template=creative_director">
            <Button variant="primary" fullWidth>Use this template</Button>
          </Link>
        </Card>

      </div>

      {/* Fullscreen Modal */}
      {previewTemplate && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setPreviewTemplate(null)}
        >
          <button
            onClick={() => setPreviewTemplate(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '40px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '3rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            &times;
          </button>
          
          <div 
            ref={modalContainerRef}
            style={{ 
              position: 'relative', 
              height: '95vh',
              maxHeight: '95vh',
              maxWidth: '95vw',
              aspectRatio: '794/1123',
              backgroundColor: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '794px',
              height: '1123px',
              transformOrigin: 'top left',
              transform: `scale(${modalScale})`, 
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }}>
              {previewTemplate}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
