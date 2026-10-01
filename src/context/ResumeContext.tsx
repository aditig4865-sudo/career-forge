import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, initialResumeData } from '../types/resume';

export type TemplateId = 'classic' | 'modern' | 'professional' | 'standard' | 'creative' | 'elegant' | 'minimal' | 'tech' | 'bold' | 'executive' | 'ivyleague' | 'creative_director';

interface ResumeContextType {
  data: ResumeData;
  templateData: ResumeData;
  updateData: (newData: Partial<ResumeData>) => void;
  selectedTemplate: TemplateId;
  setTemplate: (template: TemplateId) => void;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setTemplate] = useState<TemplateId>('classic');

  const updateData = React.useCallback((newData: Partial<ResumeData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const templateData = React.useMemo(() => {
    return {
      ...data,
      education: (data.education || []).filter(edu => edu.institution || edu.degree || edu.fieldOfStudy),
      experience: (data.experience || []).filter(exp => exp.company || exp.position || exp.description),
      projects: (data.projects || []).filter(proj => proj.title || proj.description || proj.technologies),
      certifications: (data.certifications || []).filter(cert => cert.name || cert.issuer),
      skills: (data.skills || []).filter(skill => skill.trim() !== ''),
      achievements: (data.achievements || []).filter(ach => ach.trim() !== ''),
      languages: (data.languages || []).filter(lang => lang.trim() !== ''),
      interests: (data.interests || []).filter(int => int.trim() !== '')
    };
  }, [data]);

  return (
    <ResumeContext.Provider value={{ data, templateData, updateData, selectedTemplate, setTemplate }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
