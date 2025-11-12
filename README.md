# FacePrivacy - AI-Powered Face Anonymization Tool

A free, AI-powered web application that automatically detects and blurs background faces in photos while keeping your main subjects clear. Perfect for GDPR compliance, social media privacy, and protecting strangers' identities.

## 🎯 The Problem

- **GDPR Compliance**: European privacy laws require consent before posting identifiable faces
- **Social Media Privacy**: Random people in your photos may not want to be on social media
- **Business Risk**: Companies need to anonymize event photos and marketing materials

## ✨ Features

- **AI Face Detection**: Automatic detection of all faces in photos using HuggingFace models
- **Smart Blurring**: Intelligently blurs detected faces while maintaining photo quality
- **Instant Processing**: Get results in 10-30 seconds
- **Privacy First**: Images processed securely, never stored on servers
- **Free Forever**: Unlimited processing with small watermark
- **No Signup Required**: Start using immediately

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: HuggingFace Inference API (facebook/detr-resnet-50 model)
- **Image Processing**: Jimp (pure JavaScript, no native dependencies)
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- HuggingFace API key ([Get free key here](https://huggingface.co/settings/tokens))

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

4. Add your HuggingFace API key to `.env.local`:
```env
HUGGINGFACE_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
faceprivacy/
├── app/
│   ├── editor/           # Photo editor page
│   │   └── page.tsx
│   ├── api/
│   │   └── process/      # API endpoint for face detection & blurring
│   │       └── route.ts
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── public/               # Static assets
├── .env.example          # Environment variables template
└── package.json
```

## 🎨 How It Works

1. **Upload**: User uploads or drags a photo into the editor
2. **Detection**: Image sent to HuggingFace API for face detection using DETR model
3. **Processing**: Detected face regions are blurred using Jimp
4. **Watermark**: Small "FacePrivacy.ai" watermark added to free version
5. **Download**: User downloads the privacy-protected image

## 💰 Monetization Strategy

### Current (MVP):
- **Free**: Unlimited photos with watermark

### Planned:
- **Premium ($19/month)**:
  - No watermark
  - Batch processing (multiple photos at once)
  - Higher resolution output
  - API access
  - Priority processing

## 🔧 API Endpoints

### POST /api/process

Processes an image and returns version with blurred faces.

**Request:**
```typescript
FormData {
  image: File  // JPG, PNG, or HEIC image
}
```

**Response:**
```typescript
{
  processedImage: string,      // Base64-encoded image
  facesDetected: number         // Number of faces found
}
```

## 🎯 Why Users Will Pay (vs. Using ChatGPT)

Unlike asking ChatGPT to explain privacy:

1. **One-Click Solution**: No prompting, no explaining what you want
2. **Actual Processing**: Really blurs faces, not just advice
3. **Batch Processing**: Process 100 event photos at once (Premium)
4. **Professional Output**: Downloadable, watermark-free images
5. **GDPR Compliance**: Official reports for business use
6. **Non-Technical Users**: Many people don't know how to use AI tools

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `HUGGINGFACE_API_KEY` in Environment Variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🔑 Environment Variables

Required:
- `HUGGINGFACE_API_KEY`: Your HuggingFace API token

Optional (for future features):
- `DATABASE_URL`: PostgreSQL for user accounts and history
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: User authentication
- `CLERK_SECRET_KEY`: User authentication
- `STRIPE_SECRET_KEY`: Payment processing
- `STRIPE_WEBHOOK_SECRET`: Payment webhooks
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe client-side

## 📊 Cost Estimation

**HuggingFace API Costs**:
- Face detection: ~$0.02-0.05 per image
- Free tier: 30,000 requests/month
- With freemium model: Most users stay free, power users pay $19/month
- Estimated margin on Premium: ~95% (AI costs minimal)

## 🔒 Security & Privacy

- Images processed in real-time, never stored
- All data transmitted over HTTPS
- API keys stored securely in environment variables
- GDPR compliant by design
- No user tracking on free tier

## 🎯 Future Enhancements

- [ ] Smart detection of "main subjects" vs. "background people"
- [ ] Adjust blur intensity (light, medium, heavy)
- [ ] Replace faces with emoji/pixel art instead of blur
- [ ] Batch processing (upload 50 photos, process all)
- [ ] Browser extension for Instagram/Facebook
- [ ] Mobile app (iOS/Android)
- [ ] Video support (blur faces in videos)
- [ ] API for developers
- [ ] Custom branding for businesses

## 🐛 Known Limitations (MVP)

- Currently blurs ALL detected faces (not just background)
- Processing can take 15-30 seconds for large images
- Requires HuggingFace API (not fully client-side)
- Watermark is text-based (can be cropped out)

## 📈 Growth Strategy

1. **SEO**: Target "GDPR photo compliance", "blur faces in photo"
2. **Reddit/ProductHunt**: Launch on r/privacy, r/gdpr, ProductHunt
3. **Content Marketing**: Blog posts about privacy laws, GDPR fines
4. **Partnerships**: Reach out to event photographers, marketing agencies
5. **Freemium Conversion**: Add premium features users actually want

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your own projects!

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Email: [your-email]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [HuggingFace](https://huggingface.co/)
- Image processing with [Jimp](https://github.com/jimp-dev/jimp)
- UI with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is an MVP. To make it production-ready:
1. Add smarter logic to detect main subjects vs. background
2. Implement authentication for premium features
3. Add Stripe for payments
4. Set up database for usage tracking
5. Improve watermarking (harder to remove)
6. Add rate limiting and abuse prevention
7. Consider legal compliance (terms of service, privacy policy)
8. Add analytics and monitoring
