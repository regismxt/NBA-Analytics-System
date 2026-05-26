import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ComparePage } from "./pages/ComparePage";
import { DashboardPage } from "./pages/DashboardPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { GamesPage } from "./pages/GamesPage";
import { PlayerDetailPage } from "./pages/PlayerDetailPage";
import { PlayersPage } from "./pages/PlayersPage";
import { TeamsPage } from "./pages/TeamsPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
