import React from 'react';
import { useResume } from '../../context/ResumeContext';
import CreatableSelect from 'react-select/creatable';

const commonLanguages = [
  {
    label: 'Most Common',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Spanish', label: 'Spanish' },
      { value: 'Mandarin Chinese', label: 'Mandarin Chinese' },
      { value: 'Hindi', label: 'Hindi' },
      { value: 'Arabic', label: 'Arabic' },
      { value: 'Portuguese', label: 'Portuguese' },
      { value: 'Bengali', label: 'Bengali' },
      { value: 'Russian', label: 'Russian' },
      { value: 'Japanese', label: 'Japanese' },
      { value: 'Punjabi', label: 'Punjabi' },
    ]
  },
  {
    label: 'European',
    options: [
      { value: 'French', label: 'French' },
      { value: 'German', label: 'German' },
      { value: 'Italian', label: 'Italian' },
      { value: 'Dutch', label: 'Dutch' },
      { value: 'Polish', label: 'Polish' },
      { value: 'Swedish', label: 'Swedish' },
      { value: 'Greek', label: 'Greek' },
      { value: 'Czech', label: 'Czech' },
      { value: 'Romanian', label: 'Romanian' },
      { value: 'Hungarian', label: 'Hungarian' },
    ]
  },
  {
    label: 'Asian & Indian',
    options: [
      { value: 'Korean', label: 'Korean' },
      { value: 'Vietnamese', label: 'Vietnamese' },
      { value: 'Telugu', label: 'Telugu' },
      { value: 'Marathi', label: 'Marathi' },
      { value: 'Tamil', label: 'Tamil' },
      { value: 'Urdu', label: 'Urdu' },
      { value: 'Gujarati', label: 'Gujarati' },
      { value: 'Malayalam', label: 'Malayalam' },
      { value: 'Kannada', label: 'Kannada' },
      { value: 'Odia', label: 'Odia' },
      { value: 'Thai', label: 'Thai' },
      { value: 'Indonesian', label: 'Indonesian' },
      { value: 'Tagalog', label: 'Tagalog' },
    ]
  },
  {
    label: 'Middle Eastern & African',
    options: [
      { value: 'Turkish', label: 'Turkish' },
      { value: 'Persian (Farsi)', label: 'Persian (Farsi)' },
      { value: 'Swahili', label: 'Swahili' },
      { value: 'Hausa', label: 'Hausa' },
      { value: 'Amharic', label: 'Amharic' },
      { value: 'Yoruba', label: 'Yoruba' },
      { value: 'Zulu', label: 'Zulu' },
    ]
  }
];

export function LanguagesForm() {
  const { data, updateData } = useResume();
  const languages = data.languages || [];

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
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Languages</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Search, select, or type languages you can speak or write.
      </p>

      <div style={{ 
        background: 'var(--color-subtle-surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-base)', 
        border: '1px solid var(--color-structural-border)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Select your Languages</label>
        <CreatableSelect
          isMulti
          isClearable
          styles={customStyles}
          value={languages.map(lang => ({ label: lang, value: lang }))}
          options={commonLanguages}
          onChange={(selectedOptions: any) => {
            updateData({ languages: selectedOptions ? selectedOptions.map((o: any) => o.label) : [] });
          }}
          placeholder="Type or select languages..."
        />
      </div>
    </div>
  );
}
