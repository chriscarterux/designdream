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
  labels: {
    nodes: Array<{ name: string }>;
  };
  branchName: string | null;
}

async function getDesignDreamIssues() {
  const query = `
    query {
      issues(first: 100, filter: {
        or: [
          { title: { contains: "Stripe" } },
          { title: { contains: "Supabase" } },
          { title: { contains: "Auth" } },
          { title: { contains: "Billing" } },
          { title: { contains: "Subscription" } },
          { title: { contains: "Admin" } },
          { title: { contains: "Kanban" } },
          { title: { contains: "SLA" } },
          { title: { contains: "Dashboard" } },
          { title: { contains: "Landing" } },
          { title: { contains: "Request" } },
          { title: { contains: "File" } },
          { title: { contains: "Email" } },
          { title: { contains: "Client" } }
        ]
      }) {
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
          labels {
            nodes {
              name
            }
          }
          branchName
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

          console.log('\n=== DESIGNDREAM LINEAR ISSUES ===\n');

          for (const issue of issues) {
            const labels = issue.labels.nodes.map((l) => l.name).join(', ');
            const status = issue.state.name;
            const stateType = issue.state.type;

            console.log(`[${issue.identifier}] ${issue.title}`);
            console.log(`  Status: ${status} (${stateType})`);
            console.log(`  Priority: ${issue.priority}`);
            console.log(`  Labels: ${labels || 'none'}`);
            console.log(`  Branch: ${issue.branchName || 'none'}`);
            console.log('');
          }

          console.log(`\nTotal issues found: ${issues.length}`);
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

getDesignDreamIssues().catch(console.error);
