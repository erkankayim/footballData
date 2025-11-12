import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FacePrivacy
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-700 hover:text-slate-900">
                Home
              </Link>
              <Link
                href="/editor"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include AI-powered face detection and blurring.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="text-5xl font-bold text-slate-900 mb-2">$0</div>
              <p className="text-slate-600">Forever free</p>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-700 mb-4">Perfect for casual users</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">✓</span>
                  <span className="text-slate-700">6 photos per hour</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">✓</span>
                  <span className="text-slate-700">AI face detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">✓</span>
                  <span className="text-slate-700">Automatic blurring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">✓</span>
                  <span className="text-slate-700">No watermark</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">✓</span>
                  <span className="text-slate-700">Ad-supported</span>
                </li>
              </ul>
            </div>

            <Link
              href="/editor"
              className="block w-full bg-slate-100 text-slate-900 py-3 rounded-lg text-center font-semibold hover:bg-slate-200 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-5xl font-bold text-white mb-2">$3</div>
              <p className="text-purple-100">per month</p>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-white mb-4">Best for regular users</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">150 photos per month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">No hourly limits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">No ads</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">Priority processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">Email support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2 text-lg">✓</span>
                  <span className="text-white">History & re-download</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="block w-full bg-white text-purple-600 py-3 rounded-lg text-center font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Coming Soon
            </button>
            <p className="text-xs text-purple-100 text-center mt-2">
              Sign up to get notified when available
            </p>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 rounded-2xl shadow-lg p-8 border-2 border-purple-500">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold text-white mb-3">
                PRO
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Edition</h3>
              <div className="text-5xl font-bold text-white mb-2">$49</div>
              <p className="text-slate-400">per month</p>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-white mb-4">For professionals & businesses</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Unlimited photos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Batch processing (100+ at once)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">API access (1M requests/month)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Advanced blur controls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Remove faces (not just blur)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Custom watermark/branding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Priority support (24h response)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 text-lg">✓</span>
                  <span className="text-slate-300">Team accounts (up to 10 users)</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Coming Soon
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">
              Contact us for enterprise pricing
            </p>
          </div>
        </div>

        {/* Pro Edition Special Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Pro Edition: Where Magic Happens ✨
              </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                Built for photographers, agencies, and businesses that need serious privacy tools
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-bold mb-2">Batch Processing</h3>
                <p className="text-purple-200">
                  Upload 500 event photos, process all at once. Perfect for photographers and event companies.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🔌</div>
                <h3 className="text-xl font-bold mb-2">API Integration</h3>
                <p className="text-purple-200">
                  Integrate face blurring into your app or website. 1M API calls/month included.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-xl font-bold mb-2">Advanced Controls</h3>
                <p className="text-purple-200">
                  Adjust blur intensity, remove faces entirely, replace with emojis or pixel art. Full creative control.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="text-xl font-bold mb-2">White-Label Solution</h3>
                <p className="text-purple-200">
                  Add your own branding, remove ours. Perfect for agencies reselling to clients.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                disabled
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Early Access
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Why is Free tier limited to 6 photos per hour?
              </h3>
              <p className="text-slate-600">
                AI processing costs money! We use ads to cover costs for free users. The 6/hour limit keeps our costs sustainable while giving you plenty of use. Need more? Premium is only $3/month.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I cancel Premium anytime?
              </h3>
              <p className="text-slate-600">
                Absolutely! No contracts, no commitments. Cancel anytime and you'll keep access until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What's included in the Pro Edition API?
              </h3>
              <p className="text-slate-600">
                Full REST API with 1M requests/month, webhooks, batch endpoints, and priority processing. Perfect for integrating into your app or automating workflows.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Do you store my photos?
              </h3>
              <p className="text-slate-600">
                Free tier: Photos processed in real-time, never stored. Premium/Pro: You can choose to save history for re-downloading, but it's optional and you can delete anytime.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What about enterprise needs?
              </h3>
              <p className="text-slate-600">
                Need more than Pro? We offer custom enterprise plans with dedicated infrastructure, SLA guarantees, and custom integrations. Contact us for pricing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/editor"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start with Free Tier →
          </Link>
        </div>
      </div>
    </div>
  );
}
