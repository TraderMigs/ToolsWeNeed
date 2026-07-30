import { describe, expect, it } from 'vitest';
import { tools } from './tools';
import { toolComponents } from './toolComponents';

describe('tool registry contract', () => {
  it('has a unique route and implementation for every listed tool', () => {
    const ids = tools.map(tool => tool.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(36);
    expect(ids.filter(id => !toolComponents[id])).toEqual([]);
  });

  it('does not expose unlisted component routes', () => {
    const listed = new Set(tools.map(tool => tool.id));
    const extras = Object.keys(toolComponents).filter(id => id !== 'default' && !listed.has(id));
    expect(extras).toEqual([]);
  });
});
