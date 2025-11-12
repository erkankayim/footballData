import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">ContractGuard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                Sign In
              </Link>
              <Link
                href="/analyze"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Never Sign a Bad Contract Again
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            AI-powered contract analysis that identifies risks, hidden clauses, and unfair terms
            before you sign. Built for freelancers, small businesses, and entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Analyze Your First Contract Free
            </Link>
            <Link
              href="#how-it-works"
              className="bg-white text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • Get results in 60 seconds
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Legal Review Shouldn't Cost Thousands
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Lawyers charge $300-500/hour to review contracts. Most freelancers and small
              businesses can't afford that for every agreement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <div className="text-red-600 text-3xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Hidden Risks</h3>
              <p className="text-slate-600">
                Unfair payment terms, unlimited liability, IP ownership traps
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <div className="text-orange-600 text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Expensive Mistakes</h3>
              <p className="text-slate-600">
                One bad contract can cost you thousands in lost revenue or legal fees
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
              <div className="text-yellow-600 text-3xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Time Pressure</h3>
              <p className="text-slate-600">
                Clients want quick turnarounds, you don't have time for legal review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What ContractGuard Analyzes
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive AI-powered analysis in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-blue-600 text-2xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Risk Assessment</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Liability clauses that expose you to unlimited risk</li>
                <li>• Payment terms that favor the other party</li>
                <li>• Termination clauses that trap you</li>
                <li>• Non-compete and exclusivity issues</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-green-600 text-2xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Missing Protections</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Intellectual property rights</li>
                <li>• Payment schedules and late fees</li>
                <li>• Scope of work boundaries</li>
                <li>• Dispute resolution clauses</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-purple-600 text-2xl mb-4">💡</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Negotiation Tips</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Specific language to request</li>
                <li>• Alternative clauses to propose</li>
                <li>• Industry-standard terms comparison</li>
                <li>• Red flags to push back on</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-orange-600 text-2xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Plain English Summary</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• What you're actually agreeing to</li>
                <li>• Financial implications breakdown</li>
                <li>• Timeline and obligations</li>
                <li>• Exit strategy options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get professional contract analysis in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Document</h3>
              <p className="text-slate-600">
                Drop your PDF contract or paste the text. We support all common contract types.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Analysis</h3>
              <p className="text-slate-600">
                Our AI reviews every clause, comparing against thousands of contracts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Get Report</h3>
              <p className="text-slate-600">
                Receive detailed analysis with risks, recommendations, and negotiation points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300">
              Pay per contract or subscribe for unlimited analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <p className="text-slate-300 mb-6">Try it risk-free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  1 contract analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Full risk report
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Basic recommendations
                </li>
              </ul>
              <Link
                href="/analyze"
                className="block w-full bg-slate-700 text-white py-3 rounded-lg text-center font-semibold hover:bg-slate-600 transition-colors"
              >
                Start Free
              </Link>
            </div>

            <div className="bg-blue-600 p-8 rounded-xl border-4 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pay Per Contract</h3>
              <div className="text-4xl font-bold mb-4">$29</div>
              <p className="text-blue-100 mb-6">per analysis</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-blue-200 mr-2">✓</span>
                  Comprehensive analysis
                </li>
                <li className="flex items-start">
                  <span className="text-blue-200 mr-2">✓</span>
                  Negotiation strategies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-200 mr-2">✓</span>
                  PDF export
                </li>
                <li className="flex items-start">
                  <span className="text-blue-200 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <Link
                href="/analyze"
                className="block w-full bg-white text-blue-600 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-2">Unlimited</h3>
              <div className="text-4xl font-bold mb-4">$99</div>
              <p className="text-slate-300 mb-6">per month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited contracts
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Priority analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Custom templates
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full bg-slate-700 text-white py-3 rounded-lg text-center font-semibold hover:bg-slate-600 transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stop Signing Blind. Start Protecting Yourself.
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of freelancers and small businesses who trust ContractGuard
          </p>
          <Link
            href="/analyze"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Analyze Your First Contract Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ContractGuard</h3>
              <p className="text-sm">
                AI-powered contract analysis for smart business decisions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/examples">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
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
            <p>&copy; 2024 ContractGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
