# Cursor Integration

Integrate N4tzzOfficial with Cursor IDE to route your AI requests through N4tzzOfficial's intelligent routing system.

## Prerequisites

- Cursor IDE installed
- Cursor Pro account (required for custom API endpoints)
- N4tzzOfficial cloud endpoint configured
- API key from N4tzzOfficial dashboard

## ⚠️ Important Notes

> **Cloud Endpoint Required**: Cursor routes requests through its own server and does not support localhost endpoints. You must use the N4tzzOfficial cloud endpoint: `https://n4tzz.com`

> **Cursor Pro Required**: This feature requires a Cursor Pro account to use custom API endpoints.

## Setup

### 1. Open Cursor Settings

1. Open Cursor IDE
2. Go to **Settings** (Cmd/Ctrl + ,)
3. Navigate to **Models** section

### 2. Enable OpenAI API

1. Find the **OpenAI API key** option
2. Enable the toggle to activate custom API configuration

### 3. Configure Base URL

Set the base URL to N4tzzOfficial cloud endpoint:

```
https://n4tzz.com
```

**Steps:**
1. In the Models settings, locate the **Base URL** field
2. Enter: `https://n4tzz.com`
3. Click **Save**

### 4. Add API Key

1. In the **API Key** field, enter your N4tzzOfficial API key
2. You can find your API key in the N4tzzOfficial dashboard under **Settings → API Keys**
3. Click **Save**

### 5. Add Custom Model

1. Click **View All Models** button
2. Click **Add Custom Model**
3. Enter the model name from your N4tzzOfficial configuration (e.g., `gpt-4`, `claude-opus-4-5`, etc.)
4. Click **Add**

### 6. Select Model

1. In the Cursor chat interface, click the model selector dropdown
2. Choose your custom model from the list
3. Start using N4tzzOfficial with Cursor!

## Configuration Example

Your Cursor settings should look like this:

```
OpenAI API: ✓ Enabled
Base URL: https://n4tzz.com
API Key: sk-N4tzzOfficial-xxxxxxxxxxxxx
Custom Models: gpt-4, claude-opus-4-5, gemini-2.0-flash
```

## Available Models

You can use any model configured in your N4tzzOfficial dashboard. Common examples:

| Model Name | Provider | Description |
|------------|----------|-------------|
| `gpt-4` | OpenAI | GPT-4 Turbo |
| `gpt-4o` | OpenAI | GPT-4 Optimized |
| `claude-opus-4-5` | Anthropic | Claude Opus 4.5 |
| `claude-sonnet-4-5` | Anthropic | Claude Sonnet 4.5 |
| `gemini-2.0-flash` | Google | Gemini 2.0 Flash |

## Usage

### Chat Interface

1. Open Cursor chat (Cmd/Ctrl + L)
2. Select your model from the dropdown
3. Start chatting with AI through N4tzzOfficial

### Inline Code Generation

1. Select code in your editor
2. Press Cmd/Ctrl + K
3. Enter your prompt
4. Cursor will use N4tzzOfficial to generate code

### Code Explanation

1. Select code in your editor
2. Press Cmd/Ctrl + L
3. Ask "Explain this code"
4. Get AI-powered explanations through N4tzzOfficial

## Troubleshooting

### "Invalid API Key" Error

1. Verify your API key in N4tzzOfficial dashboard
2. Make sure you copied the entire key including the `sk-N4tzzOfficial-` prefix
3. Check that the API key has not expired
4. Try regenerating a new API key

### "Model Not Found" Error

1. Verify the model name matches exactly with your N4tzzOfficial configuration
2. Check that the provider connection is active in N4tzzOfficial dashboard
3. Ensure the model is available in your connected providers
4. Try using the full model name (e.g., `openai/gpt-4` instead of `gpt-4`)

### Connection Issues

1. Verify you are using the cloud endpoint: `https://n4tzz.com`
2. Check your internet connection
3. Ensure N4tzzOfficial cloud service is operational
4. Try disabling VPN or proxy if enabled

### Localhost Not Working

> **Remember**: Cursor does not support localhost endpoints. You must use the cloud endpoint `https://n4tzz.com`. If you need to use a local N4tzzOfficial instance, consider using a tunneling service like ngrok to expose your local endpoint.

## Cloud Endpoint Setup

If you're running N4tzzOfficial locally and want to use it with Cursor:

1. Enable cloud endpoint in N4tzzOfficial settings
2. Configure your cloud endpoint URL in N4tzzOfficial dashboard
3. Use the cloud URL in Cursor settings
4. Ensure your local N4tzzOfficial instance is accessible from the internet

## Best Practices

1. **Use Model Aliases**: Create short aliases for frequently used models in N4tzzOfficial
2. **Monitor Usage**: Check N4tzzOfficial dashboard for usage statistics and costs
3. **Rotate API Keys**: Regularly rotate your API keys for security
4. **Test Models**: Try different models to find the best one for your use case


