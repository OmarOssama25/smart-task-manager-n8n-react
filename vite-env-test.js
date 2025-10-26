// Quick test to verify environment variables are loaded
console.log('🔧 Environment Variable Test:');
console.log('VITE_N8N_WEBHOOK_URL:', import.meta.env.VITE_N8N_WEBHOOK_URL);
console.log('VITE_N8N_AI_WEBHOOK_URL:', import.meta.env.VITE_N8N_AI_WEBHOOK_URL);

if (!import.meta.env.VITE_N8N_WEBHOOK_URL) {
  console.error('❌ Environment variables NOT loaded!');
  console.log('📝 Make sure you have .env or .env.local file in the root directory');
} else {
  console.log('✅ Environment variables loaded successfully!');
}

