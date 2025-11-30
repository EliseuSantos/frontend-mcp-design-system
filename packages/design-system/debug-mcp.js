#!/usr/bin/env node

/**
 * Script de debug para testar o servidor MCP
 * Uso: node debug-mcp.js
 */

const MCP_URL = 'http://localhost:13316/mcp';

async function testMCP() {
  console.log('🔍 Testando servidor MCP...\n');

  // Test 1: Health check
  console.log('1️⃣ Testando health check...');
  try {
    const healthRes = await fetch('http://localhost:13316/healthz');
    if (!healthRes.ok) {
      throw new Error(`HTTP ${healthRes.status}: ${healthRes.statusText}`);
    }
    const health = await healthRes.json();
    console.log('✅ Health check OK:', JSON.stringify(health, null, 2));
  } catch (error) {
    console.error('❌ Health check falhou:', error.message);
    console.error('   Certifique-se de que o servidor está rodando: pnpm mcp:dev');
    return;
  }

  // Test 2: Tools list
  console.log('\n2️⃣ Testando tools/list...');
  try {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Tools list response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.result && data.result.tools) {
      console.log(`\n📦 Encontradas ${data.result.tools.length} tools:`);
      data.result.tools.forEach((tool, i) => {
        console.log(`   ${i + 1}. ${tool.name} - ${tool.description}`);
      });
    } else if (data.error) {
      console.error('❌ Erro na resposta:', data.error);
    }
  } catch (error) {
    console.error('❌ Tools list falhou:', error.message);
    if (error.cause) {
      console.error('   Causa:', error.cause);
    }
  }

  // Test 3: Call a tool
  console.log('\n3️⃣ Testando tools/call (list_components)...');
  try {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'list_components',
          arguments: {},
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Tool call response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.result && data.result.components) {
      console.log(`\n📦 Encontrados ${data.result.components.length} componentes`);
    } else if (data.error) {
      console.error('❌ Erro na resposta:', data.error);
    }
  } catch (error) {
    console.error('❌ Tool call falhou:', error.message);
    if (error.cause) {
      console.error('   Causa:', error.cause);
    }
  }

  console.log('\n✨ Debug completo!');
  console.log('\n💡 Dicas:');
  console.log('   - Verifique se o servidor está rodando: pnpm mcp:dev');
  console.log('   - Verifique a URL no .cursor/mcp.json: http://localhost:13316/mcp');
  console.log('   - Recarregue o Cursor/VS Code após mudanças');
  console.log('   - Ative logs detalhados: LOG_LEVEL=debug pnpm mcp:dev');
}

testMCP().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
