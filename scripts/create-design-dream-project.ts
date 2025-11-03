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
    console.log('🚀 Creating Design Dream project...\n');

    const viewer = await client.viewer;
    console.log(`✅ Authenticated as: ${viewer.name}\n`);

    const teams = await client.teams();
    const team = teams.nodes[0];
    console.log(`📊 Using team: ${team.name}\n`);

    // Check if project already exists
    const projects = await client.projects({
      filter: {
        name: {
          eq: 'Design Dream'
        }
      }
    });

    let project;
    if (projects.nodes.length > 0) {
      project = projects.nodes[0];
      console.log('📁 Project "Design Dream" already exists\n');
    } else {
      // Create the project
      const projectResult = await client.createProject({
        name: 'Design Dream',
        description: 'One-person subscription-based agency offering unlimited design and full-stack development. MVP: 5-day sprint to launch-ready platform.',
        teamIds: [team.id],
        color: '#6E56CF', // Purple color
      });

      project = await projectResult.project;
      console.log('✅ Created project: Design Dream\n');
    }

    // Get all issues from the team
    console.log('🔍 Finding all Design Dream issues...\n');

    // Get all issues from the team
    const issues = await client.issues({
      filter: {
        team: {
          id: {
            eq: team.id
          }
        },
        title: {
          contains: '[P'
        }
      }
    });

    console.log(`📝 Found ${issues.nodes.length} issues to add to project\n`);

    let added = 0;
    let skipped = 0;

    for (const issue of issues.nodes) {
      try {
        // Check if issue is already in the project
        const issueProjects = await issue.project;

        if (issueProjects?.id === project?.id) {
          skipped++;
          continue;
        }

        // Add issue to project
        await client.updateIssue(issue.id, {
          projectId: project?.id,
        });

        added++;
        console.log(`  ✅ Added: ${issue.title}`);
      } catch (error) {
        console.log(`  ❌ Error adding ${issue.title}: ${error}`);
      }
    }

    console.log(`\n🎉 Project organization complete!`);
    console.log(`  ✅ Added to project: ${added} issues`);
    if (skipped > 0) {
      console.log(`  ℹ️  Already in project: ${skipped} issues`);
    }
    console.log(`\n🔗 View project: https://linear.app/${team.key}/project/${project?.id}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
