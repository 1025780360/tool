import type { ToolConfig } from '@/types/tool';

/**
 * Tokenize a search query into individual keywords.
 */
function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/**
 * Check if a single token matches a tool's searchable fields.
 */
function tokenMatches(token: string, tool: ToolConfig): boolean {
  if (tool.name.toLowerCase().includes(token)) return true;
  if (tool.description.toLowerCase().includes(token)) return true;
  if (tool.tags.some((tag) => tag.toLowerCase().includes(token))) return true;
  return false;
}

export interface ScoredTool {
  tool: ToolConfig;
  score: number;
}

/**
 * Search tools by query string.
 * Uses AND logic: all tokens must match.
 * Scores results for sorting: name match > description match > tag match.
 */
export function searchTools(
  tools: ToolConfig[],
  query: string
): ScoredTool[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return tools.map((tool) => ({ tool, score: 0 }));
  }

  const results: ScoredTool[] = [];

  for (const tool of tools) {
    let totalScore = 0;
    let allMatched = true;

    for (const token of tokens) {
      let tokenScore = 0;

      if (tool.name.toLowerCase().includes(token)) {
        tokenScore = tool.name.toLowerCase().startsWith(token) ? 30 : 20;
      } else if (tool.description.toLowerCase().includes(token)) {
        tokenScore = 10;
      } else if (tool.tags.some((tag) => tag.toLowerCase().includes(token))) {
        tokenScore = 5;
      } else {
        allMatched = false;
        break;
      }

      totalScore += tokenScore;
    }

    if (allMatched) {
      results.push({ tool, score: totalScore });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
