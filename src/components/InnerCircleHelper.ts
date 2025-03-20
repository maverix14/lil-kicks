import { getLikesForEntry, getCommentsForEntry } from "@/lib/journalStorage";

/**
 * Helper function to generate anonymous names for Private group
 */
export const generateAnonymousName = (id: string): string => {
  // List of adjectives and nouns for generating names
  const adjectives = [
    'happy', 'quiet', 'calm', 'gentle', 'brave', 
    'wise', 'kind', 'swift', 'bold', 'bright'
  ];
  
  const nouns = [
    'penguin', 'dolphin', 'panda', 'tiger', 'eagle',
    'owl', 'koala', 'rabbit', 'fox', 'bear'
  ];
  
  // Use the id to deterministically select an adjective and noun
  const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const adjectiveIndex = idSum % adjectives.length;
  const nounIndex = Math.floor(idSum / adjectives.length) % nouns.length;
  
  return `${adjectives[adjectiveIndex]}-${nouns[nounIndex]}`;
};

/**
 * Get formatted breakdown of likes and comments by group
 */
export const getLikesAndCommentsBreakdown = (
  entryId: string, 
  sharedWithGroups: string[] = []
) => {
  if (!sharedWithGroups || sharedWithGroups.length === 0) {
    return { likes: 0, comments: 0, breakdown: {} };
  }

  let totalLikes = 0;
  let totalComments = 0;
  const breakdown: Record<string, { likes: number; comments: number }> = {};

  // Get likes and comments from all groups
  const likes = getLikesForEntry(entryId);
  const comments = getCommentsForEntry(entryId);

  totalLikes = likes.length;
  totalComments = comments.length;

  // Create breakdown by group
  // In a real app, this would filter by actual group interactions
  // For now, we'll distribute proportionally
  
  const groupCount = sharedWithGroups.length;
  if (groupCount > 0) {
    const likePerGroup = totalLikes / groupCount;
    const commentsPerGroup = totalComments / groupCount;
    
    // Map group IDs to proper names
    const groupNames: Record<string, string> = {
      'partner': 'Partner',
      'family': 'Family', 
      'friends': 'Friends',
      'private': 'Private'
    };
    
    sharedWithGroups.forEach(group => {
      breakdown[groupNames[group] || group] = { 
        likes: Math.round(likePerGroup), 
        comments: Math.round(commentsPerGroup) 
      };
    });
  }

  return { likes: totalLikes, comments: totalComments, breakdown };
};

/**
 * Format the breakdown for tooltip
 */
export const formatBreakdown = (breakdown: Record<string, { likes: number; comments: number }>) => {
  const parts = [];
  for (const [group, counts] of Object.entries(breakdown)) {
    parts.push(`${group}: ${counts.likes} likes, ${counts.comments} comments`);
  }
  return parts.join('\n');
};
