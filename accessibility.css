// Tool-Tool Relationship Engine for Smart Card Pairing
export interface ToolRelationship {
  toolId: string;
  relatedTools: string[];
  relationshipStrength: number; // 1-10 scale
  relationshipType: 'workflow' | 'category' | 'complementary' | 'sequential';
}

export interface ToolContext {
  id: string;
  primaryTags: string[];
  secondaryTags: string[];
  userGoals: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  timeToComplete: 'quick' | 'medium' | 'extended';
  exportHeavy: boolean;
  requiresFollowUp: boolean;
}

// Enhanced tool context mapping with relationship intelligence
export const toolContextMap: Record<string, ToolContext> = {
  'self-employed-tax-estimator': {
    id: 'self-employed-tax-estimator',
    primaryTags: ['finance', 'tax', 'freelance'],
    secondaryTags: ['business', 'income', 'deductions'],
    userGoals: ['tax-planning', 'business-finance', 'compliance'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'freelance-proposal-estimator': {
    id: 'freelance-proposal-estimator',
    primaryTags: ['freelance', 'business', 'pricing'],
    secondaryTags: ['proposals', 'rates', 'projects'],
    userGoals: ['pricing-strategy', 'business-growth', 'client-management'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'hourly-rate-calculator': {
    id: 'hourly-rate-calculator',
    primaryTags: ['freelance', 'pricing', 'business'],
    secondaryTags: ['rates', 'income', 'strategy'],
    userGoals: ['pricing-strategy', 'income-optimization'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'debt-snowball-tracker': {
    id: 'debt-snowball-tracker',
    primaryTags: ['finance', 'debt', 'planning'],
    secondaryTags: ['payoff', 'strategy', 'tracking'],
    userGoals: ['debt-freedom', 'financial-planning'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'budget-card-conveyor': {
    id: 'budget-card-conveyor',
    primaryTags: ['finance', 'budgeting', 'planning'],
    secondaryTags: ['expenses', 'income', 'tracking'],
    userGoals: ['financial-control', 'expense-management'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'net-worth-snapshot': {
    id: 'net-worth-snapshot',
    primaryTags: ['finance', 'wealth', 'tracking'],
    secondaryTags: ['assets', 'liabilities', 'progress'],
    userGoals: ['wealth-building', 'financial-awareness'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'savings-goal-tracker': {
    id: 'savings-goal-tracker',
    primaryTags: ['finance', 'savings', 'goals'],
    secondaryTags: ['planning', 'tracking', 'progress'],
    userGoals: ['goal-achievement', 'financial-planning'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'trade-profit-risk-calculator': {
    id: 'trade-profit-risk-calculator',
    primaryTags: ['finance', 'trading', 'risk'],
    secondaryTags: ['profit', 'loss', 'analysis'],
    userGoals: ['trading-strategy', 'risk-management'],
    complexity: 'complex',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'resume-scanner': {
    id: 'resume-scanner',
    primaryTags: ['career', 'resume', 'optimization'],
    secondaryTags: ['job-search', 'ats', 'matching'],
    userGoals: ['job-hunting', 'career-advancement'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'meeting-cost-estimator': {
    id: 'meeting-cost-estimator',
    primaryTags: ['business', 'productivity', 'cost'],
    secondaryTags: ['meetings', 'efficiency', 'analysis'],
    userGoals: ['productivity-optimization', 'cost-awareness'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'fasting-planner': {
    id: 'fasting-planner',
    primaryTags: ['health', 'fasting', 'nutrition'],
    secondaryTags: ['intermittent', 'tracking', 'wellness'],
    userGoals: ['health-improvement', 'weight-management'],
    complexity: 'moderate',
    timeToComplete: 'extended',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'macro-micronutrient-tracker': {
    id: 'macro-micronutrient-tracker',
    primaryTags: ['health', 'nutrition', 'tracking'],
    secondaryTags: ['macros', 'calories', 'diet'],
    userGoals: ['nutrition-optimization', 'health-tracking'],
    complexity: 'moderate',
    timeToComplete: 'extended',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'sleep-debt-calculator': {
    id: 'sleep-debt-calculator',
    primaryTags: ['health', 'sleep', 'tracking'],
    secondaryTags: ['recovery', 'wellness', 'analysis'],
    userGoals: ['sleep-optimization', 'health-improvement'],
    complexity: 'simple',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'event-cost-estimator': {
    id: 'event-cost-estimator',
    primaryTags: ['planning', 'events', 'budgeting'],
    secondaryTags: ['cost', 'organization', 'management'],
    userGoals: ['event-planning', 'budget-control'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'subscription-swap-finder': {
    id: 'subscription-swap-finder',
    primaryTags: ['finance', 'savings', 'alternatives'],
    secondaryTags: ['subscriptions', 'cost-cutting', 'optimization'],
    userGoals: ['cost-reduction', 'financial-optimization'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: false,
    requiresFollowUp: false
  },
  'bill-splitter-pro': {
    id: 'bill-splitter-pro',
    primaryTags: ['finance', 'social', 'splitting'],
    secondaryTags: ['bills', 'groups', 'fairness'],
    userGoals: ['expense-sharing', 'social-finance'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'packing-checklist-generator': {
    id: 'packing-checklist-generator',
    primaryTags: ['travel', 'planning', 'organization'],
    secondaryTags: ['packing', 'checklist', 'preparation'],
    userGoals: ['travel-preparation', 'organization'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'time-blocking-scheduler': {
    id: 'time-blocking-scheduler',
    primaryTags: ['productivity', 'scheduling', 'planning'],
    secondaryTags: ['time-management', 'organization', 'efficiency'],
    userGoals: ['productivity-optimization', 'time-management'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'wedding-budget-planner': {
    id: 'wedding-budget-planner',
    primaryTags: ['planning', 'wedding', 'budgeting'],
    secondaryTags: ['events', 'cost', 'organization'],
    userGoals: ['wedding-planning', 'budget-control'],
    complexity: 'complex',
    timeToComplete: 'extended',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'subscription-purge-tool': {
    id: 'subscription-purge-tool',
    primaryTags: ['finance', 'subscriptions', 'tracking'],
    secondaryTags: ['recurring', 'cost', 'management'],
    userGoals: ['cost-reduction', 'subscription-management'],
    complexity: 'simple',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: true
  },
  'loan-comparison-tool': {
    id: 'loan-comparison-tool',
    primaryTags: ['finance', 'loans', 'comparison'],
    secondaryTags: ['interest', 'rates', 'analysis'],
    userGoals: ['loan-optimization', 'financial-decisions'],
    complexity: 'moderate',
    timeToComplete: 'medium',
    exportHeavy: true,
    requiresFollowUp: false
  },
  'cost-of-living-calculator': {
    id: 'cost-of-living-calculator',
    primaryTags: ['finance', 'location', 'comparison'],
    secondaryTags: ['cost', 'living', 'analysis'],
    userGoals: ['relocation-planning', 'financial-planning'],
    complexity: 'simple',
    timeToComplete: 'quick',
    exportHeavy: true,
    requiresFollowUp: false
  }
};

// Define strong tool relationships for smart pairing
export const toolRelationships: ToolRelationship[] = [
  // FINANCIAL WORKFLOW CLUSTER
  {
    toolId: 'self-employed-tax-estimator',
    relatedTools: ['freelance-proposal-estimator', 'hourly-rate-calculator', 'budget-card-conveyor'],
    relationshipStrength: 9,
    relationshipType: 'workflow'
  },
  {
    toolId: 'freelance-proposal-estimator',
    relatedTools: ['hourly-rate-calculator', 'self-employed-tax-estimator', 'meeting-cost-estimator'],
    relationshipStrength: 8,
    relationshipType: 'workflow'
  },
  {
    toolId: 'hourly-rate-calculator',
    relatedTools: ['freelance-proposal-estimator', 'self-employed-tax-estimator'],
    relationshipStrength: 9,
    relationshipType: 'sequential'
  },

  // DEBT & WEALTH MANAGEMENT CLUSTER
  {
    toolId: 'debt-snowball-tracker',
    relatedTools: ['budget-card-conveyor', 'net-worth-snapshot', 'savings-goal-tracker'],
    relationshipStrength: 8,
    relationshipType: 'workflow'
  },
  {
    toolId: 'budget-card-conveyor',
    relatedTools: ['debt-snowball-tracker', 'net-worth-snapshot', 'savings-goal-tracker'],
    relationshipStrength: 9,
    relationshipType: 'workflow'
  },
  {
    toolId: 'net-worth-snapshot',
    relatedTools: ['budget-card-conveyor', 'savings-goal-tracker', 'debt-snowball-tracker'],
    relationshipStrength: 8,
    relationshipType: 'complementary'
  },
  {
    toolId: 'savings-goal-tracker',
    relatedTools: ['budget-card-conveyor', 'net-worth-snapshot'],
    relationshipStrength: 7,
    relationshipType: 'complementary'
  },

  // HEALTH & WELLNESS CLUSTER
  {
    toolId: 'fasting-planner',
    relatedTools: ['macro-micronutrient-tracker', 'sleep-debt-calculator'],
    relationshipStrength: 9,
    relationshipType: 'workflow'
  },
  {
    toolId: 'macro-micronutrient-tracker',
    relatedTools: ['fasting-planner', 'sleep-debt-calculator'],
    relationshipStrength: 8,
    relationshipType: 'complementary'
  },
  {
    toolId: 'sleep-debt-calculator',
    relatedTools: ['fasting-planner', 'macro-micronutrient-tracker'],
    relationshipStrength: 7,
    relationshipType: 'complementary'
  },

  // BUSINESS & CAREER CLUSTER
  {
    toolId: 'resume-scanner',
    relatedTools: ['meeting-cost-estimator', 'freelance-proposal-estimator'],
    relationshipStrength: 6,
    relationshipType: 'category'
  },
  {
    toolId: 'meeting-cost-estimator',
    relatedTools: ['time-blocking-scheduler', 'freelance-proposal-estimator'],
    relationshipStrength: 7,
    relationshipType: 'workflow'
  },

  // PLANNING & ORGANIZATION CLUSTER
  {
    toolId: 'event-cost-estimator',
    relatedTools: ['wedding-budget-planner', 'bill-splitter-pro'],
    relationshipStrength: 8,
    relationshipType: 'category'
  },
  {
    toolId: 'wedding-budget-planner',
    relatedTools: ['event-cost-estimator', 'savings-goal-tracker'],
    relationshipStrength: 7,
    relationshipType: 'workflow'
  },
  {
    toolId: 'bill-splitter-pro',
    relatedTools: ['event-cost-estimator', 'budget-card-conveyor'],
    relationshipStrength: 6,
    relationshipType: 'complementary'
  },

  // SUBSCRIPTION & COST OPTIMIZATION CLUSTER
  {
    toolId: 'subscription-swap-finder',
    relatedTools: ['subscription-purge-tool', 'budget-card-conveyor'],
    relationshipStrength: 8,
    relationshipType: 'workflow'
  },
  {
    toolId: 'subscription-purge-tool',
    relatedTools: ['subscription-swap-finder', 'budget-card-conveyor'],
    relationshipStrength: 7,
    relationshipType: 'sequential'
  },

  // PRODUCTIVITY & TIME MANAGEMENT
  {
    toolId: 'time-blocking-scheduler',
    relatedTools: ['meeting-cost-estimator', 'packing-checklist-generator'],
    relationshipStrength: 6,
    relationshipType: 'category'
  },
  {
    toolId: 'packing-checklist-generator',
    relatedTools: ['time-blocking-scheduler', 'cost-of-living-calculator'],
    relationshipStrength: 5,
    relationshipType: 'category'
  },

  // FINANCIAL ANALYSIS & COMPARISON
  {
    toolId: 'trade-profit-risk-calculator',
    relatedTools: ['net-worth-snapshot', 'loan-comparison-tool'],
    relationshipStrength: 6,
    relationshipType: 'category'
  },
  {
    toolId: 'loan-comparison-tool',
    relatedTools: ['debt-snowball-tracker', 'cost-of-living-calculator'],
    relationshipStrength: 7,
    relationshipType: 'workflow'
  },
  {
    toolId: 'cost-of-living-calculator',
    relatedTools: ['budget-card-conveyor', 'loan-comparison-tool'],
    relationshipStrength: 6,
    relationshipType: 'complementary'
  }
];

// Calculate relationship strength between two tools
export const getRelationshipStrength = (toolA: string, toolB: string): number => {
  const relationshipA = toolRelationships.find(rel => 
    rel.toolId === toolA && rel.relatedTools.includes(toolB)
  );
  const relationshipB = toolRelationships.find(rel => 
    rel.toolId === toolB && rel.relatedTools.includes(toolA)
  );

  if (relationshipA && relationshipB) {
    return Math.max(relationshipA.relationshipStrength, relationshipB.relationshipStrength);
  }
  if (relationshipA) return relationshipA.relationshipStrength;
  if (relationshipB) return relationshipB.relationshipStrength;

  // Calculate contextual similarity if no explicit relationship
  return calculateContextualSimilarity(toolA, toolB);
};

// Calculate similarity based on tool context
export const calculateContextualSimilarity = (toolA: string, toolB: string): number => {
  const contextA = toolContextMap[toolA];
  const contextB = toolContextMap[toolB];

  if (!contextA || !contextB) return 0;

  let similarity = 0;

  // Primary tag overlap (highest weight)
  const primaryOverlap = contextA.primaryTags.filter(tag => 
    contextB.primaryTags.includes(tag)
  ).length;
  similarity += primaryOverlap * 3;

  // Secondary tag overlap
  const secondaryOverlap = contextA.secondaryTags.filter(tag => 
    contextB.secondaryTags.includes(tag)
  ).length;
  similarity += secondaryOverlap * 2;

  // User goal overlap
  const goalOverlap = contextA.userGoals.filter(goal => 
    contextB.userGoals.includes(goal)
  ).length;
  similarity += goalOverlap * 2;

  // Complexity and time similarity
  if (contextA.complexity === contextB.complexity) similarity += 1;
  if (contextA.timeToComplete === contextB.timeToComplete) similarity += 1;
  if (contextA.exportHeavy === contextB.exportHeavy) similarity += 1;

  return Math.min(similarity, 10); // Cap at 10
};

// Get related tools for a given tool
export const getRelatedTools = (toolId: string): string[] => {
  const relationship = toolRelationships.find(rel => rel.toolId === toolId);
  return relationship ? relationship.relatedTools : [];
};

// Get all tools that should be grouped together
export const getToolClusters = (): string[][] => {
  const clusters: string[][] = [];
  const processed = new Set<string>();

  toolRelationships.forEach(relationship => {
    if (!processed.has(relationship.toolId)) {
      const cluster = [relationship.toolId, ...relationship.relatedTools];
      clusters.push(cluster);
      cluster.forEach(toolId => processed.add(toolId));
    }
  });

  return clusters;
};

// Smart grid placement algorithm
export const optimizeToolPlacement = (tools: any[], usageData?: Record<string, number>) => {
  const clusters = getToolClusters();
  const placedTools = new Set<string>();
  const optimizedOrder: any[] = [];

  // First, place tools in relationship clusters
  clusters.forEach(cluster => {
    const clusterTools = tools.filter(tool => 
      cluster.includes(tool.id) && !placedTools.has(tool.id)
    );

    // Sort cluster tools by relationship strength and usage
    clusterTools.sort((a, b) => {
      const usageA = (usageData?.[a.id] || 0);
      const usageB = (usageData?.[b.id] || 0);
      const relationshipA = getRelationshipStrength(cluster[0], a.id);
      const relationshipB = getRelationshipStrength(cluster[0], b.id);
      
      // Combine usage and relationship strength
      const scoreA = usageA * 2 + relationshipA + a.sortWeight;
      const scoreB = usageB * 2 + relationshipB + b.sortWeight;
      
      return scoreB - scoreA;
    });

    clusterTools.forEach(tool => {
      optimizedOrder.push(tool);
      placedTools.add(tool.id);
    });
  });

  // Add remaining tools sorted by popularity and weight
  const remainingTools = tools.filter(tool => !placedTools.has(tool.id));
  remainingTools.sort((a, b) => {
    const usageA = (usageData?.[a.id] || 0);
    const usageB = (usageData?.[b.id] || 0);
    const scoreA = usageA * 2 + a.sortWeight;
    const scoreB = usageB * 2 + b.sortWeight;
    return scoreB - scoreA;
  });

  optimizedOrder.push(...remainingTools);

  return optimizedOrder;
};

// Track tool co-usage for dynamic relationship learning
export const trackToolCoUsage = (toolA: string, toolB: string) => {
  const key = 'toolsweneed_co_usage';
  const coUsage = JSON.parse(localStorage.getItem(key) || '{}');
  const pairKey = [toolA, toolB].sort().join('|');
  
  coUsage[pairKey] = (coUsage[pairKey] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(coUsage));
};

// Get co-usage data for relationship optimization
export const getCoUsageData = (): Record<string, number> => {
  const key = 'toolsweneed_co_usage';
  return JSON.parse(localStorage.getItem(key) || '{}');
};

// Update relationship strengths based on actual usage patterns
export const updateRelationshipsFromUsage = () => {
  const coUsageData = getCoUsageData();
  
  // This would update the relationship strengths based on real usage
  // Implementation would analyze co-usage patterns and adjust relationships
  // For now, we return the current relationships
  return toolRelationships;
};