/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ValuesGuideModal } from './components/ValuesGuideModal';
import { Coordinates } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>({
    lat: 21.1458,
    lon: 79.0882,
    displayName: 'Nagpur, Maharashtra (Cotton & Citrus / Black Soil Belt)',
  });

  const handleSelectLocation = (coords: Coordinates) => {
    setSelectedLocation(coords);
  };

  const handleNavigateToDashboard = () => {
    if (selectedLocation) {
      setCurrentPage('dashboard');
    }
  };

  const handleBackToMap = () => {
    setCurrentPage('landing');
  };

  return (
    <div id="bhumijal-app" className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        currentLocation={selectedLocation}
        onBackToMap={handleBackToMap}
        onNavigateToDashboard={handleNavigateToDashboard}
        onOpenGuide={() => setIsGuideOpen(true)}
        isDashboard={currentPage === 'dashboard'}
      />

      {currentPage === 'landing' ? (
        <LandingPage
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          onNavigateToDashboard={handleNavigateToDashboard}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      ) : (
        selectedLocation && (
          <DashboardPage
            location={selectedLocation}
            onBackToMap={handleBackToMap}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )
      )}

      {/* Values Guide Modal */}
      <ValuesGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Persistent Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

