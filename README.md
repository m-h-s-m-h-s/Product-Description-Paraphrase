# Product Description Paraphraser

A modern TypeScript application that uses OpenAI's GPT API to intelligently paraphrase product descriptions. Built with clean architecture, comprehensive error handling, and an intuitive command-line interface.

## 🚀 Features

- **Intelligent Paraphrasing**: Leverages OpenAI's GPT models to generate high-quality, simple, and clear paraphrases
- **Length Control**: Generate shorter, similar, or longer paraphrases based on your needs
- **Interactive CLI**: User-friendly command-line interface with colored output
- **Robust Error Handling**: Comprehensive error handling for API issues, rate limits, and validation
- **Modern TypeScript**: Fully typed with strict TypeScript configuration
- **Clean Architecture**: Organized with separation of concerns and modular design
- **Configurable**: Environment-based configuration with validation
- **Logging**: Structured logging with Winston for debugging and monitoring

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
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

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

### Using the CLI

1. **Enter Product Description**: Type or paste your product description. Press Enter twice when done.

2. **Select Target Length** (Optional):
   - Short: Concise version
   - Medium: Similar length
   - Long: Extended version

3. **View Results**: The application will display both the original and paraphrased descriptions using simple, clear language.

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

Select target length for the paraphrase (optional):
[0] Skip (similar to original)
[1] Short - Concise version
[2] Medium - Similar length
[3] Long - Extended version
Choose length: 0

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
├── .env.example         # Example environment variables
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
| `MAX_TOKENS` | Maximum tokens for response | `150` | No |
| `TEMPERATURE` | Sampling temperature (0-2) | `0.7` | No |
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

## 🧪 Architecture and Design

### Clean Architecture Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Dependency Injection**: Services are injected rather than hard-coded
3. **Interface Segregation**: Clear interfaces between layers
4. **Error Handling**: Centralized error handling with custom error types

### Key Components

- **Config Module**: Validates and provides typed configuration
- **Service Layer**: Contains business logic for paraphrasing
- **Utils Layer**: Reusable utilities for logging, validation, and API clients
- **CLI Module**: Handles user interaction and display
- **Type Definitions**: Comprehensive TypeScript types for type safety

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

1. **API Costs**: Using the OpenAI API incurs costs. Monitor your usage in the [OpenAI dashboard](https://platform.openai.com/usage).

2. **Model Selection**: The application uses `gpt-5-nano` by default. You can change the model by updating `OPENAI_MODEL` in your `.env` file.

3. **Rate Limits**: Be aware of OpenAI's rate limits. The application includes retry logic and rate limit handling.

4. **Security**: Never commit your `.env` file or expose your API key in public repositories.
