// src/components/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import { useAuthStore } from "../store/authStore";

// ── Icon components (match Login's icon style) ──────────────
const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

// ── Labeled input field matching Login's styling ─────────────
const Field = ({ label, icon, error, ...props }) => (
    <div>
        <label className="block text-xs font-semibold text-[#2D1B69] mb-2 uppercase tracking-wider">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#f8f7fc] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#3B1F8E] focus:ring-2 focus:ring-[#3B1F8E]/10 transition-all"
                {...props}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
);

// ── Main Component ───────────────────────────────────────────
const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        username: "",
        birthday: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const { setAuth } = useAuthStore();


    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear field-level error on edit
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
        setError(null);
    };

    const validate = () => {
        const errs = {};
        if (!form.email) errs.email = "Email is required";
        if (!form.username) errs.username = "Username is required";
        if (!form.birthday) errs.birthday = "Date of birth is required";
        if (!form.password) errs.password = "Password is required";
        if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const errs = validate();
        if (Object.keys(errs).length) {
            setFieldErrors(errs);
            return;
        }

        setIsLoading(true);
        try {
            // POST /user/api/register/
            const {r_data} = await register({
                email: form.email,
                username: form.username,
                birthday: form.birthday,
                password: form.password,
            });


            try {
                console.log("Registration successful, logging in...", r_data, form.username, form.password);
                const { data } = await login(form.username, form.password);
                if (data.access) localStorage.setItem('access_token', data.access);
                if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

                await setAuth(data.access, data.refresh);

                navigate('/home');
            } catch (err) {
                setError(err.response?.data?.detail || 'Login failed');

            }


        } catch (err) {
            // Handle Django field-level validation errors
            const data = err.response?.data;
            if (data && typeof data === "object") {
                const mapped = {};
                if (data.username) mapped.username = data.username[0];
                if (data.email) mapped.email = data.email[0];
                if (data.password) mapped.password = data.password[0];
                if (Object.keys(mapped).length) {
                    setFieldErrors(mapped);
                } else {
                    setError(data.detail || "Registration failed. Please try again.");
                }
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding (matches Login) */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center"
                style={{
                    background: "linear-gradient(135deg, #1a0a3e 0%, #2D1B69 40%, #3B1F8E 100%)",
                }}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-[#4DD9E8]" />
                    <div className="absolute top-20 left-20 w-48 h-48 rounded-full border border-[#E91E8C]" />
                    <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full border-2 border-[#FFD700]" />
                    <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full border border-[#4DD9E8]" />
                    <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-[#E91E8C] opacity-20" />
                    <div className="absolute bottom-1/3 left-16 w-20 h-20 rounded-full bg-[#4DD9E8] opacity-15" />
                </div>

                {/* Platform image and tagline */}
                <div className="relative z-10 text-center px-8">
                    <img
                        src="/Twimbol Social platform.png"
                        alt="Twimbol Social Platform"
                        className="w-full max-w-lg mx-auto mb-6 drop-shadow-2xl rounded-xl"
                    />
                    <h2 className="text-white text-2xl font-light mb-3 tracking-wide">
                        Join the Safe Social Media for Kids
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                        Create an account to explore videos, reels, and stories curated for a safe, fun experience.
                    </p>
                </div>

                {/* Bottom decorative gradient line */}
                <div
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{
                        background: "linear-gradient(90deg, #E91E8C, #4DD9E8, #FFD700)",
                    }}
                />
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8f7fc] overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <img src="/logo.png" alt="Twimbol" className="w-40" />
                    </div>

                    {/* Logo */}
                    <div className="hidden lg:flex justify-center mb-6">
                        <img src="/timbol logo .png" alt="Twimbol" className="w-44" />
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-purple-100/50 p-8 border border-gray-100">
                        <h1 className="text-center text-2xl font-bold text-[#2D1B69] mb-6">
                            Create your account
                        </h1>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Field
                                label="Email"
                                icon={<MailIcon />}
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                error={fieldErrors.email}
                                required
                            />

                            <Field
                                label="Username"
                                icon={<UserIcon />}
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                error={fieldErrors.username}
                                required
                            />

                            <Field
                                label="Date of Birth"
                                icon={<CalendarIcon />}
                                type="date"
                                name="birthday"
                                value={form.birthday}
                                onChange={handleChange}
                                error={fieldErrors.birthday}
                                required
                            />

                            <Field
                                label="Password"
                                icon={<LockIcon />}
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                error={fieldErrors.password}
                                required
                            />

                            <Field
                                label="Confirm Password"
                                icon={<LockIcon />}
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={fieldErrors.confirmPassword}
                                required
                            />

                            {/* Terms */}
                            <p className="text-center text-xs text-gray-500 -mt-1">
                                By registering, you agree to our{" "}
                                <Link to="/terms" className="font-semibold text-[#3B1F8E] hover:text-[#2D1B69]">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="font-semibold text-[#3B1F8E] hover:text-[#2D1B69]">
                                    Privacy Policy
                                </Link>
                            </p>

                            {/* Global error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                    <p className="text-sm text-red-600 text-center">{error}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                                style={{
                                    background: "linear-gradient(135deg, #2D1B69 0%, #3B1F8E 50%, #5B2FC9 100%)",
                                }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="px-4 text-xs text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Login link */}
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#3B1F8E] hover:text-[#2D1B69] transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-6 text-xs text-gray-400">
                        Protected by Twimbol · Safe for Kids
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
