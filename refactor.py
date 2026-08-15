import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add imports
code = code.replace("import React, { useState, useEffect } from 'react';", 
                    "import React, { useState, useEffect } from 'react';\nimport { Routes, Route, useNavigate, useLocation } from 'react-router-dom';")

# Replace setAppView('dashboard') etc.
# We need to inject `const navigate = useNavigate();` and `const location = useLocation();` inside App.

app_comp_start = code.find("export const App: React.FC = () => {")
injection = """export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
"""
code = code.replace("export const App: React.FC = () => {", injection)

# Replace urlParams.get('payment_status') routing in useEffect
code = re.sub(
    r"setAppView\('dashboard'\);",
    r"navigate('/dashboard');",
    code
)
code = re.sub(
    r"setDashboardView\('create'\);\s*setAppView\('dashboard'\);",
    r"navigate('/create');",
    code
)
code = re.sub(
    r"setDashboardView\('create'\);",
    r"navigate('/create');",
    code
)
code = re.sub(
    r"setAppView\('admin'\);",
    r"navigate('/admin');",
    code
)
code = re.sub(
    r"setAppView\('landing'\);",
    r"navigate('/');",
    code
)
code = re.sub(
    r"setAppView\(user\.role === 'admin' \? 'admin' : 'dashboard'\);",
    r"navigate(user.role === 'admin' ? '/admin' : '/dashboard');",
    code
)
code = re.sub(
    r"setAppView\(user\?\.role === 'admin' \? 'admin' : 'dashboard'\)",
    r"navigate(user?.role === 'admin' ? '/admin' : '/dashboard')",
    code
)
code = re.sub(
    r"setAppView\(loggedInUser\.role === 'admin' \? 'admin' : 'dashboard'\);",
    r"navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');",
    code
)

code = re.sub(r"setLandingView\('home'\);?", r"navigate('/');", code)
code = re.sub(r"setLandingView\('contact'\);?", r"navigate('/contact');", code)
code = re.sub(r"setLandingView\('terms'\);?", r"navigate('/terms');", code)
code = re.sub(r"setLandingView\('privacy'\);?", r"navigate('/privacy');", code)
code = re.sub(r"onNavigate=\{\(view\) => setLandingView\(view as LandingView\)\}", r"onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)}", code)

# Remove old state
code = re.sub(r"const \[landingView, setLandingView\] = useState<LandingView>\('home'\);\n", "", code)
code = re.sub(r"const \[dashboardView, setDashboardView\] = useState<string>\('home'\);\n", "", code)
code = re.sub(r"const \[appView, setAppView\] = useState<'landing' \| 'dashboard' \| 'admin'>\(\(\) => \{.*?\n  \}\);\n", "", code, flags=re.DOTALL)
code = re.sub(r"useEffect\(\(\) => \{\n    sessionStorage\.setItem\('sonorya_app_view', appView\);\n  \}, \[appView\]\);\n", "", code)

# Fix auto-redirect
code = re.sub(r"else if \(appView === 'landing' && sessionStorage", r"else if (location.pathname === '/' && sessionStorage", code)
code = re.sub(r"\}, \[user, appView\]\);", r"}, [user, location.pathname, navigate]);", code)


# Now refactor the rendering
render_search = """  if (appView === 'admin' && user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} onBackToLanding={() => setAppView('landing')} />;
  }"""

