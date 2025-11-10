import https from 'https';

interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description: string;
  state: {
    name: string;
    type: string;
  };
  priority: number;
  estimate: number | null;
  labels: {
    nodes: Array<{ name: string }>;
  };
  branchName: string | null;
  url: string;
  project: {
    name: string;
  } | null;
}

async function getHighestPriorityIssue() {
  const query = `
    query {
      issues(first: 50, filter: {
        project: { name: { eq: "DesignDream" } },
        state: { type: { neq: "completed" } }
      }, orderBy: updatedAt) {
        nodes {
          id
          identifier
          title
          description
          state {
            name
            type
          }
          priority
          estimate
          labels {
            nodes {
              name
            }
          }
          branchName
          url
          project {
            name
          }
        }
      }
    }
  `;

  const postData = JSON.stringify({ query });

  const options = {
    hostname: 'api.linear.app',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY || '',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise<void>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);

          if (jsonData.errors) {
            console.error('GraphQL Errors:', JSON.stringify(jsonData.errors, null, 2));
            reject(new Error('GraphQL errors'));
            return;
          }

          const issues: LinearIssue[] = jsonData.data.issues.nodes;

          if (issues.length === 0) {
            console.log('No open issues found in DesignDream project');
            resolve();
            return;
          }

          // Sort by priority (0 = urgent, 1 = high, 2 = medium, 3 = low, 4 = no priority)
          // Then by whether it has p0, p1 labels
          const sortedIssues = issues.sort((a, b) => {
            const aHasP0 = a.labels.nodes.some(l => l.name.toLowerCase() === 'p0');
            const bHasP0 = b.labels.nodes.some(l => l.name.toLowerCase() === 'p0');

            if (aHasP0 && !bHasP0) return -1;
            if (!aHasP0 && bHasP0) return 1;

            const aHasP1 = a.labels.nodes.some(l => l.name.toLowerCase() === 'p1');
            const bHasP1 = b.labels.nodes.some(l => l.name.toLowerCase() === 'p1');

            if (aHasP1 && !bHasP1) return -1;
            if (!aHasP1 && bHasP1) return 1;

            return (a.priority || 4) - (b.priority || 4);
          });

          console.log('\n=== TOP 5 PRIORITY ISSUES (DesignDream) ===\n');

          for (const issue of sortedIssues.slice(0, 5)) {
            const labels = issue.labels.nodes.map((l) => l.name).join(', ');
            const priorityText =
              issue.priority === 0 ? 'Urgent' :
              issue.priority === 1 ? 'High' :
              issue.priority === 2 ? 'Medium' :
              issue.priority === 3 ? 'Low' : 'None';

            console.log(`[${issue.identifier}] ${issue.title}`);
            console.log(`  Project: ${issue.project?.name || 'None'}`);
            console.log(`  Status: ${issue.state.name} (${issue.state.type})`);
            console.log(`  Priority: ${priorityText}`);
            console.log(`  Labels: ${labels || 'none'}`);
            console.log(`  Estimate: ${issue.estimate || 'none'}`);
            console.log(`  Branch: ${issue.branchName || 'none'}`);
            console.log(`  URL: ${issue.url}`);
            console.log('');
          }

          console.log(`\nTotal open issues: ${issues.length}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

getHighestPriorityIssue().catch(console.error);
