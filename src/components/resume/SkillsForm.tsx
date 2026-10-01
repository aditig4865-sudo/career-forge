import React from 'react';
import { useResume } from '../../context/ResumeContext';
import CreatableSelect from 'react-select/creatable';

const groupedSkills = [
  {
    label: 'Common / Soft Skills',
    options: [
      { value: 'Communication', label: 'Communication' },
      { value: 'Leadership', label: 'Leadership' },
      { value: 'Problem Solving', label: 'Problem Solving' },
      { value: 'Time Management', label: 'Time Management' },
      { value: 'Teamwork', label: 'Teamwork' },
      { value: 'Critical Thinking', label: 'Critical Thinking' },
      { value: 'Project Management', label: 'Project Management' },
      { value: 'Public Speaking', label: 'Public Speaking' },
      { value: 'Adaptability', label: 'Adaptability' },
    ]
  },
  {
    label: 'Computer Science & Software Engineering',
    options: [
      { value: 'JavaScript', label: 'JavaScript' },
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'Python', label: 'Python' },
      { value: 'Java', label: 'Java' },
      { value: 'C++', label: 'C++' },
      { value: 'C#', label: 'C#' },
      { value: 'Go', label: 'Go' },
      { value: 'Rust', label: 'Rust' },
      { value: 'React', label: 'React' },
      { value: 'Angular', label: 'Angular' },
      { value: 'Vue.js', label: 'Vue.js' },
      { value: 'Node.js', label: 'Node.js' },
      { value: 'Django', label: 'Django' },
      { value: 'Spring Boot', label: 'Spring Boot' },
      { value: 'SQL', label: 'SQL' },
      { value: 'MongoDB', label: 'MongoDB' },
      { value: 'PostgreSQL', label: 'PostgreSQL' },
      { value: 'Git', label: 'Git' },
      { value: 'Docker', label: 'Docker' },
      { value: 'Kubernetes', label: 'Kubernetes' },
      { value: 'AWS', label: 'AWS' },
      { value: 'Azure', label: 'Azure' },
      { value: 'Machine Learning', label: 'Machine Learning' },
      { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
      { value: 'Data Structures & Algorithms', label: 'Data Structures & Algorithms' },
    ]
  },
  {
    label: 'Business, Management & Finance',
    options: [
      { value: 'Business Strategy', label: 'Business Strategy' },
      { value: 'Financial Analysis', label: 'Financial Analysis' },
      { value: 'Digital Marketing', label: 'Digital Marketing' },
      { value: 'SEO/SEM', label: 'SEO/SEM' },
      { value: 'Data Analysis', label: 'Data Analysis' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Operations Management', label: 'Operations Management' },
      { value: 'Agile/Scrum', label: 'Agile/Scrum' },
      { value: 'Accounting', label: 'Accounting' },
      { value: 'Risk Management', label: 'Risk Management' },
    ]
  },
  {
    label: 'Engineering (Mechanical/Civil/Electrical)',
    options: [
      { value: 'AutoCAD', label: 'AutoCAD' },
      { value: 'SolidWorks', label: 'SolidWorks' },
      { value: 'MATLAB', label: 'MATLAB' },
      { value: 'Circuit Design', label: 'Circuit Design' },
      { value: 'Structural Analysis', label: 'Structural Analysis' },
      { value: 'Thermodynamics', label: 'Thermodynamics' },
      { value: 'PLC Programming', label: 'PLC Programming' },
      { value: 'Fluid Mechanics', label: 'Fluid Mechanics' },
    ]
  },
  {
    label: 'Design & Arts',
    options: [
      { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
      { value: 'Adobe Illustrator', label: 'Adobe Illustrator' },
      { value: 'Figma', label: 'Figma' },
      { value: 'UI/UX Design', label: 'UI/UX Design' },
      { value: 'Video Editing', label: 'Video Editing' },
      { value: 'Graphic Design', label: 'Graphic Design' },
      { value: 'Typography', label: 'Typography' },
      { value: 'Wireframing', label: 'Wireframing' },
    ]
  },
  {
    label: 'Science & Medical',
    options: [
      { value: 'Laboratory Skills', label: 'Laboratory Skills' },
      { value: 'Data Collection', label: 'Data Collection' },
      { value: 'Clinical Research', label: 'Clinical Research' },
      { value: 'Patient Care', label: 'Patient Care' },
      { value: 'Medical Terminology', label: 'Medical Terminology' },
      { value: 'Bioinformatics', label: 'Bioinformatics' },
    ]
  }
];

export function SkillsForm() {
  const { data, updateData } = useResume();
  const skills = data.skills || [];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevation)',
      borderColor: 'var(--color-structural-border)',
      color: 'white',
      minHeight: '48px'
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevation)',
      border: '1px solid var(--color-structural-border)',
      zIndex: 9999
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--color-primary)' : 'transparent',
      color: 'white',
      cursor: 'pointer'
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-primary)',
      borderRadius: '4px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
      padding: '4px 8px'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      ':hover': {
        backgroundColor: 'var(--color-error)',
        color: 'white'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    }),
    groupHeading: (base: any) => ({
      ...base,
      color: 'var(--color-text-muted)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      padding: '8px 12px'
    })
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Skills</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Search, select, or type your own skills. They will be added as tags.
      </p>

      <div style={{ 
        background: 'var(--color-subtle-surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-base)', 
        border: '1px solid var(--color-structural-border)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Select your Skills</label>
        <CreatableSelect
          isMulti
          isClearable
          styles={customStyles}
          value={skills.map(s => ({ label: s, value: s }))}
          options={groupedSkills}
          onChange={(selectedOptions: any) => {
            updateData({ skills: selectedOptions ? selectedOptions.map((o: any) => o.label) : [] });
          }}
          placeholder="Type or select skills..."
        />
      </div>
    </div>
  );
}
