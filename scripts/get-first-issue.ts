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
    console.log('🔍 Fetching first P0 issue...\n');

    const teams = await client.teams();
    const team = teams.nodes[0];

    // Get P0 label
    const labels = await client.issueLabels({
      filter: {
        name: {
          eq: 'p0'
        }
      }
    });

    const p0Label = labels.nodes[0];

    // Get all P0 issues
    const issues = await client.issues({
      filter: {
        labels: {
          some: {
            id: {
              eq: p0Label.id
            }
          }
        }
      },
      orderBy: 'createdAt'
    });

    if (issues.nodes.length === 0) {
      console.log('No P0 issues found.');
      return;
    }

    const firstIssue = issues.nodes[0];

    console.log('📋 FIRST P0 ISSUE:\n');
    console.log(`Title: ${firstIssue.title}`);
    console.log(`Priority: ${firstIssue.priority === 1 ? 'Urgent' : firstIssue.priority === 2 ? 'High' : 'Medium'}`);
    console.log(`Estimate: ${firstIssue.estimate} hours`);
    console.log(`\nDescription:\n${firstIssue.description}`);

    const issueLabels = await firstIssue.labels();
    console.log(`\nLabels: ${issueLabels.nodes.map(l => l.name).join(', ')}`);

    console.log(`\n🔗 View in Linear: ${firstIssue.url}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
