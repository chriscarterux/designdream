/**
 * Figma File Automation for Client Onboarding
 * Automatically duplicates Figma template files for new clients
 */

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_TEMPLATE_FILE_KEY = process.env.FIGMA_TEMPLATE_FILE_KEY;
const FIGMA_TEAM_ID = process.env.FIGMA_TEAM_ID;

export interface FigmaFileData {
  companyName: string;
  email?: string; // Optional for now - permissions API not yet implemented
}

export interface FigmaFileResult {
  fileKey: string;
  fileUrl: string;
  success: boolean;
  error?: string;
}

interface FigmaFileResponse {
  name: string;
  file_key: string;
  thumbnail_url: string;
  last_modified: string;
}

/**
 * Duplicate Figma template file for a new client
 */
export async function createClientFigmaFile(
  data: FigmaFileData
): Promise<FigmaFileResult> {
  try {
    // Validate required environment variables
    if (!FIGMA_ACCESS_TOKEN) {
      throw new Error('FIGMA_ACCESS_TOKEN is not configured');
    }

    if (!FIGMA_TEMPLATE_FILE_KEY) {
      throw new Error('FIGMA_TEMPLATE_FILE_KEY is not configured');
    }

    if (!FIGMA_TEAM_ID) {
      throw new Error('FIGMA_TEAM_ID is not configured');
    }

    // File name format: "{Company Name} - Design Board"
    const fileName = `${data.companyName} - Design Board`;

    console.log(`Duplicating Figma template for ${data.companyName}...`);

    // API Call: POST /files/{file_key}/copy
    const response = await fetch(
      `${FIGMA_API_URL}/files/${FIGMA_TEMPLATE_FILE_KEY}/copy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          name: fileName,
          team_id: FIGMA_TEAM_ID,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Figma API HTTP error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result: FigmaFileResponse = await response.json();

    // Construct file URL
    const fileUrl = `https://www.figma.com/file/${result.file_key}/${encodeURIComponent(result.name)}`;

    console.log(`✅ Created Figma file: ${result.name}`);
    console.log(`   File Key: ${result.file_key}`);
    console.log(`   URL: ${fileUrl}`);

    // Note: Permissions API would be called here to grant client access
    // For now, this is manual - will be added in a future iteration
    if (data.email) {
      console.log(`⏳ TODO: Grant access to ${data.email} (manual for now)`);
    }

    return {
      fileKey: result.file_key,
      fileUrl,
      success: true,
    };
  } catch (error) {
    console.error('Failed to create Figma file:', error);

    return {
      fileKey: '',
      fileUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Grant client access to Figma file (future implementation)
 * Currently not used - permissions are managed manually
 */
export async function grantFigmaAccess(
  fileKey: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!FIGMA_ACCESS_TOKEN) {
      throw new Error('FIGMA_ACCESS_TOKEN is not configured');
    }

    console.log(`⏳ Granting Figma access to ${email} for file ${fileKey}...`);

    // Note: This endpoint might require different token permissions
    // Leaving unimplemented for now as per requirements
    console.warn('Figma permissions API not yet implemented');

    return {
      success: false,
      error: 'Permissions API not yet implemented',
    };

    /* Future implementation:
    const response = await fetch(
      `${FIGMA_API_URL}/files/${fileKey}/permissions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          email,
          role: 'editor', // or 'viewer'
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Figma API HTTP error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    console.log(`✅ Granted access to ${email}`);

    return { success: true };
    */
  } catch (error) {
    console.error('Failed to grant Figma access:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate Figma template exists and is accessible
 * Useful for health checks during deployment
 */
export async function validateFigmaTemplate(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!FIGMA_ACCESS_TOKEN) {
      throw new Error('FIGMA_ACCESS_TOKEN is not configured');
    }

    if (!FIGMA_TEMPLATE_FILE_KEY) {
      throw new Error('FIGMA_TEMPLATE_FILE_KEY is not configured');
    }

    const response = await fetch(
      `${FIGMA_API_URL}/files/${FIGMA_TEMPLATE_FILE_KEY}`,
      {
        method: 'GET',
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Figma API HTTP error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: { name: string } = await response.json();

    console.log(`✅ Figma template validated: ${data.name}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to validate Figma template:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
