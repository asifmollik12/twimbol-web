import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyForCreator, getCreatorApplication } from "../api/creator";
import { useAuthStore } from "../store/authStore.js";

const CATEGORIES = [
  "Kids Education",
  "Kids Entertainment",
  "Storytelling",
  "Science & Nature",
  "Arts & Crafts",
  "Music & Dance",
  "Sports & Fitness",
  "Cooking & Nutrition",
  "Language Learning",
  "Other",
];

const inputCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-[#f8f7fc] px-4 py-3 text-sm text-[var(--color-txt)] placeholder-gray-400 outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all";

const labelCls = "block text-xs font-bold uppercase tracking-wider text-[var(--color-txt-secondary)] mb-1.5";

function Field({ label, required, children }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export const ApplyCreator = () => {
  const { user, fetchProfile, accessToken } = useAuthStore();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("info"); // info | form

  // Form fields
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [contentSamples, setContentSamples] = useState([{ title: "", url: "" }]);
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whyCreator, setWhyCreator] = useState("");

  const addSample = () => setContentSamples(s => [...s, { title: "", url: "" }]);
  const removeSample = (i) => setContentSamples(s => s.filter((_, idx) => idx !== i));
  const updateSample = (i, field, value) =>
    setContentSamples(s => s.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const userGroup = user?.user_group || user?.user?.user_group || [];
  const isCreator = userGroup.includes("creator");
  const isAdmin = userGroup.includes("admin");

  useEffect(() => {
    (async () => {
      try {
        const res = await getCreatorApplication(user.user.id);
        if (res.data?.length > 0) {
          setApplication(res.data[0]);
          fetchProfile(accessToken);
        }
      } catch {
        // no application yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!bio.trim()) return setError("Please tell us about yourself.");
    if (!category) return setError("Please select a content category.");
    if (!whyCreator.trim()) return setError("Please tell us why you want to be a creator.");

    const validSamples = contentSamples.filter(s => s.url.trim());
    if (validSamples.length === 0) return setError("Please add at least one content link.");

    setError("");
    setSubmitting(true);
    try {
      const res = await applyForCreator(user.user.id, {
        bio,
        content_category: category,
        demo_content_url: validSamples[0]?.url || undefined,
        social_facebook: facebook || undefined,
        social_youtube: youtube || undefined,
        social_instagram: instagram || undefined,
        why_creator: whyCreator,
        content_samples: JSON.stringify(validSamples),
      });
      setApplication(res.data?.data || { application_status: "0" });
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isCreator || isAdmin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Already applied ──
  if (application) {
    const status = application.application_status;
    const isPending = status === "0";
    const isApproved = status === "1";
    const isRejected = status === "2";

    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.07] overflow-hidden">
            <div className="h-1 bg-[var(--color-brand)]" />
            <div className="p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 ${
                isPending ? "bg-amber-50 border border-amber-200" :
                isApproved ? "bg-emerald-50 border border-emerald-200" :
                "bg-rose-50 border border-rose-200"
              }`}>
                {isPending ? "⏳" : isApproved ? "✅" : "❌"}
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-txt)] mb-2">
                {isPending ? "Application Under Review" : isApproved ? "Application Approved!" : "Application Rejected"}
              </h2>
              <p className="text-[var(--color-txt-secondary)] text-sm leading-relaxed max-w-xs mx-auto">
                {isPending
                  ? "Your application is being reviewed. We'll notify you once a decision is made — usually within 2–5 business days."
                  : isApproved
                  ? "Congratulations! You're now a creator. Head to your dashboard to start uploading."
                  : application.rejection_reason
                  ? `Your application was not approved: ${application.rejection_reason}`
                  : "Your application was not approved at this time. You may apply again later."}
              </p>
              {isPending && (
                <div className="inline-flex items-center gap-2 mt-5 bg-amber-50 text-amber-700 text-sm font-semibold px-5 py-2 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Pending Review
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Info page (step 1) ──
  if (step === "info") {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.07] overflow-hidden">
            <div className="h-1 bg-[var(--color-brand)]" />
            <div className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 bg-[var(--color-brand-light)] text-[var(--color-brand)] text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
                Creator Program
              </div>

              <h1 className="text-3xl font-bold text-[var(--color-txt)] leading-tight mb-2">
                Become a Creator
              </h1>
              <p className="text-[var(--color-txt-secondary)] text-sm leading-relaxed mb-8">
                Share educational and entertaining content with kids on Twimbol. Fill out a short application — we review every submission personally.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: "🎬", title: "Upload Videos & Reels", desc: "Share your content with thousands of kids" },
                  { icon: "📊", title: "Creator Analytics", desc: "Track views, likes and followers" },
                  { icon: "✅", title: "Verified Badge", desc: "Get recognized as a trusted creator" },
                  { icon: "🛡️", title: "Safe Platform", desc: "Content reviewed before going live" },
                ].map(b => (
                  <div key={b.title} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface)] border border-black/[0.06]">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-txt)]">{b.title}</p>
                      <p className="text-[11px] text-[var(--color-txt-secondary)] leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-black/[0.06] mb-6" />

              <p className="text-xs text-[var(--color-txt-secondary)] flex flex-wrap items-center gap-1 mb-6">
                By applying you agree to our{" "}
                <Link to="/terms" className="text-[var(--color-brand)] font-medium hover:underline">Terms & Conditions</Link>
                <span className="text-black/20">·</span>
                <Link to="/privacy" className="text-[var(--color-brand)] font-medium hover:underline">Privacy Policy</Link>
              </p>

              <button
                onClick={() => setStep("form")}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90 active:scale-[0.99] text-white font-bold text-sm rounded-xl py-4 transition-all"
              >
                Start Application →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Application Form (step 2) ──
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.07] overflow-hidden">
          <div className="h-1 bg-[var(--color-brand)]" />
          <div className="p-8 sm:p-10">

            {/* Header */}
            <button
              onClick={() => setStep("info")}
              className="flex items-center gap-1.5 text-xs text-[var(--color-txt-secondary)] hover:text-[var(--color-txt)] mb-5 transition-colors"
            >
              ← Back
            </button>

            <div className="inline-flex items-center gap-2 bg-[var(--color-brand-light)] text-[var(--color-brand)] text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
              Creator Application
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-txt)] mb-1">Tell us about yourself</h2>
            <p className="text-sm text-[var(--color-txt-secondary)] mb-7">
              This helps us understand your content style and audience fit.
            </p>

            <div className="space-y-5">

              {/* Bio */}
              <Field label="About You" required>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us who you are, your background, and what kind of content you create..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* Category */}
              <Field label="Content Category" required>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              {/* Demo/Sample Content */}
              <div>
                <label className={labelCls}>
                  Your Recent Content <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-[var(--color-txt-secondary)] mb-3">
                  Add links to your best or most recent content — YouTube, Facebook, TikTok, or any platform.
                </p>
                <div className="space-y-2.5">
                  {contentSamples.map((sample, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={sample.title}
                          onChange={e => updateSample(i, "title", e.target.value)}
                          placeholder={`Content title (e.g. "My Story for Kids")`}
                          className={`${inputCls} flex-1`}
                        />
                        <input
                          type="url"
                          value={sample.url}
                          onChange={e => updateSample(i, "url", e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`${inputCls} flex-1`}
                        />
                      </div>
                      {contentSamples.length > 1 && (
                        <button
                          onClick={() => removeSample(i)}
                          className="mt-3 text-rose-400 hover:text-rose-600 text-lg leading-none flex-shrink-0"
                          title="Remove"
                        >×</button>
                      )}
                    </div>
                  ))}
                </div>
                {contentSamples.length < 5 && (
                  <button
                    onClick={addSample}
                    className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:underline"
                  >
                    + Add another content link
                  </button>
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className={labelCls}>Social Media Links</label>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm flex-shrink-0">f</span>
                    <input
                      type="url"
                      value={facebook}
                      onChange={e => setFacebook(e.target.value)}
                      placeholder="Facebook page URL"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 text-sm flex-shrink-0">▶</span>
                    <input
                      type="url"
                      value={youtube}
                      onChange={e => setYoutube(e.target.value)}
                      placeholder="YouTube channel URL"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 text-sm flex-shrink-0">ig</span>
                    <input
                      type="url"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      placeholder="Instagram profile URL"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Why creator */}
              <Field label="Why do you want to be a Twimbol Creator?" required>
                <textarea
                  value={whyCreator}
                  onChange={e => setWhyCreator(e.target.value)}
                  placeholder="Tell us your motivation, what value you'll bring to kids on the platform..."
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </Field>

            </div>

            <div className="h-px bg-black/[0.06] my-6" />

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90 active:scale-[0.99] text-white font-bold text-sm rounded-xl py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application →"
              )}
            </button>

            <p className="text-center text-xs text-[var(--color-txt-secondary)] mt-4">
              We review applications within 2–5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyCreator;
