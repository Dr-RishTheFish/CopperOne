# Ollama Setup for Penny Chat

Penny now uses Ollama, a local AI model server that runs on your computer. Follow these steps to get it working:

## 1. Install Ollama

### macOS
```bash
# Download and install from https://ollama.com
# Or use Homebrew:
brew install ollama
```

### Windows
Download the installer from https://ollama.com/download

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## 2. Start Ollama

Ollama runs as a background service. After installation, it should start automatically.

**Check if it's running:**
```bash
ollama list
```

If you see a list (even if empty), Ollama is running. If you get an error, start it manually:

**macOS/Linux:**
```bash
ollama serve
```

**Windows:**
Ollama should start automatically. If not, check the Windows Services.

## 3. Download a Model

Penny supports two models. Download at least one:

**Llama 3.2 3B (Recommended - faster):**
```bash
ollama pull llama3.2:3b
```

**Phi-3 Mini (Alternative):**
```bash
ollama pull phi3:mini
```

**Note:** The first download will take a few minutes as it downloads several hundred MB.

## 4. Verify Installation

Test that Ollama is working:
```bash
ollama run llama3.2:3b "Hello, how are you?"
```

If you get a response, Ollama is working correctly!

## 5. Run the App

1. Make sure Ollama is running (`ollama list` should work)
2. Start the React app:
   ```bash
   cd web
   npm start
   ```
3. Navigate to the Penny page in the app
4. The app will connect to Ollama automatically at `http://localhost:11434`

## Troubleshooting

### "Ollama is not running" Error

- Check if Ollama is running: `ollama list`
- If not, start it: `ollama serve`
- Make sure port 11434 is not blocked by a firewall

### "Model not found" Error

- Make sure you've downloaded the model: `ollama pull llama3.2:3b`
- Check available models: `ollama list`
- The model name must match exactly (case-sensitive)

### Connection Issues

- Default URL is `http://localhost:11434`
- If Ollama is running on a different port, set environment variable:
  ```bash
  export REACT_APP_OLLAMA_URL=http://localhost:YOUR_PORT
  ```

### Model Not Responding

- Check Ollama logs for errors
- Try a different model (phi3:mini instead of llama3.2:3b)
- Make sure you have enough RAM (models need 2-4GB)

## Available Models

You can use any Ollama model, but Penny is optimized for:
- `llama3.2:3b` - Fast, good for quick responses
- `phi3:mini` - Smaller alternative

To use a different model, update the `MODEL_MAP` in `web/src/ai/pennyLLM.ts`.

## Performance Tips

- **First response is slow** - The model loads into memory on first use
- **Subsequent responses are faster** - Model stays in memory
- **Use smaller models** - 3B models are faster than 7B+ models
- **Close other apps** - Models use significant RAM

## Security Note

Ollama runs locally on your computer. No data is sent to external servers. All conversations stay on your machine.

