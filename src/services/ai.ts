const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("Missing Groq API Key in .env.local file");
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "openai/gpt-oss-20b";

export async function getCareerGuidance(profile: any): Promise<any> {
  if (!GROQ_API_KEY) throw new Error("Missing API Key");

  const prompt = `You are an expert career counselor. Analyze the following profile and provide personalized career guidance. 
You MUST return your response as a raw JSON object with NO markdown formatting, NO backticks, and NO extra text.

Required JSON Structure:
{
  "summary": "A short personalized summary explaining what you understood about the student's profile.",
  "careerPaths": [
    {
      "name": "Name of the career",
      "shortDescription": "Brief description",
      "whyItFits": "Why it suits them",
      "skillsToDevelop": ["skill1", "skill2"],
      "careerDetails": {
        "whatItInvolves": "Detailed description",
        "whyItMatches": "Detailed explanation of match",
        "importantSkills": ["skill1", "skill2"],
        "technologiesToExplore": ["tech1", "tech2"],
        "exampleRoles": ["role1", "role2"],
        "projectIdeas": ["idea1", "idea2"],
        "practicalNextSteps": ["step1", "step2"]
      }
    }
  ],
  "roadmap": ["Step 1", "Step 2", "Step 3"]
}

Profile to analyze:
${JSON.stringify(profile, null, 2)}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating career guidance:", error);
    throw error;
  }
}

export async function askCareerQuestion(question: string, contextProfile: any): Promise<string> {
  if (!GROQ_API_KEY) return "Missing API Key";

  const systemMessage = "You are an expert career counselor and AI assistant. Your answers MUST be extremely concise, straight to the point, and brief. Never give long unsolicited explanations. Instead, answer directly and then ask questions like 'Would you like a detailed roadmap for this?' or 'Can I provide more specific skills for this role?'. Only provide the detailed information if the user explicitly asks for it. DO NOT USE ANY MARKDOWN FORMATTING (no bold, no asterisks, no tables, no lists). Respond in plain text only.";
  const prompt = `Student Profile Context:\n${JSON.stringify(contextProfile, null, 2)}\n\nStudent Question: ${question}\n\nPlease provide a helpful answer based on their profile.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI chat response:", error);
    return "I'm sorry, I couldn't process your question right now.";
  }
}