new_render = """
  // Render routing
  return (
    <div className="app-root">
      <AnimatedBackground />
      
      <Routes>
        <Route path="/admin" element={
          user?.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} onBackToLanding={() => navigate('/')} />
          ) : (
            <div style={{color:'white', padding:50}}>Accès refusé</div>
          )
        } />

        <Route path="/dashboard" element={
          user ? (
            <ClientDashboard
              user={user}
              orders={orders}
              onLogout={handleLogout}
              onOpenCreate={handleOpenWizard}
              onSongCreated={handleSongCreated}
              onToggleFavorite={handleToggleFavorite}
              isPlaying={isPlaying}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
              setIsPlaying={setIsPlaying}
              onPlaySong={handlePlaySong}
              onUpdateUser={(updated) => setUser({ ...user, ...updated })}
              initialView="home"
              onBackToLanding={() => navigate('/')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
              recoveredSongMetadata={recoveredSongMetadata}
              onClearRecoveredMetadata={() => setRecoveredSongMetadata(null)}
            />
          ) : (
            <div style={{color:'white', padding:50}}>Veuillez vous connecter.</div>
          )
        } />

        <Route path="/create" element={
          user ? (
            <ClientDashboard
              user={user}
              orders={orders}
              onLogout={handleLogout}
              onOpenCreate={handleOpenWizard}
              onSongCreated={handleSongCreated}
              onToggleFavorite={handleToggleFavorite}
              isPlaying={isPlaying}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
              setIsPlaying={setIsPlaying}
              onPlaySong={handlePlaySong}
              onUpdateUser={(updated) => setUser({ ...user, ...updated })}
              initialView="create"
              onBackToLanding={() => navigate('/')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
              recoveredSongMetadata={recoveredSongMetadata}
              onClearRecoveredMetadata={() => setRecoveredSongMetadata(null)}
            />
          ) : (
            <div style={{color:'white', padding:50}}>Veuillez vous connecter.</div>
          )
        } />

        <Route path="/*" element={
          <div className="landing-layout">
            <IzimeloHeader
              user={user}
              onOpenCreate={handleOpenWizard}
              onOpenLogin={() => {
                if (user) {
                  navigate(user.role === 'admin' ? '/admin' : '/dashboard');
                } else {
                  setAuthMode('login');
                  setIntent(null);
                  setShowAuthModal(true);
                }
              }}
              onGoToDashboard={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
              onOpenRechargeCredits={() => setShowCreditModal(true)}
            />

            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <IzimeloHero onOpenCreate={handleOpenWizard} />
                    <OccasionsTicker />
                    <IzimeloHowItWorks />
                    <IzimeloDemos />
                    <IzimeloCoverFlow />
                    <IzimeloTestimonials />
                    <IzimeloFAQ />
                    <IzimeloPricing
                      onOpenCreate={handleOpenWizard}
                      onSelectPlan={() => {
                        if (!user) {
                          setAuthMode('signup');
                          setShowAuthModal(true);
                        } else {
                          setShowCreditModal(true);
                        }
                      }}
                    />
                  </>
                } />
                <Route path="/contact" element={<ContactPage onBack={() => navigate('/')} />} />
                <Route path="/terms" element={<LegalPage type="terms" onBack={() => navigate('/')} />} />
                <Route path="/privacy" element={<LegalPage type="privacy" onBack={() => navigate('/')} />} />
              </Routes>
            </main>

            <LandingFooter onNavigate={(view) => navigate(view === 'home' ? '/' : `/${view}`)} onOpenCreate={handleOpenWizard} />
          </div>
        } />
      </Routes>

      {/* Modals... */}
      {showCreditModal && (
        <CreditPurchaseModal
          user={user}
          onClose={() => setShowCreditModal(false)}
          onSuccess={(updatedUser) => setUser(updatedUser)}
          onOpenLogin={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
        />
      )}

      {showPreviewModal && orderDraft && (
        <AudioPreviewModal
          orderDraft={orderDraft}
          onClose={() => setShowPreviewModal(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {showPaymentModal && orderDraft && (
        <PaymentModal
          orderDraft={orderDraft}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showHistoryModal && (
        <OrderHistoryModal
          orders={orders}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedInUser) => {
            setShowAuthModal(false);
            setUser(loggedInUser);
            navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
            setOrders(prev => {
              return prev.map(s => {
                if (!s.userId || s.userId === 'user-current') {
                  const claimed = { ...s, userId: loggedInUser.id };
                  d1Database.saveSong(claimed);
                  return claimed;
                }
                return s;
              });
            });
            if (loggedInUser.role === 'admin') {
              navigate('/admin');
            } else {
              navigate(intent === 'wizard' ? '/create' : '/dashboard');
              setIntent(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
"""

code = code[:code.find(render_search)] + new_render

# fix auth flow
code = re.sub(r"setDashboardView\(intent === 'wizard' \? 'create' : 'home'\);\s*setAppView\('dashboard'\);", r"navigate(intent === 'wizard' ? '/create' : '/dashboard');", code)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
