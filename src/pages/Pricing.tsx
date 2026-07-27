import React, { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Zap, Shield, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { user, setPaidStatus } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Your exact live Polar Checkout Link
  const polarCheckoutUrl = import.meta.env.VITE_POLAR_CHECKOUT_URL || 'https://buy.polar.sh/polar_cl_yxADj8SYBTpHgZG5alykS4BKirFg0UshmsC632g0zI5';

  // Check if returning from Polar checkout with success & checkout_id
  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id');
    const status = searchParams.get('status');

    if (checkoutId || status === 'success') {
      if (user) {
        setPaidStatus(true);
        alert('🎉 Polar Payment confirmed! Access unlocked for ' + user.email);
        navigate('/');
      }
    }
  }, [searchParams, user]);

  const handlePolarCheckout = () => {
    if (!user) {
      alert('Please sign in first so your payment links to your email account.');
      navigate('/login');
      return;
    }

    // Append customer email to checkout URL if supported
    const targetUrl = new URL(polarCheckoutUrl);
    targetUrl.searchParams.set('customer_email', user.email);

    // Open Polar checkout tab for real payment
    window.location.href = targetUrl.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Polar.sh
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Choose Your Diagnostic Plan
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Unlock AI-powered plant disease diagnostics, instant symptom analysis, and treatment recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Starter Plan */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-300">Starter Demo</h3>
              <p className="text-xs text-slate-400 mt-1">Preview features & dataset information</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Rs 0</span>
                <span className="text-slate-400 text-sm ml-1">/ forever</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> View Disease Database
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> Access Symptoms Guide
                </li>
                <li className="flex items-center gap-3 opacity-40">
                  <span className="line-through">AI Image Upload Scanner</span>
                </li>
                <li className="flex items-center gap-3 opacity-40">
                  <span className="line-through">Live Webcam Scan</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium text-sm cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Polar Pro Plan */}
          <div className="bg-gradient-to-b from-emerald-900/40 to-slate-900/80 border-2 border-emerald-500 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-md relative shadow-2xl shadow-emerald-950/50">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
              POPULAR
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-emerald-400">Pro Agriculture Scanner</h3>
              </div>
              <p className="text-xs text-emerald-200/70 mt-1">Full access to AI diagnosis engine</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Rs 200</span>
                <span className="text-slate-300 text-sm ml-1">/ lifetime access</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> Unlimited AI Image Predictions
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> Live Webcam Real-time Scan
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> Instant Treatment & Cure Guide
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400" /> Priority FastAPI Server Processing
                </li>
              </ul>
            </div>

            <button
              onClick={handlePolarCheckout}
              className="mt-8 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Pay Rs 200 with Polar.sh</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Payments securely processed by Polar.sh Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
