import careersData from '../data/careers.json';

export interface CareerPath {
  id: string;
  title: string;
  overview: string;
  requiredSkills: string[];
  educationPaths: string[];
  skillsToLearn: string[];
  roadmap: string[];
}

export interface UserProfile {
  stream: string;
  interests: string[];
}

export function recommendCareers(profile: UserProfile): CareerPath[] {
  // Simple rule-based engine: score each career based on stream and interest matches
  
  const scoredCareers = careersData.map(career => {
    let score = 0;
    
    // Check stream match
    const streamMatch = career.matchCriteria.streams.some(s => 
      s.toLowerCase() === profile.stream.toLowerCase() || s === 'Any'
    );
    if (streamMatch) score += 2;

    // Check interests match
    const interestMatches = career.matchCriteria.interests.filter(ci => 
      profile.interests.some(ui => ci.toLowerCase().includes(ui.toLowerCase()) || ui.toLowerCase().includes(ci.toLowerCase()))
    );
    score += interestMatches.length;

    return { career, score };
  });

  // Sort by score descending and return top 3 matches
  scoredCareers.sort((a, b) => b.score - a.score);
  
  // Return top 3 that have at least some relevance, or just top 3
  return scoredCareers.slice(0, 3).map(sc => sc.career as CareerPath);
}
