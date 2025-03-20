import { getAllGroups as originalGetAllGroups, InnerCircleGroup } from "./journalStorage";

/**
 * Filter groups to only include the 4 predefined groups: partner, family, friends, private
 * This is a utility function to ensure we only have the correct groups in the system
 */
export const getFilteredGroups = (): InnerCircleGroup[] => {
  const allGroups = originalGetAllGroups();
  
  // Define the 4 predefined groups with correct order
  const predefinedGroupIds = ['partner', 'family', 'friends', 'private'];
  
  // Filter to only include the predefined groups
  const filteredGroups = allGroups.filter(group => 
    predefinedGroupIds.includes(group.id)
  );
  
  // Ensure all 4 predefined groups exist
  const existingGroupIds = filteredGroups.map(g => g.id);
  
  // Create any missing groups
  const missingGroupIds = predefinedGroupIds.filter(id => !existingGroupIds.includes(id));
  
  const completeGroups = [...filteredGroups];
  
  missingGroupIds.forEach(id => {
    completeGroups.push({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      memberCount: 0,
      members: [],
      createdAt: new Date().toISOString()
    });
  });
  
  // Sort groups in the specified order: Partner, Family, Friends, Private
  return completeGroups.sort((a, b) => {
    const order: Record<string, number> = { 
      'partner': 0, 
      'family': 1, 
      'friends': 2, 
      'private': 3 
    };
    
    const aOrder = order[a.id] ?? 99;
    const bOrder = order[b.id] ?? 99;
    
    return aOrder - bOrder;
  });
};

/**
 * A wrapper for getAllGroups that only returns the 4 predefined groups
 */
export const getAllValidGroups = (): InnerCircleGroup[] => {
  return getFilteredGroups();
};

/**
 * This ensures we never store any groups other than the predefined ones
 * Call this whenever saving groups to localStorage to sanitize the data
 */
export const sanitizeGroups = (groups: InnerCircleGroup[]): InnerCircleGroup[] => {
  const validGroups = getFilteredGroups();
  const validGroupIds = validGroups.map(g => g.id);
  
  // For each valid group, find its data in the provided groups array
  return validGroups.map(validGroup => {
    const matchingGroup = groups.find(g => g.id === validGroup.id);
    
    if (matchingGroup) {
      // If it exists in the provided groups, use that data
      return {
        ...validGroup,
        memberCount: matchingGroup.memberCount || 0,
        members: matchingGroup.members || [],
      };
    }
    
    // Otherwise, use the default group
    return validGroup;
  });
};
