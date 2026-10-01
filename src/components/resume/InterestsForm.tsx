import React from 'react';
import { useResume } from '../../context/ResumeContext';
import CreatableSelect from 'react-select/creatable';

const commonInterests = [
  {
    label: 'Technology & Computing',
    options: [
      { value: 'Coding / Open Source', label: 'Coding / Open Source' },
      { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
      { value: 'Cybersecurity', label: 'Cybersecurity' },
      { value: 'Game Development', label: 'Game Development' },
      { value: 'Robotics', label: 'Robotics' },
      { value: 'Blockchain / Crypto', label: 'Blockchain / Crypto' },
    ]
  },
  {
    label: 'Arts & Design',
    options: [
      { value: 'Photography', label: 'Photography' },
      { value: 'Graphic Design', label: 'Graphic Design' },
      { value: 'Painting / Drawing', label: 'Painting / Drawing' },
      { value: 'Video Editing', label: 'Video Editing' },
      { value: 'Music Production', label: 'Music Production' },
      { value: 'Creative Writing', label: 'Creative Writing' },
      { value: 'Architecture', label: 'Architecture' },
    ]
  },
  {
    label: 'Sports & Outdoors',
    options: [
      { value: 'Football / Soccer', label: 'Football / Soccer' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Tennis', label: 'Tennis' },
      { value: 'Swimming', label: 'Swimming' },
      { value: 'Running / Marathons', label: 'Running / Marathons' },
      { value: 'Hiking / Trekking', label: 'Hiking / Trekking' },
      { value: 'Cycling', label: 'Cycling' },
      { value: 'Yoga / Meditation', label: 'Yoga / Meditation' },
      { value: 'Martial Arts', label: 'Martial Arts' },
    ]
  },
  {
    label: 'Science & Academia',
    options: [
      { value: 'Astronomy', label: 'Astronomy' },
      { value: 'Physics', label: 'Physics' },
      { value: 'Biology', label: 'Biology' },
      { value: 'History', label: 'History' },
      { value: 'Philosophy', label: 'Philosophy' },
      { value: 'Mathematics', label: 'Mathematics' },
      { value: 'Economics', label: 'Economics' },
    ]
  },
  {
    label: 'General Hobbies',
    options: [
      { value: 'Reading', label: 'Reading' },
      { value: 'Traveling', label: 'Traveling' },
      { value: 'Cooking / Baking', label: 'Cooking / Baking' },
      { value: 'Gardening', label: 'Gardening' },
      { value: 'Volunteering', label: 'Volunteering' },
      { value: 'Blogging / Vlogging', label: 'Blogging / Vlogging' },
      { value: 'Podcasting', label: 'Podcasting' },
      { value: 'Investing', label: 'Investing' },
    ]
  }
];

export function InterestsForm() {
  const { data, updateData } = useResume();
  const interests = data.interests || [];

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
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Interests</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Search, select, or type your hobbies and personal interests.
      </p>

      <div style={{ 
        background: 'var(--color-subtle-surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-base)', 
        border: '1px solid var(--color-structural-border)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Select your Interests</label>
        <CreatableSelect
          isMulti
          isClearable
          styles={customStyles}
          value={interests.map(interest => ({ label: interest, value: interest }))}
          options={commonInterests}
          onChange={(selectedOptions: any) => {
            updateData({ interests: selectedOptions ? selectedOptions.map((o: any) => o.label) : [] });
          }}
          placeholder="Type or select interests..."
        />
      </div>
    </div>
  );
}
