# ContractGuard - AI-Powered Contract Analysis

An AI-powered web application that helps freelancers and small businesses analyze contracts to identify risks, hidden clauses, and unfair terms before signing.

## Features

- **AI-Powered Analysis**: Uses Claude AI to analyze contracts comprehensively
- **Risk Detection**: Identifies unfair terms, liability issues, and potential legal problems
- **Plain English Summaries**: Translates complex legal language into understandable explanations
- **Negotiation Tips**: Provides specific recommendations for improving contract terms
- **Multiple Input Methods**: Upload PDF/TXT files or paste contract text directly
- **Beautiful UI**: Modern, responsive design built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd deneme
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
deneme/
├── app/
│   ├── analyze/          # Contract analysis page
│   │   └── page.tsx
│   ├── api/
│   │   └── analyze/      # API endpoint for AI analysis
│   │       └── route.ts
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── public/               # Static assets
├── .env.example          # Environment variables template
└── package.json
```

## How It Works

1. **Upload**: User uploads a contract (PDF/TXT) or pastes text
2. **Analysis**: The contract is sent to Claude API for comprehensive analysis
3. **Results**: AI identifies:
   - Risk score (0-100)
   - Specific issues with severity levels
   - Detailed recommendations
   - Plain English summary

## Monetization Strategy

### Pricing Tiers

1. **Free Trial**: 1 contract analysis
2. **Pay Per Contract**: $29 per analysis
3. **Unlimited Plan**: $99/month for unlimited analyses

### Next Steps for Monetization

- [ ] Integrate Stripe for payments
- [ ] Add user authentication (Clerk)
- [ ] Set up PostgreSQL database
- [ ] Implement usage tracking
- [ ] Add PDF export functionality
- [ ] Create user dashboard

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/contractguard)

## Environment Variables

Required:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

Optional (for future features):
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication
- `CLERK_SECRET_KEY`: Clerk authentication
- `STRIPE_SECRET_KEY`: Stripe payments
- `STRIPE_WEBHOOK_SECRET`: Stripe webhooks
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe client-side

## API Usage

### POST /api/analyze

Analyzes a contract and returns risk assessment.

**Request:**
```typescript
FormData {
  file?: File,  // PDF or TXT file
  text?: string // Raw contract text
}
```

**Response:**
```typescript
{
  riskScore: number,        // 0-100
  findings: [
    {
      title: string,
      description: string,
      severity: "high" | "medium" | "low",
      recommendation: string
    }
  ],
  summary: string
}
```

## Customization

### Changing the AI Model

Edit `app/api/analyze/route.ts`:
```typescript
const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022", // Change this
  // ...
});
```

### Modifying Analysis Criteria

The analysis prompt can be customized in `app/api/analyze/route.ts` to focus on specific contract types or industries.

## Future Enhancements

- [ ] PDF parsing support (currently text only)
- [ ] Multi-language support
- [ ] Contract templates library
- [ ] Comparison with industry standards
- [ ] Email notifications
- [ ] Team collaboration features
- [ ] API for developers
- [ ] Mobile app

## Cost Estimation

**AI API Costs** (Anthropic Claude):
- Average contract: 3,000-5,000 tokens
- Cost per analysis: ~$0.03-0.05
- Profit margin at $29/analysis: ~98%

## Security Notes

- Contracts are NOT stored by default
- All data transmitted over HTTPS
- API keys stored securely in environment variables
- Consider adding rate limiting for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions:
- Open an issue on GitHub
- Email: [your-email]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://anthropic.com/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is a starting point. To make this production-ready and profitable, you'll need to:
1. Add authentication
2. Integrate payment processing
3. Set up a database
4. Implement proper error handling and logging
5. Add analytics and monitoring
6. Consider legal compliance (terms of service, privacy policy)
