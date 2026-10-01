import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Download, Trash2, Type } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useReactToPrint } from 'react-to-print';
import { ClassicTemplate } from '../components/resume/templates/ClassicTemplate';
import { ModernTemplate } from '../components/resume/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/resume/templates/ProfessionalTemplate';
import { StandardTemplate } from '../components/resume/templates/StandardTemplate';
import { ResumeContext } from '../context/ResumeContext';

export function MyResumes() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [printData, setPrintData] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [renameData, setRenameData] = useState<{ id: string, name: string } | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const fetchResumes = async (uid: string) => {
    setLoading(true);
    try {
      // 1. Fetch from NEW structure
      const newResumesRef = collection(db, 'users', uid, 'resumes');
      const qNew = query(newResumesRef);
      const querySnapshotNew = await getDocs(qNew);
      
      // 2. Fetch from OLD structure (fallback)
      const oldResumesRef = collection(db, 'resumes');
      const qOld = query(oldResumesRef, where('userId', '==', uid));
      const querySnapshotOld = await getDocs(qOld);

      const loadedResumes: any[] = [];
      const seenIds = new Set();

      querySnapshotNew.forEach((doc) => {
        const data = doc.data();
        if (!data.isDeleted) {
          loadedResumes.push({ id: doc.id, ...data });
          seenIds.add(doc.id);
        }
      });

      querySnapshotOld.forEach((doc) => {
        if (!seenIds.has(doc.id)) {
          const data = doc.data();
          if (!data.isDeleted) {
            loadedResumes.push({ id: doc.id, ...data });
          }
        }
      });

      // Sort locally by updatedAt descending
      loadedResumes.sort((a, b) => b.updatedAt - a.updatedAt);
      setResumes(loadedResumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchResumes(user.uid);
      } else {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleEdit = (id: string) => {
    navigate(`/resume-builder?id=${id}`);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId || !auth.currentUser) return;
    try {
      // Soft delete from new structure (only updates if it exists)
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'resumes', deleteConfirmId), { isDeleted: true }).catch(() => {});
      // Soft delete from old structure (only updates if it exists)
      await updateDoc(doc(db, 'resumes', deleteConfirmId), { isDeleted: true }).catch(() => {});
      
      fetchResumes(auth.currentUser.uid);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error soft deleting resume:", error);
    }
  };

  const executeRename = async () => {
    if (!renameData || !auth.currentUser) return;
    try {
      const finalName = renameData.name || 'Untitled Resume';
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'resumes', renameData.id), { name: finalName }).catch(() => {});
      await updateDoc(doc(db, 'resumes', renameData.id), { name: finalName }).catch(() => {});
      
      setResumes(prev => prev.map(r => r.id === renameData.id ? { ...r, name: finalName } : r));
      setRenameData(null);
    } catch (error) {
      console.error("Error renaming resume:", error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: printData?.data?.personalInfo?.fullName || 'Resume',
    onAfterPrint: () => setPrintData(null),
  });

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  const handleDownload = (resume: any) => {
    setPrintData(resume);
  };

  return (
    <div className="container" style={{ padding: 'var(--space-2xl) 0', minHeight: 'calc(100vh - 72px - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="mb-md">My Resumes</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>View, edit, and manage your saved resumes.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/resume-builder')}>
          + Create New Resume
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : resumes.length === 0 ? (
        <div style={{ marginTop: '3rem', fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>
          No saved resumes yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resumes.map((resume) => (
            <Card key={resume.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{resume.name || 'Untitled Resume'}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                  Last edited: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" onClick={() => handleEdit(resume.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pencil size={16} /> Edit
                </Button>
                <Button variant="secondary" onClick={() => setRenameData({ id: resume.id, name: resume.name || '' })} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Type size={16} /> Rename
                </Button>
                <Button variant="secondary" onClick={() => handleDownload(resume)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Download PDF
                </Button>
                <Button variant="secondary" onClick={() => setDeleteConfirmId(resume.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)' }}>
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Hidden print container */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        {printData && (
          <ResumeContext.Provider value={{
            data: printData.data,
            templateData: printData.data,
            updateData: () => {},
            selectedTemplate: printData.template,
            setTemplate: () => {}
          }}>
            <div ref={resumeRef} style={{ width: '794px', padding: '20px' }}>
              {printData.template === 'classic' && <ClassicTemplate />}
              {printData.template === 'modern' && <ModernTemplate />}
              {printData.template === 'professional' && <ProfessionalTemplate />}
              {printData.template === 'standard' && <StandardTemplate />}
            </div>
          </ResumeContext.Provider>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-error)' }}>Delete Resume?</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete this resume? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={executeDelete} style={{ flex: 1, backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Rename Modal */}
      {renameData && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="modal-animate-in" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-text)' }}>Rename Resume</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Resume Name</label>
              <input 
                type="text" 
                value={renameData.name} 
                onChange={(e) => setRenameData({ ...renameData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-elevation)', border: '1px solid var(--color-structural-border)', color: 'white', borderRadius: '4px' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setRenameData(null)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={executeRename} style={{ flex: 1 }}>
                Rename
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
