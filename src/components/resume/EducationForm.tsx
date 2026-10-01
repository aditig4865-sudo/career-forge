import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function EducationForm() {
  const { data, updateData } = useResume();
  const educationList = data.education || [];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevation)',
      borderColor: 'var(--color-structural-border)',
      color: 'white'
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
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    })
  };

  const degreeFields: Record<string, string[]> = {
    "High School": ["General", "Science", "Commerce", "Arts"],
    "Associate Degree": ["Computer Science", "Business Administration", "Nursing", "Accounting", "General Studies"],
    "Bachelor of Engineering (BE)": ["Computer Engineering", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication", "Electrical Engineering", "Chemical Engineering", "Aerospace Engineering"],
    "Bachelor of Technology (BTech)": ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication", "Electrical Engineering", "Chemical Engineering", "Aerospace Engineering", "Biotechnology", "Data Science", "Artificial Intelligence"],
    "Bachelor of Science (BSc)": ["Computer Science", "Physics", "Chemistry", "Mathematics", "Biology", "Nursing", "Information Technology", "Biotechnology", "Environmental Science", "Psychology", "Economics"],
    "Bachelor of Arts (BA)": ["English", "History", "Economics", "Political Science", "Sociology", "Psychology", "Philosophy", "Fine Arts", "Journalism"],
    "Bachelor of Commerce (BCom)": ["General", "Accounting", "Finance", "Taxation", "Marketing", "E-commerce"],
    "Bachelor of Business Administration (BBA)": ["Marketing", "Finance", "Human Resources", "International Business", "Operations Management", "Entrepreneurship"],
    "Master of Science (MSc)": ["Computer Science", "Data Science", "Physics", "Chemistry", "Mathematics", "Biology", "Biotechnology", "Psychology"],
    "Master of Arts (MA)": ["English", "History", "Economics", "Political Science", "Sociology", "Psychology"],
    "Master of Business Administration (MBA)": ["Marketing", "Finance", "Human Resources", "Operations", "Information Technology", "International Business", "Strategy", "Business Analytics"],
    "Master of Engineering (ME)": ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    "Master of Technology (MTech)": ["Computer Science", "Software Engineering", "Data Science", "VLSI Design", "Structural Engineering"],
    "Doctor of Philosophy (PhD)": ["Computer Science", "Physics", "Chemistry", "Mathematics", "Biology", "Economics", "Psychology", "Engineering", "Literature"],
    "Doctor of Medicine (MD)": ["General Medicine", "Pediatrics", "Cardiology", "Neurology", "Psychiatry", "Surgery", "Oncology", "Dermatology"],
    "Juris Doctor (JD)": ["Corporate Law", "Criminal Law", "Intellectual Property", "International Law", "Environmental Law", "Family Law"],
    "Other": []
  };

  const handleAdd = () => {
    const newEdu = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      score: ''
    };
    updateData({ education: [...educationList, newEdu] });
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateData({ education: updated });
  };

  const handleRemove = (id: string) => {
    const updated = educationList.filter(edu => edu.id !== id);
    updateData({ education: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Education</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Add your academic history. High school is generally not needed if you are in college.
      </p>

      {educationList.map((edu, index) => (
        <div key={edu.id} style={{ 
          background: 'var(--color-subtle-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-base)', 
          marginBottom: '1rem',
          border: '1px solid var(--color-structural-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Institution {index + 1}</h3>
            <Button variant="ghost" onClick={() => handleRemove(edu.id)} style={{ color: 'var(--color-error)' }}>
              Remove
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Institution / University</label>
              <input 
                type="text" 
                value={edu.institution} 
                onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="College / University Name"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Degree</label>
              <CreatableSelect
                isClearable
                styles={customStyles}
                value={edu.degree ? { label: edu.degree, value: edu.degree } : null}
                options={Object.keys(degreeFields).map(deg => ({ label: deg, value: deg }))}
                onChange={(selectedOption: any) => {
                  handleUpdate(edu.id, 'degree', selectedOption ? selectedOption.label : '');
                }}
                placeholder="Type or select..."
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Field of Study</label>
              <CreatableSelect
                isClearable
                styles={customStyles}
                value={edu.fieldOfStudy ? { label: edu.fieldOfStudy, value: edu.fieldOfStudy } : null}
                options={(edu.degree && degreeFields[edu.degree]) ? degreeFields[edu.degree].map(f => ({ label: f, value: f })) : []}
                onChange={(selectedOption: any) => {
                  handleUpdate(edu.id, 'fieldOfStudy', selectedOption ? selectedOption.label : '');
                }}
                placeholder="Type or select..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date</label>
              <DatePicker
                selected={edu.startDate ? new Date(edu.startDate) : null}
                onChange={(date: Date | null) => handleUpdate(edu.id, 'startDate', date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                customInput={
                  <input style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }} />
                }
                placeholderText="Select Month & Year"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Date</label>
              {edu.endDate === 'Present' ? (
                <div style={{ padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px', opacity: 0.7, marginBottom: '0.5rem' }}>Present</div>
              ) : (
                <div style={{ marginBottom: '0.5rem' }}>
                  <DatePicker
                    selected={edu.endDate && edu.endDate !== 'Present' ? new Date(edu.endDate) : null}
                    onChange={(date: Date | null) => handleUpdate(edu.id, 'endDate', date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    customInput={
                      <input style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }} />
                    }
                    placeholderText="Select Month & Year"
                  />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={edu.endDate === 'Present'}
                  onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.checked ? 'Present' : '')}
                />
                Currently studying here
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>GPA / Score (Optional)</label>
              <input 
                type="text" 
                value={edu.score} 
                onChange={(e) => handleUpdate(edu.id, 'score', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                placeholder="e.g. 8.5 CGPA"
              />
            </div>
          </div>

        </div>
      ))}

      <Button variant="secondary" onClick={handleAdd} style={{ width: '100%' }}>
        + Add Education
      </Button>
    </div>
  );
}
