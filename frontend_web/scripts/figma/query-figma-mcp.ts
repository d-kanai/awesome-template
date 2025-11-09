import { createInterface } from 'readline';

const FIGMA_MCP_URL = 'http://127.0.0.1:3845/mcp';
const FIGMA_FILE_URL = 'https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=175-4450&m=dev';

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
    const dataLine = lines.find(line => line.startsWith('data:'));
    if (dataLine) {
      return JSON.parse(dataLine.substring(5).trim());
    }
  }

  return JSON.parse(text);
}

async function main() {
  try {
    // Initialize
    console.log('Initializing MCP session...');
    const initResult = await callMCP('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'figma-query-client',
        version: '1.0.0',
      },
    });
    console.log('Initialized:', JSON.stringify(initResult, null, 2));

    // List tools
    console.log('\nListing available tools...');
    const toolsResult = await callMCP('tools/list', {});
    console.log('Tools:', JSON.stringify(toolsResult, null, 2));

    // List resources
    console.log('\nListing available resources...');
    const resourcesResult = await callMCP('resources/list', {});
    console.log('Resources:', JSON.stringify(resourcesResult, null, 2));

    // Get Figma file info if available
    const args = process.argv.slice(2);
    const nodeId = args[0] || '175-4450';

    console.log(`\nQuerying Figma node: ${nodeId}...`);
    const nodeResult = await callMCP('tools/call', {
      name: 'get_node_info',
      arguments: {
        nodeId: nodeId,
      },
    });
    console.log('Node info:', JSON.stringify(nodeResult, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
