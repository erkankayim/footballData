import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FacePrivacy
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-slate-700 hover:text-slate-900">
                Pricing
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒📸</div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Protect Privacy in Every Photo
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            AI-powered face anonymization that automatically blurs background faces while
            keeping your subjects crystal clear. GDPR compliant, instant, and free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Blurring Free →
            </Link>
            <a
              href="#how-it-works"
              className="bg-white text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors"
            >
              See How It Works
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            No signup required • Process unlimited photos • Instant results
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Face Privacy Matters
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Every photo you post online can expose strangers without their consent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <div className="text-red-600 text-3xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Legal Risk</h3>
              <p className="text-slate-600">
                GDPR and privacy laws require consent before posting identifiable faces online
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <div className="text-orange-600 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Unwanted Exposure</h3>
              <p className="text-slate-600">
                Random people in your photos may not want to be on social media
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <div className="text-purple-600 text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Business Compliance</h3>
              <p className="text-slate-600">
                Companies need to anonymize photos for marketing and documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              AI-powered face detection and smart blurring in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Photo</h3>
              <p className="text-slate-600">
                Drag and drop any photo with people in it. Works with JPG, PNG, HEIC.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Detection</h3>
              <p className="text-slate-600">
                Our AI detects all faces and intelligently determines which are background.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Download Result</h3>
              <p className="text-slate-600">
                Get your privacy-protected photo instantly. Free with watermark.
              </p>
            </div>
          </div>

          {/* Demo Image */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-3">BEFORE</p>
                <div className="bg-slate-100 rounded-lg aspect-[4/3] flex items-center justify-center">
                  <p className="text-slate-400">Original photo with all faces visible</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-3">AFTER</p>
                <div className="bg-slate-100 rounded-lg aspect-[4/3] flex items-center justify-center relative">
                  <p className="text-slate-400">Background faces automatically blurred</p>
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    AI Processed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600">
              Professional-grade privacy protection for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-slate-900 mb-2">Smart Detection</h3>
              <p className="text-sm text-slate-600">
                AI automatically identifies main subjects vs. background people
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-slate-900 mb-2">Instant Processing</h3>
              <p className="text-sm text-slate-600">
                Get results in seconds, no waiting or queues
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-sm text-slate-600">
                Photos processed locally in browser, never stored on servers
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-slate-900 mb-2">High Quality</h3>
              <p className="text-sm text-slate-600">
                Natural-looking blur that maintains photo quality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Perfect For
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Social Media</h3>
              <p className="text-slate-600">
                Post photos from restaurants, events, concerts without exposing strangers
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Businesses</h3>
              <p className="text-slate-600">
                Marketing materials, case studies, event photos - all GDPR compliant
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Content Creators</h3>
              <p className="text-slate-600">
                YouTube thumbnails, blog posts, newsletters with privacy protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-slate-300">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <p className="text-slate-300 mb-6">Forever free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited photos
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  AI face detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Automatic blurring
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Small watermark
                </li>
              </ul>
              <Link
                href="/editor"
                className="block w-full bg-slate-700 text-white py-3 rounded-lg text-center font-semibold hover:bg-slate-600 transition-colors"
              >
                Start Free
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                COMING SOON
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-4">$19</div>
              <p className="text-purple-100 mb-6">per month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  Everything in Free
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  No watermark
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  Batch processing
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  API access
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <button
                disabled
                className="block w-full bg-white/20 text-white py-3 rounded-lg text-center font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Protecting Privacy Today
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Free forever. No credit card. No signup required.
          </p>
          <Link
            href="/editor"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            Try FacePrivacy Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">FacePrivacy</h3>
              <p className="text-sm">
                AI-powered face anonymization for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/editor">Editor</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/examples">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/gdpr">GDPR Guide</Link></li>
                <li><Link href="/api">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 FacePrivacy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
