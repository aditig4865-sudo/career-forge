import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from '../types/resume';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateResume(prompt: string): Promise<Partial<ResumeData>> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are an expert resume writer. Given a brief description of a person's background, generate a professional resume structure. 
Return ONLY valid JSON that matches the following TypeScript interface (excluding the typescript definition, just the JSON object).
Make up reasonable dummy data for dates, names, or locations if not provided, but base the core skills and roles on the prompt.

{
  "personalInfo": {
    "fullName": "Name",
    "email": "email@example.com",
    "phone": "Phone number",
    "location": "Location",
    "portfolio": "Portfolio URL",
    "linkedin": "LinkedIn URL"
  },
  "education": [
    {
      "id": "unique-id",
      "institution": "Institution name",
      "degree": "Degree",
      "fieldOfStudy": "Field",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "score": "GPA or Score"
    }
  ],
  "experience": [
    {
      "id": "unique-id",
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "2-3 bullet points describing achievements, separated by newlines"
    }
  ],
  "projects": [
    {
      "id": "unique-id",
      "title": "Project Title",
      "technologies": "Tech Stack",
      "link": "URL",
      "description": "Project description"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "certifications": [
    {
      "id": "unique-id",
      "name": "Cert Name",
      "issuer": "Issuer",
      "date": "YYYY-MM"
    }
  ],
  "achievements": ["Achievement 1"],
  "languages": ["Language 1"],
  "interests": ["Interest 1"]
}

User Prompt: ${prompt}`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json\n?/, '').replace(/```\n?/, '');
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume from AI.");
  }
}
