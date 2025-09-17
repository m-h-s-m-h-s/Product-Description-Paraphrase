# Product Description Paraphraser

A streamlined TypeScript application that automatically converts product descriptions into shorter, clearer versions using OpenAI's gpt-5-nano model. Perfect for creating concise, easy-to-understand product copy.

## 💡 What It Does

This tool takes complex, lengthy product descriptions and transforms them into simple, clear versions that anyone can understand. It's designed for:

- **E-commerce teams** needing consistent, simple product copy
- **Content creators** wanting to simplify technical descriptions
- **Marketers** looking to make products more accessible
- **Anyone** who needs to make product information clearer

**Example transformation:**
- ❌ "This premium leather wallet features multiple card slots, a bill compartment, and RFID protection for secure storage."
- ✅ "A high-quality leather wallet with card slots, bill space, and technology to protect your cards from scanning."

## 🚀 Features

- **Simple & Clear Output**: Automatically generates shorter, easier-to-understand versions of product descriptions
- **One-Step Process**: Just paste your description and get an instant paraphrase - no options to configure
- **Smart Simplification**: Uses gpt-5-nano to maintain meaning while using simpler language
- **Interactive CLI**: Clean command-line interface with colored output for easy reading
- **Enterprise-Ready**: Built with TypeScript, comprehensive error handling, and structured logging
- **Secure Configuration**: Environment-based API key management with validation

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Product-Description-Paraphrase.git
   cd Product-Description-Paraphrase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Open `.env` in your editor and replace the placeholder with your actual OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **Why env.example?** This file serves as a template showing all required environment variables without exposing sensitive data. Your actual `.env` file (with real API keys) should never be committed to version control.

4. **Build the project**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Running the Application

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### How It Works

1. **Start the app** and you'll see the welcome screen
2. **Paste your product description** - press Enter twice when done
3. **Get instant results** - the app automatically creates a shorter, clearer version

That's it! No settings to configure, no options to choose - just simple, effective paraphrasing.

### Example

```
╔════════════════════════════════════════════╗
║     Product Description Paraphraser        ║
║         Powered by OpenAI GPT              ║
╚════════════════════════════════════════════╝

Enter the product description to paraphrase:
(Press Enter twice when done)
> This premium leather wallet features multiple card slots,
> a bill compartment, and RFID protection for secure storage.
> 

⏳ Generating paraphrase...

═══════════════════════════════════════════════

📝 Original Description:
This premium leather wallet features multiple card slots,
a bill compartment, and RFID protection for secure storage.

✨ Paraphrased Description:
This wallet is made from high-quality leather and includes 
several slots for your cards, a space for your bills, and 
special technology that protects your cards from being 
scanned without your permission.

📊 Tokens used: 89
═══════════════════════════════════════════════
```

## 🏗️ Project Structure

```
Product-Description-Paraphrase/
├── src/
│   ├── config/          # Configuration management
│   │   └── index.ts     # Environment validation and config
│   ├── services/        # Business logic
│   │   └── paraphrase.service.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts    # Winston logger setup
│   │   ├── openai-client.ts # OpenAI client wrapper
│   │   └── validation.ts # Input validation
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # Shared types and interfaces
│   ├── cli.ts           # CLI interface components
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── env.example          # Template for environment variables (copy to .env)
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | Yes |
| `OPENAI_MODEL` | GPT model to use | `gpt-5-nano` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `LOG_LEVEL` | Logging level | `info` | No |


## 📝 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with auto-reload
- `npm start` - Run the compiled application
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts

## 🧪 Technical Details

### How It Works Internally

1. **Input Processing**: Validates and sanitizes the product description
2. **AI Prompt**: Sends a carefully crafted prompt to gpt-5-nano asking for a simple, short paraphrase
3. **Response Handling**: Processes the AI response and displays it clearly

### Key Design Decisions

- **Simplicity First**: No configuration options - the app does one thing perfectly
- **Clear Language**: System prompt specifically asks for simple, easy-to-understand language
- **Concise Output**: Always generates shorter versions to improve readability
- **Consistent Results**: gpt-5-nano provides reliable simplification with its built-in constraints
- **Error Recovery**: Gracefully handles API errors, rate limits, and connection issues

## 🐛 Error Handling

The application handles various error scenarios:

- **API Key Errors**: Missing or invalid API keys
- **Network Errors**: Connection issues
- **Rate Limiting**: OpenAI API rate limits
- **Validation Errors**: Invalid input
- **API Errors**: OpenAI API errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [OpenAI API](https://openai.com/)
- Styled with [ANSI color codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- Logging with [Winston](https://github.com/winstonjs/winston)

## ⚠️ Important Notes

### Environment Setup
- **env.example vs .env**: The `env.example` file is a template showing required variables. Copy it to `.env` and add your actual API key.
- **Security**: The `.env` file contains sensitive data and is automatically ignored by git. Never commit it to version control.
- **Getting an API Key**: Sign up at [OpenAI](https://platform.openai.com/api-keys) to get your API key.

### API Usage
1. **Costs**: Using the OpenAI API incurs costs. Monitor your usage in the [OpenAI dashboard](https://platform.openai.com/usage).
2. **Model**: The application uses `gpt-5-nano` by default. You can change this in your `.env` file.
3. **Rate Limits**: The application includes automatic retry logic for rate limit handling.
