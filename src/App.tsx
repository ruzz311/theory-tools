import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Layout
import Layout from './components/Layout';
import { AuthProvider, RequireAuth } from './auth';
import { AudioProvider } from './util/AudioProvider';
import { getSystemUiMode } from './theme';
import { themeOptions } from './theme';

// Pages
import Login from './pages/Login';
import KeyFinder from './pages/KeyFinder';
import Tuner from './pages/Tuner';
import Metronome from './pages/Metronome';
import PublicPage from './pages/Public';
import ProtectedPage from './pages/Protected';

export default function App() {
  const [uiMode, setUIMode] = useState(getSystemUiMode());
  const t = useMemo(
    () => createTheme(deepmerge(themeOptions, { palette: { mode: uiMode } })),
    [themeOptions, uiMode]
  );
  const systemUIChangeHandle = () => setUIMode(getSystemUiMode());

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', systemUIChangeHandle);
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', systemUIChangeHandle);
    }
  }, [uiMode])

  return (
    <ThemeProvider theme={t}>
      <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<PublicPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/key-finder' element={<KeyFinder />} />
              <Route path='/metronome' element={<AudioProvider><Metronome /></AudioProvider>} />
              <Route path='/tuner' element={<AudioProvider><Tuner /></AudioProvider>} />
              <Route path='/protected' element={<RequireAuth><ProtectedPage /></RequireAuth>}
              />
            </Route>
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}