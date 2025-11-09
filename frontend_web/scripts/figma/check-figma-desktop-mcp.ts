const FIGMA_MCP_URL = 'http://127.0.0.1:3845/mcp';

async function callMCP(method: string, params: any = {}) {
  const response = await fetch(FIGMA_MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
    }),
  });

  const text = await response.text();

  // Handle SSE format
  if (text.startsWith('event:')) {
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = JSON.parse(line.substring(5).trim());
        return data;
      }
    }
  }

  return JSON.parse(text);
}

async function main() {
  try {
    console.log('=== Checking Figma Desktop MCP Server ===\n');

    // Initialize
    console.log('1. Initializing session...');
    const initResult = await callMCP('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        experimental: {},
        sampling: {}
      },
      clientInfo: {
        name: 'figma-desktop-check',
        version: '1.0.0',
      },
    });

    if (initResult.error) {
      console.error('Initialization failed:', initResult.error);
      return;
    }

    console.log('✓ Initialized successfully');
    console.log('Server:', initResult.result?.serverInfo);
    console.log('Capabilities:', JSON.stringify(initResult.result?.capabilities, null, 2));

    // List resources (開いているFigmaファイル)
    console.log('\n2. Listing available resources (opened Figma files)...');
    const resourcesResult = await callMCP('resources/list', {});

    if (resourcesResult.result) {
      console.log('✓ Found resources:', JSON.stringify(resourcesResult.result, null, 2));
    } else {
      console.log('✗ No resources found or error:', resourcesResult.error);
    }

    // List tools
    console.log('\n3. Listing available tools...');
    const toolsResult = await callMCP('tools/list', {});

    if (toolsResult.result) {
      console.log('✓ Available tools:');
      for (const tool of toolsResult.result.tools || []) {
        console.log(`  - ${tool.name}: ${tool.description}`);
      }
    } else {
      console.log('✗ No tools found or error:', toolsResult.error);
    }

    // List prompts
    console.log('\n4. Listing available prompts...');
    const promptsResult = await callMCP('prompts/list', {});

    if (promptsResult.result) {
      console.log('✓ Available prompts:');
      for (const prompt of promptsResult.result.prompts || []) {
        console.log(`  - ${prompt.name}: ${prompt.description}`);
      }
    } else {
      console.log('✗ No prompts found or error:', promptsResult.error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
