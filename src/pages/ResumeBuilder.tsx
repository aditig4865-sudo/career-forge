import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Save, Download, FilePlus, Wand2, Search } from 'lucide-react';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useReactToPrint } from 'react-to-print';
import { AuthModal } from '../components/auth/AuthModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PersonalInfoForm } from '../components/resume/PersonalInfoForm';
import { EducationForm } from '../components/resume/EducationForm';
import { ExperienceForm } from '../components/resume/ExperienceForm';
import { ProjectsForm } from '../components/resume/ProjectsForm';
import { SkillsForm } from '../components/resume/SkillsForm';
import { CertificationsForm } from '../components/resume/CertificationsForm';
import { AchievementsForm } from '../components/resume/AchievementsForm';
import { LanguagesForm } from '../components/resume/LanguagesForm';
import { InterestsForm } from '../components/resume/InterestsForm';
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
import { AIGeneratorModal } from '../components/resume/AIGeneratorModal';
import { ATSCheckerModal } from '../components/resume/ATSCheckerModal';
import { useResume, TemplateId } from '../context/ResumeContext';
import { initialResumeData } from '../types/resume';
import { trackResumeSave } from '../services/adminService';

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = React.useState('personal');
  const { selectedTemplate, setTemplate, data, updateData } = useResume();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewResumeModal, setShowNewResumeModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [newResumeName, setNewResumeName] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingNewResume, setPendingNewResume] = useState(false);
  const [newResumeTemplate, setNewResumeTemplate] = useState<TemplateId>('classic');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateQuery = params.get('template') as TemplateId;
    if (templateQuery && ['classic', 'modern', 'professional', 'standard', 'creative', 'elegant', 'minimal', 'tech', 'bold', 'executive', 'ivyleague', 'creative_director'].includes(templateQuery)) {
      setTemplate(templateQuery);
    }
    
    const id = params.get('id');
    if (id) {
      setResumeId(id);
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const fetchResume = async () => {
            try {
              let docRef = doc(db, 'users', user.uid, 'resumes', id);
              let docSnap = await getDoc(docRef);
              
              if (!docSnap.exists()) {
                docRef = doc(db, 'resumes', id);
                docSnap = await getDoc(docRef);
              }
              if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                if (fetchedData.userId === user.uid) {
                  setResumeName(fetchedData.name || '');
                  setTemplate(fetchedData.template);
                  updateData(fetchedData.data);
                }
              }
            } catch (e) {
              console.error("Error fetching resume", e);
            }
          };
          fetchResume();
        }
      });
      return unsubscribe;
    }
  }, [setTemplate, updateData]);

  const onSaveClick = () => {
    if (!auth.currentUser) {
      setShowAuthPrompt(true);
      return;
    }
    if (!resumeName) {
      setResumeName(data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Untitled Resume');
    }
    setShowSaveModal(true);
  };

  const executeSave = async (asNewCopy: boolean) => {
    setIsSaving(true);
    try {
      const finalName = resumeName || 'Untitled Resume';
      const resumePayload = {
        name: finalName,
        data: data,
        template: selectedTemplate,
        updatedAt: Date.now(),
        userId: auth.currentUser!.uid,
        userEmail: auth.currentUser!.email || 'No email provided'
      };

      let targetResumeId = resumeId;
      if (resumeId && !asNewCopy) {
        await setDoc(doc(db, 'users', auth.currentUser!.uid, 'resumes', resumeId), resumePayload, { merge: true });
        setShowSaveModal(false);
        setAlertMsg("Resume updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, 'users', auth.currentUser!.uid, 'resumes'), resumePayload);
        targetResumeId = docRef.id;
        setResumeId(docRef.id);
        navigate(`/resume-builder?id=${docRef.id}`, { replace: true });
        setShowSaveModal(false);
        setAlertMsg("Resume created successfully!");
      }

      if (targetResumeId) {
        trackResumeSave(targetResumeId, finalName, data, selectedTemplate);
      }
      
      // If we are in the "New Resume" flow, proceed to the next step
      if (pendingNewResume) {
        setPendingNewResume(false);
        setNewResumeName('');
        setNewResumeTemplate('classic');
        setShowNewResumeModal(true);
      }
    } catch (e) {
      console.error("Error saving resume", e);
      setAlertMsg("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const checkIsMobile = () => {
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileUA || window.innerWidth <= 992;
  };

  const checkIsSmallMobile = () => {
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileUA || window.innerWidth <= 768;
  };
  
  const [isMobile, setIsMobile] = useState(checkIsMobile());
  const [isSmallMobile, setIsSmallMobile] = useState(checkIsSmallMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
      setIsSmallMobile(checkIsSmallMobile());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    setShowResetModal(true);
  };

  const executeReset = () => {
    updateData(initialResumeData);
    setShowResetModal(false);
  };

  const executeNewResume = () => {
    updateData(initialResumeData);
    setTemplate(newResumeTemplate);
    setResumeId(null);
    setResumeName(newResumeName || 'Untitled Resume');
    setShowNewResumeModal(false);
    navigate('/resume-builder', { replace: true });
  };

  const handleNewResumeClick = () => {
    if (!auth.currentUser) {
      setShowAuthPrompt(true);
      return;
    }
    setPendingNewResume(true);
    if (!resumeName) {
      setResumeName(data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Untitled Resume');
    }
    setShowSaveModal(true);
  };

  const resumeRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  React.useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Leave 48px padding on both sides (96px total) for breathing room
        const availableWidth = entry.contentRect.width - 96;
        // Calculate the scale to fit exactly 794px into available width, max 0.75
        setScale(Math.min(0.75, availableWidth / 794));
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${data.personalInfo.fullName || 'Resume'}_CareerForge`,
  });

  return (
    <div className="resume-layout" style={{ 
      height: isMobile ? 'auto' : 'calc(100vh - 72px)', 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      overflow: isMobile ? 'visible' : 'hidden', 
      marginBottom: '4rem' 
    }}>
      
      {/* Editor Pane */}
      <div className="editor-pane" style={{ 
        width: isMobile ? '100%' : '43%', 
        height: isMobile ? 'auto' : '100%',
        padding: isMobile ? 'var(--space-md)' : 'var(--space-xl)', 
        overflowY: isMobile ? 'visible' : 'auto', 
        backgroundColor: 'var(--color-canvas-base)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ margin: 0 }}>Build Resume</h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setShowATSChecker(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.875rem' }}>
              <Search size={16} /> ATS Match
            </Button>
            <Button variant="primary" onClick={() => setShowAIGenerator(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wand2 size={16} /> Auto-Generate
            </Button>
          </div>
        </div>
        
        {/* Navigation for sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: isSmallMobile ? 'wrap' : 'nowrap', width: '100%' }}>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'personal' ? 'primary' : 'ghost'} onClick={() => setActiveTab('personal')}>
              Personal Info
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'education' ? 'primary' : 'ghost'} onClick={() => setActiveTab('education')}>
              Education
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'experience' ? 'primary' : 'ghost'} onClick={() => setActiveTab('experience')}>
              Experience
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'projects' ? 'primary' : 'ghost'} onClick={() => setActiveTab('projects')}>
              Projects
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'skills' ? 'primary' : 'ghost'} onClick={() => setActiveTab('skills')}>
              Skills
            </Button>
          </div>
          
          {/* Row 2 */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: isSmallMobile ? 'wrap' : 'nowrap', width: '100%' }}>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'certifications' ? 'primary' : 'ghost'} onClick={() => setActiveTab('certifications')}>
              Certifications
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'achievements' ? 'primary' : 'ghost'} onClick={() => setActiveTab('achievements')}>
              Achievements
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'languages' ? 'primary' : 'ghost'} onClick={() => setActiveTab('languages')}>
              Languages
            </Button>
            <Button style={{ flex: isSmallMobile ? '1 1 calc(50% - 8px)' : 1, whiteSpace: 'nowrap', paddingLeft: '8px', paddingRight: '8px', fontSize: '0.85rem' }} variant={activeTab === 'interests' ? 'primary' : 'ghost'} onClick={() => setActiveTab('interests')}>
              Interests
            </Button>
          </div>
        </div>

        <Card>
          {activeTab === 'personal' && <PersonalInfoForm />}
          {activeTab === 'education' && <EducationForm />}
          {activeTab === 'experience' && <ExperienceForm />}
          {activeTab === 'projects' && <ProjectsForm />}
          {activeTab === 'skills' && <SkillsForm />}
          {activeTab === 'certifications' && <CertificationsForm />}
          {activeTab === 'achievements' && <AchievementsForm />}
          {activeTab === 'languages' && <LanguagesForm />}
          {activeTab === 'interests' && <InterestsForm />}
        </Card>

        {/* Form Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <div>
            {['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'].indexOf(activeTab) > 0 && (
              <Button 
                variant="secondary" 
                onClick={() => {
                  const tabs = ['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'];
                  setActiveTab(tabs[tabs.indexOf(activeTab) - 1]);
                }}
              >
                Back
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'].indexOf(activeTab) < 8 && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  const tabs = ['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'];
                  setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
                }}
              >
                Skip
              </Button>
            )}
            {['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'].indexOf(activeTab) < 8 ? (
              <Button 
                variant="primary" 
                onClick={() => {
                  const tabs = ['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'interests'];
                  setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
                }}
              >
                Next Step
              </Button>
            ) : (
              <Button variant="primary" onClick={onSaveClick}>
                Finish & Save
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="preview-pane" style={{ 
        width: isMobile ? '100%' : '57%', 
        minHeight: isMobile ? '700px' : 'auto',
        backgroundColor: 'var(--color-subtle-surface)', 
        borderLeft: isMobile ? 'none' : '1px solid var(--color-structural-border)',
        borderTop: isMobile ? '1px solid var(--color-structural-border)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px',
          borderBottom: '1px solid var(--color-structural-border)',
          backgroundColor: 'var(--color-subtle-surface)',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.25rem', flexWrap: 'wrap' }}>
            Live Preview 
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400, marginTop: '2px' }}>
              ({selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template)
            </span>
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={handleReset} style={{ padding: '6px 16px', fontSize: '0.875rem', height: 'auto', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)' }}>
              <RotateCcw size={16} /> Reset
            </Button>
            <Button variant="secondary" onClick={onSaveClick} disabled={isSaving} style={{ padding: '6px 16px', fontSize: '0.875rem', height: 'auto', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => handlePrint()} style={{ padding: '6px 16px', fontSize: '0.875rem', height: 'auto', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={16} /> Download PDF
            </Button>
            <Button variant="secondary" onClick={handleNewResumeClick} style={{ padding: '6px 16px', fontSize: '0.875rem', height: 'auto', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FilePlus size={16} /> New Resume
            </Button>
          </div>
        </div>
        
        <div 
          ref={previewContainerRef}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: 'var(--space-xl)',
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          {/* We lock the document to exactly 794px x 1123px (A4) and scale it down */}
          <div style={{ 
            width: '794px', 
            height: '1123px',
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            marginBottom: `calc(1123px * ${scale} - 1123px)` // fix height calculation after scaling
          }}>
            <div ref={resumeRef} style={{ width: '100%' }}>
              {selectedTemplate === 'classic' && <ClassicTemplate />}
              {selectedTemplate === 'modern' && <ModernTemplate />}
              {selectedTemplate === 'professional' && <ProfessionalTemplate />}
              {selectedTemplate === 'standard' && <StandardTemplate />}
              {selectedTemplate === 'creative' && <CreativeTemplate />}
              {selectedTemplate === 'elegant' && <ElegantTemplate />}
              {selectedTemplate === 'minimal' && <MinimalTemplate />}
              {selectedTemplate === 'tech' && <TechTemplate />}
              {selectedTemplate === 'bold' && <BoldTemplate />}
              {selectedTemplate === 'executive' && <ExecutiveTemplate />}
              {selectedTemplate === 'ivyleague' && <IvyLeagueTemplate />}
              {selectedTemplate === 'creative_director' && <CreativeDirectorTemplate />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-text)' }}>Save Resume</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Resume Name</label>
              <input 
                type="text" 
                value={resumeName} 
                onChange={(e) => setResumeName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                autoFocus
              />
            </div>

            {resumeId && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>How would you like to save this?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Button variant="primary" onClick={() => executeSave(false)} disabled={isSaving} style={{ width: '100%' }}>
                    {isSaving ? 'Saving...' : 'Update Existing Resume'}
                  </Button>
                  <Button variant="secondary" onClick={() => executeSave(true)} disabled={isSaving} style={{ width: '100%' }}>
                    {isSaving ? 'Saving...' : 'Save as New Copy'}
                  </Button>
                </div>
              </div>
            )}

            {!resumeId && (
              <div style={{ marginBottom: '1.5rem' }}>
                <Button variant="primary" onClick={() => executeSave(false)} disabled={isSaving} style={{ width: '100%' }}>
                  {isSaving ? 'Saving...' : 'Save Resume'}
                </Button>
              </div>
            )}

            <Button variant="ghost" onClick={() => { setShowSaveModal(false); setPendingNewResume(false); }} style={{ width: '100%' }}>
              Cancel
            </Button>
          </Card>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-error)' }}>Reset Resume?</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Are you sure you want to completely clear out this resume? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setShowResetModal(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={executeReset} style={{ flex: 1, backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                Reset
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* New Resume Confirmation Modal */}
      {showNewResumeModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Start a new resume</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your previous resume has been saved. Please select a template for your new resume.
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Select Template</label>
              <select
                value={newResumeTemplate}
                onChange={(e) => setNewResumeTemplate(e.target.value as TemplateId)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="professional">Professional</option>
                <option value="standard">Standard</option>
                <option value="creative">Creative</option>
                <option value="elegant">Elegant</option>
                <option value="minimal">Minimal</option>
                <option value="tech">Tech</option>
                <option value="bold">Bold</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setShowNewResumeModal(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={executeNewResume} style={{ flex: 1 }}>
                Create New
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Alert Modal */}
      {alertMsg && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Notice</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {alertMsg}
            </p>
            <Button variant="primary" onClick={() => setAlertMsg(null)} style={{ width: '100%' }}>
              OK
            </Button>
          </Card>
        </div>
      )}

      <AuthModal isOpen={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />

      <AIGeneratorModal isOpen={showAIGenerator} onClose={() => setShowAIGenerator(false)} />
      <ATSCheckerModal isOpen={showATSChecker} onClose={() => setShowATSChecker(false)} />
    </div>
  );
}
