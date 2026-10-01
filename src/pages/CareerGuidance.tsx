import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getCareerGuidance, askCareerQuestion } from '../services/ai';
import { trackCareerGuidanceSession } from '../services/adminService';
import CreatableSelect from 'react-select/creatable';
import { MessageSquare, X, Send, Bot, User, Map } from 'lucide-react';

const commonInterests = [
  {
    label: 'Technology & Computing',
    options: [
      { value: 'Coding / Open Source', label: 'Coding / Open Source' },
      { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
      { value: 'Data Science / Analytics', label: 'Data Science / Analytics' },
      { value: 'Cybersecurity', label: 'Cybersecurity' },
      { value: 'Game Development', label: 'Game Development' },
      { value: 'Cloud Computing', label: 'Cloud Computing' },
      { value: 'Internet of Things (IoT)', label: 'Internet of Things (IoT)' },
      { value: 'Robotics', label: 'Robotics' },
      { value: 'Blockchain / Crypto', label: 'Blockchain / Crypto' },
    ]
  },
  {
    label: 'Arts & Design',
    options: [
      { value: 'Photography', label: 'Photography' },
      { value: 'Graphic Design', label: 'Graphic Design' },
      { value: 'UI/UX Design', label: 'UI/UX Design' },
      { value: 'Animation / 3D Modeling', label: 'Animation / 3D Modeling' },
      { value: 'Fashion Design', label: 'Fashion Design' },
      { value: 'Interior Design', label: 'Interior Design' },
      { value: 'Painting / Drawing', label: 'Painting / Drawing' },
      { value: 'Video Editing', label: 'Video Editing' },
      { value: 'Music Production', label: 'Music Production' },
      { value: 'Creative Writing', label: 'Creative Writing' },
      { value: 'Architecture', label: 'Architecture' },
    ]
  },
  {
    label: 'Business & Management',
    options: [
      { value: 'Entrepreneurship', label: 'Entrepreneurship' },
      { value: 'Marketing / SEO', label: 'Marketing / SEO' },
      { value: 'Finance & Investing', label: 'Finance & Investing' },
      { value: 'Human Resources', label: 'Human Resources' },
      { value: 'Project Management', label: 'Project Management' },
      { value: 'Sales & Negotiation', label: 'Sales & Negotiation' },
      { value: 'Consulting', label: 'Consulting' },
    ]
  },
  {
    label: 'Healthcare & Wellness',
    options: [
      { value: 'Medicine / Nursing', label: 'Medicine / Nursing' },
      { value: 'Public Health', label: 'Public Health' },
      { value: 'Nutrition & Dietetics', label: 'Nutrition & Dietetics' },
      { value: 'Mental Health / Psychology', label: 'Mental Health / Psychology' },
      { value: 'Physical Therapy', label: 'Physical Therapy' },
      { value: 'Yoga / Meditation', label: 'Yoga / Meditation' },
    ]
  },
  {
    label: 'Sports & Outdoors',
    options: [
      { value: 'E-sports / Competitive Gaming', label: 'E-sports / Competitive Gaming' },
      { value: 'Football / Soccer', label: 'Football / Soccer' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Tennis', label: 'Tennis' },
      { value: 'Swimming', label: 'Swimming' },
      { value: 'Running / Marathons', label: 'Running / Marathons' },
      { value: 'Fitness / Gym', label: 'Fitness / Gym' },
      { value: 'Rock Climbing', label: 'Rock Climbing' },
      { value: 'Hiking / Trekking', label: 'Hiking / Trekking' },
      { value: 'Cycling', label: 'Cycling' },
      { value: 'Martial Arts', label: 'Martial Arts' },
    ]
  },
  {
    label: 'Science & Academia',
    options: [
      { value: 'Astronomy', label: 'Astronomy' },
      { value: 'Physics', label: 'Physics' },
      { value: 'Chemistry', label: 'Chemistry' },
      { value: 'Biology / Biotechnology', label: 'Biology / Biotechnology' },
      { value: 'History', label: 'History' },
      { value: 'Philosophy', label: 'Philosophy' },
      { value: 'Sociology', label: 'Sociology' },
      { value: 'Political Science', label: 'Political Science' },
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
      { value: 'Content Creation / Vlogging', label: 'Content Creation / Vlogging' },
      { value: 'Podcasting', label: 'Podcasting' },
      { value: 'DIY / Crafting', label: 'DIY / Crafting' },
    ]
  }
];

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

const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: 'var(--color-structural-border)',
    color: 'var(--text-primary)',
    minHeight: '40px'
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
  singleValue: (base: any) => ({
    ...base,
    color: 'var(--text-primary)'
  }),
  input: (base: any) => ({
    ...base,
    color: 'var(--text-primary)'
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

export function CareerGuidance() {
  const [profile, setProfile] = useState({
    educationLevel: '11th',
    stream: '',
    interests: [] as string[],
    question: ''
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [selectedCareer, setSelectedCareer] = useState<any>(null);

  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [asking, setAsking] = useState(false);

  // Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hi! I am your AI Career Assistant. Choose a career or ask me to generate a roadmap for you!' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const guidance = await getCareerGuidance(profile);
      setResults(guidance);
      trackCareerGuidanceSession(profile, guidance);
      setSelectedCareer(null);
      setFollowUpQuestion('');
    } catch (error) {
      alert("Failed to generate career guidance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e?: React.FormEvent, directQuestion?: string) => {
    if (e) e.preventDefault();
    const questionToAsk = directQuestion || followUpQuestion;
    if (!questionToAsk.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user' as const, text: questionToAsk }];
    setChatMessages(newMessages);
    setFollowUpQuestion('');
    setAsking(true);
    setIsChatOpen(true); // Open chat if not open

    try {
      const contextProfile = selectedCareer 
        ? { ...profile, selectedCareerContext: selectedCareer }
        : profile;
      const answer = await askCareerQuestion(questionToAsk, contextProfile);
      setChatMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process your request right now. Please try again." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="container mt-xl mb-xl" style={{ paddingBottom: '4rem' }}>
      <div className="mb-xl">
        <h1>Career Guidance</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore career paths based on your education, interests, skills, and goals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
        
        {/* Profile Form */}
        {!results && (
          <Card className="animate-fade-in-up glass-panel">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Education Level / Degree</label>
                  <CreatableSelect
                    isClearable
                    styles={customStyles}
                    value={profile.educationLevel ? { label: profile.educationLevel, value: profile.educationLevel } : null}
                    options={Object.keys(degreeFields).map(deg => ({ label: deg, value: deg }))}
                    onChange={(selectedOption: any) => {
                      setProfile({...profile, educationLevel: selectedOption ? selectedOption.label : ''});
                    }}
                    placeholder="Type or select..."
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Stream / Field of Study</label>
                  <CreatableSelect
                    isClearable
                    styles={customStyles}
                    value={profile.stream ? { label: profile.stream, value: profile.stream } : null}
                    options={(profile.educationLevel && degreeFields[profile.educationLevel]) ? degreeFields[profile.educationLevel].map(f => ({ label: f, value: f })) : []}
                    onChange={(selectedOption: any) => {
                      setProfile({...profile, stream: selectedOption ? selectedOption.label : ''});
                    }}
                    placeholder="Type or select..."
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Interests</label>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '0.75rem', marginTop: 0 }}>Select up to 5</p>
                <CreatableSelect
                  isMulti
                  isClearable
                  styles={customStyles}
                  value={profile.interests.map(interest => ({ label: interest, value: interest }))}
                  options={commonInterests}
                  onChange={(selectedOptions: any) => {
                    setProfile({ ...profile, interests: selectedOptions ? selectedOptions.map((o: any) => o.label).slice(0, 5) : [] });
                  }}
                  placeholder="Type or select interests..."
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <label style={{ fontSize: '14px', fontWeight: 500 }}>What are you looking for? (Optional)</label>
                <textarea 
                  rows={2}
                  value={profile.question}
                  onChange={e => setProfile({...profile, question: e.target.value})}
                  placeholder="Describe your career goal or question..."
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-base)', border: '1px solid var(--color-structural-border)', fontFamily: 'var(--font-family)', backgroundColor: 'transparent', color: 'var(--text-primary)', resize: 'none', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginTop: 'var(--space-sm)' }}>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Analyzing your profile...' : 'Get Career Guidance'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading && !results && (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0', color: 'var(--color-primary)' }}>
            <h2>✨ Analyzing your profile...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>This usually takes a few seconds.</p>
          </div>
        )}

        {/* AI Results */}
        {results && !selectedCareer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Your Career Guidance</h2>
              <Button variant="secondary" onClick={() => setResults(null)}>Edit Profile</Button>
            </div>
            
            <Card className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface-hover)', borderLeft: '4px solid var(--color-primary)' }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{results.summary}</p>
            </Card>

            <div>
              <h3 className="mb-md">Career Paths to Explore</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                {results.careerPaths?.map((path: any, index: number) => (
                  <Card key={index} className={`animate-fade-in-up stagger-${(index % 5) + 1} hover-lift`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>{path.name}</h4>
                    <p style={{ fontSize: '16px', marginBottom: '1rem', flex: 1, lineHeight: 1.6 }}>{path.shortDescription}</p>
                    <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ display: 'block', fontSize: '15px', marginBottom: '0.35rem' }}>Why it may suit you:</strong>
                      <span style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'block' }}>{path.whyItFits}</span>
                    </div>
                    <Button variant="secondary" onClick={() => setSelectedCareer(path)} style={{ width: '100%' }}>Explore Career</Button>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-md">Your Next Steps</h3>
              <Card className="animate-fade-in-up stagger-3 hover-lift">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {results.roadmap?.map((step: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', 
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 
                      }}>{idx + 1}</div>
                      <p style={{ margin: 0, marginTop: '4px' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Detailed Career View */}
        {selectedCareer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button variant="secondary" onClick={() => setSelectedCareer(null)}>← Back to Results</Button>
            </div>
            
            <div style={{ borderBottom: '1px solid var(--color-structural-border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>{selectedCareer.name}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedCareer.shortDescription}</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => handleAskQuestion(undefined, `Please generate a highly detailed, step-by-step roadmap for becoming a ${selectedCareer.name}.`)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
              >
                <Map size={18} /> Generate AI Roadmap
              </Button>
            </div>

            <Card className="animate-fade-in-up stagger-1 glass-panel">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>What this career involves</h3>
              <p style={{ lineHeight: 1.7, fontSize: '16px' }}>{selectedCareer.careerDetails.whatItInvolves}</p>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
              <Card className="animate-fade-in-up stagger-2 hover-lift">
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontSize: '1.15rem' }}>Why it matches your profile</h4>
                <p style={{ fontSize: '15.5px', lineHeight: 1.6 }}>{selectedCareer.careerDetails.whyItMatches}</p>
              </Card>

              <Card className="animate-fade-in-up stagger-3 hover-lift">
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontSize: '1.15rem' }}>Important Skills to Develop</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '15.5px', lineHeight: 1.5 }}>
                  {selectedCareer.careerDetails?.importantSkills?.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                </ul>
              </Card>

              <Card className="animate-fade-in-up stagger-4 hover-lift">
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontSize: '1.15rem' }}>Technologies / Subjects</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '15.5px', lineHeight: 1.5 }}>
                  {selectedCareer.careerDetails?.technologiesToExplore?.map((tech: string, i: number) => <li key={i}>{tech}</li>)}
                </ul>
              </Card>

              <Card className="animate-fade-in-up stagger-5 hover-lift">
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontSize: '1.15rem' }}>Example Roles</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '15.5px', lineHeight: 1.5 }}>
                  {selectedCareer.careerDetails?.exampleRoles?.map((role: string, i: number) => <li key={i}>{role}</li>)}
                </ul>
              </Card>
            </div>

            <Card className="animate-fade-in-up stagger-3" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>Project Ideas to Get Started</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '15.5px', lineHeight: 1.5 }}>
                {selectedCareer.careerDetails?.projectIdeas?.map((idea: string, i: number) => <li key={i}>{idea}</li>)}
              </ul>
            </Card>

            <Card className="animate-fade-in-up stagger-4 glass-panel" style={{ border: '1px solid var(--color-primary)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontSize: '1.15rem' }}>Practical Next Steps</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '15.5px', lineHeight: 1.5 }}>
                {selectedCareer.careerDetails?.practicalNextSteps?.map((step: string, i: number) => <li key={i}>{step}</li>)}
              </ul>
            </Card>
          </div>
        )}

      </div>

      {/* Floating AI Assistant Widget */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
        {/* Chat Window */}
        {isChatOpen && (
          <Card className="animate-fade-in-up glass-panel" style={{ width: '380px', height: '500px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid var(--color-primary)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>AI Career Assistant</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-background)' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'ai' ? <Bot size={14} color="var(--color-primary)" /> : <User size={14} color="var(--text-secondary)" />}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{msg.role === 'ai' ? 'AI Assistant' : 'You'}</span>
                  </div>
                  <div style={{ 
                    padding: '0.8rem 1rem', 
                    borderRadius: '12px', 
                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-hover)', 
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    borderBottomRightRadius: msg.role === 'user' ? 0 : '12px',
                    borderBottomLeftRadius: msg.role === 'ai' ? 0 : '12px',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    border: msg.role === 'ai' ? '1px solid var(--color-structural-border)' : 'none'
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              ))}
              {asking && (
                <div style={{ alignSelf: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  AI is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={e => handleAskQuestion(e)} style={{ padding: '1rem', borderTop: '1px solid var(--color-structural-border)', backgroundColor: 'var(--color-surface-elevation)', display: 'flex', gap: '0.5rem' }}>
              <Input 
                placeholder={selectedCareer ? `Ask about ${selectedCareer.name}...` : "Type a question..."}
                value={followUpQuestion}
                onChange={e => setFollowUpQuestion(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" variant="primary" disabled={asking} style={{ padding: '0 1rem' }}>
                <Send size={18} />
              </Button>
            </form>
          </Card>
        )}
        
        {/* Floating Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="hover-lift"
            style={{ 
              width: '60px', height: '60px', borderRadius: '30px', 
              backgroundColor: 'var(--color-primary)', color: 'white', 
              border: 'none', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <MessageSquare size={28} />
            {results && (
              <span style={{ position: 'absolute', top: 0, right: 0, width: '14px', height: '14px', backgroundColor: 'var(--color-error)', borderRadius: '50%', border: '2px solid var(--color-background)' }}></span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
