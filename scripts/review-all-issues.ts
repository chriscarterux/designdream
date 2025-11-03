import { LinearClient } from '@linear/sdk';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ LINEAR_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

async function main() {
  try {
    console.log('🔍 Fetching all issues from Linear...\n');

    const teams = await client.teams();
    const team = teams.nodes[0];

    // Get all issues
    const issues = await client.issues({
      filter: {
        team: {
          id: {
            eq: team.id
          }
        }
      }
    });

    console.log(`📋 Total Issues: ${issues.nodes.length}\n`);
    console.log('=' .repeat(80) + '\n');

    for (const issue of issues.nodes) {
      const state = await issue.state;
      const labels = await issue.labels();
      const assignee = await issue.assignee;

      const priorityMap: Record<number, string> = {
        1: '🔴 Urgent',
        2: '🟠 High',
        3: '🟡 Medium',
        4: '🟢 Low',
        0: '⚪ None'
      };

      console.log(`[${issue.identifier}] ${issue.title}`);
      console.log(`Status: ${state?.name || 'Unknown'}`);
      console.log(`Priority: ${priorityMap[issue.priority || 0]}`);
      console.log(`Estimate: ${issue.estimate || 'Not set'} points`);
      console.log(`Labels: ${labels.nodes.map(l => l.name).join(', ') || 'None'}`);
      console.log(`Assignee: ${assignee?.name || 'Unassigned'}`);

      if (issue.description) {
        const shortDesc = issue.description.substring(0, 150);
        console.log(`Description: ${shortDesc}${issue.description.length > 150 ? '...' : ''}`);
      }

      console.log(`🔗 ${issue.url}`);
      console.log('-'.repeat(80) + '\n');
    }

    // Summary by priority
    const byPriority = issues.nodes.reduce((acc, issue) => {
      const priority = issue.priority || 0;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    console.log('\n📊 SUMMARY BY PRIORITY:');
    Object.entries(byPriority).forEach(([priority, count]) => {
      const priorityMap: Record<number, string> = {
        1: '🔴 Urgent',
        2: '🟠 High',
        3: '🟡 Medium',
        4: '🟢 Low',
        0: '⚪ None'
      };
      console.log(`  ${priorityMap[parseInt(priority)]}: ${count} issues`);
    });

    // Summary by state
    const byState: Record<string, number> = {};
    for (const issue of issues.nodes) {
      const state = await issue.state;
      const stateName = state?.name || 'Unknown';
      byState[stateName] = (byState[stateName] || 0) + 1;
    }

    console.log('\n📊 SUMMARY BY STATE:');
    Object.entries(byState).forEach(([state, count]) => {
      console.log(`  ${state}: ${count} issues`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
