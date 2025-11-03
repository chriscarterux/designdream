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
    console.log('🚀 Creating missing P0 issue...\n');

    const viewer = await client.viewer;
    console.log(`✅ Authenticated as: ${viewer.name}\n`);

    const teams = await client.teams();
    const team = teams.nodes[0];
    console.log(`📊 Using team: ${team.name}\n`);

    // Get labels
    const existingLabels = await client.issueLabels();
    const labelMap = new Map<string, string>();
    for (const label of existingLabels.nodes) {
      labelMap.set(label.name.toLowerCase(), label.id);
    }

    // Get label IDs
    const labelIds = ['infrastructure', 'config', 'p0']
      .map((label) => labelMap.get(label.toLowerCase()))
      .filter((id): id is string => id !== undefined);

    // Create the missing issue
    const result = await client.createIssue({
      teamId: team.id,
      title: '[P0] Configure environment variables and secrets',
      description: `**Labels:** infrastructure, config, p0
**Estimate:** 1 hour

**Description:**
- Set up \`.env.local\` with all required keys
- Configure Supabase connection
- Add placeholder for Stripe (configure later)

**Acceptance Criteria:**
- [ ] \`.env.local\` created from template
- [ ] Supabase keys added
- [ ] App can connect to Supabase
- [ ] No secrets committed to git`,
      priority: 1, // Urgent
      estimate: 1,
      labelIds,
    });

    if (result.success) {
      console.log('✅ Successfully created: [P0] Configure environment variables and secrets');
    } else {
      console.log('❌ Failed to create issue');
    }

    console.log(`\n🔗 View in Linear: https://linear.app/${team.key}/team/${team.key}/all`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
