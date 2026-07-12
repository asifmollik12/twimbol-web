import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CheckLogin from './components/auth/CheckLogin'
// import { SpeedInsights } from "@vercel/speed-insights/next"

// Public Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
// import ForgotPassword from './pages/ForgotPassword'
import Outgoing from './pages/Outgoing'
import ChildSafetyDeclaration from './pages/ChildSafetyDeclaration'
import PrivacyPolicy from './pages/PrivacyPolicy'

// // Protected Pages
import Home from './pages/Home'
import ReelWatch from './pages/ReelWatch'
import Posts from './pages/Posts'
import ReadPost from './pages/ReadPost'
// import UserProfile from './pages/UserProfile'
import Settings from './pages/Settings'
// import ApplyCreator from './pages/ApplyCreator'
import CreatorDashboard from './pages/CreatorDashboard'
import EditProfile from './pages/EditProfile'
import Events from './pages/Events'
import Learn from './pages/Learn'
import Game from './pages/Game'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<CheckLogin><Login /></CheckLogin>} />
        <Route path="/signup" element={<CheckLogin><Signup /></CheckLogin>} />
        {/* <Route path="/forgot-password" element={<CheckLogin><ForgotPassword /></CheckLogin>} /> */}
        <Route path="/outgoing/" element={<Outgoing />} />
        <Route path="/child-safety" element={<ChildSafetyDeclaration />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Protected */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/reel" element={<ProtectedRoute><ReelWatch /></ProtectedRoute>} />
        {/* <Route path="/reel/:id" element={<ReelWatch />} /> */}
        <Route path="/reel/:id" element={<ProtectedRoute><ReelWatch /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        {/* <Route path="/post/:id" element={<ProtectedRoute><Posts   /></ProtectedRoute>} /> */}
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/event" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><ReadPost /></ProtectedRoute>} />
        {/* <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/creator/apply" element={<ProtectedRoute><ApplyCreator /></ProtectedRoute>} />*/}
        <Route path="/creator/dashboard" element={<ProtectedRoute><CreatorDashboard /></ProtectedRoute>} /> 
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}