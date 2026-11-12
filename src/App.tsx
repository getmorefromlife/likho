import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { AlertTriangle, Download, Copy, X } from 'lucide-react';
import { TopNavBar } from './components/navbar/TopNavBar';
import { QafiyaTray } from './components/qafiya/QafiyaTray';
import { QuietWorkspace } from './components/editor/QuietWorkspace';
import { PoetryCanvas } from './components/editor/PoetryCanvas';
import { ResizableDivider } from './components/common/ResizableDivider';
import { CreatorCredit } from './components/common/CreatorCredit';
import { useWorkspacePrefs } from './hooks/useWorkspacePrefs';
import { usePoemEditor } from './hooks/usePoemEditor';
import { useQafiyaTracker } from './hooks/useQafiyaTracker';
import type { PoemDraft } from './types/editor';

const LazyLiteraryCompanion = lazy(() =>
  import('./components/companion/LiteraryCompanion').then((m) => ({
    default: m.LiteraryCompanion,
  }))
);
const LazyExportModal = lazy(() =>
  import('./components/export/ExportModal').then((m) => ({
    default: m.ExportModal,
  }))
);
const LazyCalligraphyCardModal = lazy(() =>
  import('./components/export/CalligraphyCardModal').then((m) => ({
    default: m.CalligraphyCardModal,
  }))
);
const LazyCustomStudioWorkspace = lazy(() =>
  import('./components/custom/CustomStudioWorkspace').then((m) => ({
    default: m.CustomStudioWorkspace,
  }))
);
const LazyClassicalDiwanReaderModal = lazy(() =>
  import('./components/diwan/ClassicalDiwanReaderModal').then((m) => ({
    default: m.ClassicalDiwanReaderModal,
  }))
);
const LazyProUpgradeModal = lazy(() =>
  import('./components/commercial/ProUpgradeModal').then((m) => ({
    default: m.ProUpgradeModal,
  }))
);
const LazyDiwanBookletExportModal = lazy(() =>
  import('./components/export/DiwanBookletExportModal').then((m) => ({
    default: m.DiwanBookletExportModal,
  }))
);
const LazyVoiceRecitationStudioModal = lazy(() =>
  import('./components/studio/VoiceRecitationStudioModal').then((m) => ({
    default: m.VoiceRecitationStudioModal,
  }))
);

export function App() {
  // Preload and cache offline Arooz Lexicon & Sovereign Lexicon asynchronously after initial shell mount
  useEffect(() => {
    void import('./services/aroozLexiconService').then(({ AroozLexiconService }) => {
      void AroozLexiconService.initialize();
    });
    void import('./services/sovereignLexiconService').then(({ loadSovereignLexicon }) => {
      void loadSovereignLexicon();
    });
  }, []);
  const {
    prefs,
    setTheme,
    setFontFamily,
    setFontSize,
    setLineHeight,
    toggleLock,
    setVerticalSplitPct,
    setQafiyaZoom,
    setQafiyaMarkerStyle,
    applyPreset,
    toggleZenMode,
    toggleCompanion,
    toggleQafiyaTray,
    toggleLiveScansion,
    updateCustomConfig,
  } = useWorkspacePrefs();

  const {
    currentDraft,
    textareaRef,
    stats,
    selectedWord,
    canUndo,
    canRedo,
    undo,
    redo,
    setTitle,
    setPoet,
    setForm,
    setMeter,
    setQafiyaList,
    setVoiceRecording,
    updateContent,
    insertErab,
    insertCoupletTemplate,
    handlePaste,
    handleSelect,
    startNewPoem,
    loadDraft,
    deleteDraft,
    reloadPortfolio,
    saveState,
    saveError,
    retrySave,
    storageIssue,
    dismissStorageIssue,
  } = usePoemEditor();

  const {
    chips,
    filteredChips,
    searchFilter,
    setSearchFilter,
    toggleChipStatus,
    addWord,
    removeWord,
    loadWords,
    resyncWithText,
    usedCount,
    totalCount,
  } = useQafiyaTracker(currentDraft.qafiyaList, currentDraft.content, setQafiyaList, currentDraft.id);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDiwanModalOpen, setIsDiwanModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isBookletModalOpen, setIsBookletModalOpen] = useState(false);
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState(false);

  // Main container ref for drag splitter calculations
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle loading rhymes from Treasury directly to Tray
  const handleLoadRhymesToTray = (words: string[]) => {
    loadWords(words, false);
  };

  const handlePortfolioRestored = (drafts: PoemDraft[]) => {
    reloadPortfolio(drafts);
  };

  const handleDownloadRecovery = () => {
    if (storageIssue?.raw == null) return;
    const blob = new Blob([storageIssue.raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `qalam_recovery_drafts_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleCopyRecovery = () => {
    if (storageIssue?.raw == null) return;
    void navigator.clipboard?.writeText(storageIssue.raw).catch(() => {
      console.error('Copy failed; use the download recovery action instead.');
    });
  };

  // Determine column arrangement (Classic: 70% Right Canvas / 30% Left Companion; Swapped: 30% Right Companion / 70% Left Canvas)
  const isSwapped = prefs.activePreset === 'swapped';
  const isCustomMode = prefs.activePreset === 'custom';
  const showCompanion = prefs.companionOpen && !prefs.isZenMode;
  const showTopNav = !isCustomMode || prefs.customConfig.showTopNavBar;
  const showQafiyaBar = !isCustomMode && !prefs.isZenMode;

  if (prefs.activePreset === 'quiet' || prefs.activePreset === 'quiet_rhymes') {
    return (
      <>
        <QuietWorkspace
          draft={currentDraft}
          prefs={prefs}
          textareaRef={textareaRef}
          onChange={updateContent}
          onRhymesChange={setQafiyaList}
          onExit={() => {
            if (document.fullscreenElement) void document.exitFullscreen().catch(() => { });
            applyPreset('classic');
          }}
          onToggleSplit={() => applyPreset(prefs.activePreset === 'quiet' ? 'quiet_rhymes' : 'quiet')}
          onOpenDiwan={() => setIsDiwanModalOpen(true)}
          saveState={saveState}
          onRetry={retrySave}
          storageDamaged={!!storageIssue}
        />
        {isDiwanModalOpen && (
          <Suspense fallback={null}>
            <LazyClassicalDiwanReaderModal
              isOpen={isDiwanModalOpen}
              onClose={() => setIsDiwanModalOpen(false)}
              fontFamily={prefs.fontFamily}
            />
          </Suspense>
        )}
      </>
    );
  }

  return (
    <div
      dir="rtl"
      lang="ur"
      className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] select-none font-nastaliq"
    >
      {/* 1. Minimalist Top Navigation Bar */}
      {showTopNav && (
        <TopNavBar
          prefs={prefs}
          onThemeChange={setTheme}
          onFontFamilyChange={setFontFamily}
          onFontSizeChange={setFontSize}
          onLineHeightChange={setLineHeight}
          onToggleLock={toggleLock}
          onApplyPreset={applyPreset}
          onToggleZen={toggleZenMode}
          onNewPoem={startNewPoem}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenVoiceStudio={() => setIsVoiceStudioOpen(true)}
          hasVoiceRecording={!!currentDraft.voiceRecording}
          onOpenDiwan={() => setIsDiwanModalOpen(true)}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          trialDaysRemaining={7}
          saveState={saveState}
          saveError={saveError}
          onRetrySave={retrySave}
        />
      )}

      {/* Corrupt/unavailable storage: keep the original bytes accessible. */}
      {storageIssue && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-nastaliq flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              {storageIssue.status === 'corrupt'
                ? 'خراب ذخیرۂ کلام ملا ہے۔ اصل ڈیٹا محفوظ رکھا گیا ہے؛ خودکار تبدیلی نہیں کی جائے گی۔'
                : 'ذخیرۂ کلام پڑھا نہیں جا سکا؛ موجودہ تبدیلیاں صرف اسی نشست میں رہیں گی۔'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {storageIssue.raw !== null && (
              <>
                <button
                  type="button"
                  onClick={handleDownloadRecovery}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                  title="اصل خراب ڈیٹا بغیر تبدیلی کے ڈاؤنلوڈ کریں"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>بازیابی ڈاؤنلوڈ کریں</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyRecovery}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                  title="اصل ڈیٹا نقل کریں"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نقل کریں</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={dismissStorageIssue}
              aria-label="اطلاع بند کریں"
              className="p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Qafiya Tray (when docked to top) */}
      {prefs.qafiyaDockPosition === 'top' && showQafiyaBar && (
        <QafiyaTray
          chips={chips}
          filteredChips={filteredChips}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          onToggleChip={toggleChipStatus}
          onAddWord={addWord}
          onRemoveWord={removeWord}
          onResync={resyncWithText}
          usedCount={usedCount}
          totalCount={totalCount}
          zoom={prefs.qafiyaZoom}
          onZoomChange={setQafiyaZoom}
          markerStyle={prefs.qafiyaMarkerStyle}
          onMarkerStyleChange={setQafiyaMarkerStyle}
          isOpen={prefs.qafiyaTrayOpen}
          onToggleOpen={toggleQafiyaTray}
          dockPosition="top"
          fontFamily={prefs.fontFamily}
        />
      )}

      {/* 3. Main Workspace Area with Resizable Splitter or Custom Studio */}
      {isCustomMode ? (
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center bg-[var(--bg-canvas)] text-sm font-nastaliq text-[var(--text-muted)]">
              من پسند اسٹوڈیو لوڈ ہو رہا ہے...
            </div>
          }
        >
          <LazyCustomStudioWorkspace
            currentDraft={currentDraft}
            textareaRef={textareaRef}
            prefs={prefs}
            stats={stats}
            selectedWord={selectedWord}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onTitleChange={setTitle}
            onPoetChange={setPoet}
            onFormChange={setForm}
            onMeterChange={(name, rukn) => setMeter(name, rukn)}
            onContentChange={updateContent}
            onQafiyaListChange={setQafiyaList}
            onLoadRhymesToTray={handleLoadRhymesToTray}
            onInsertErab={insertErab}
            onInsertCoupletTemplate={insertCoupletTemplate}
            onPaste={handlePaste}
            onSelect={handleSelect}
            onToggleLiveScansion={toggleLiveScansion}
            onSelectDraft={loadDraft}
            onDeleteDraft={deleteDraft}
            onPortfolioRestored={handlePortfolioRestored}
            onUpdateCustomConfig={updateCustomConfig}
            onExitCustom={() => applyPreset('classic')}
          />
        </Suspense>
      ) : (
        <div
          ref={workspaceContainerRef}
          className="flex-1 flex overflow-hidden relative"
        >
          {/* Swapped layout puts Literary Companion on the Right */}
          {isSwapped && showCompanion && (
            <>
              <div
                style={{ width: `${100 - prefs.verticalSplitPct}%` }}
                className="h-full overflow-hidden flex-shrink-0"
              >
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center bg-[var(--bg-card)] border-l border-[var(--border-subtle)] text-xs font-nastaliq text-[var(--text-muted)]">
                      ادبی معاون لوڈ ہو رہا ہے...
                    </div>
                  }
                >
                  <LazyLiteraryCompanion
                    currentDraft={currentDraft}
                    selectedWord={selectedWord}
                    onLoadRhymesToTray={handleLoadRhymesToTray}
                    onSelectMeter={(name, rukn) => setMeter(name, rukn)}
                    onSelectDraft={loadDraft}
                    onDeleteDraft={deleteDraft}
                    onPortfolioRestored={handlePortfolioRestored}
                    onOpenBookletModal={() => setIsBookletModalOpen(true)}
                    fontFamily={prefs.fontFamily}
                    onClose={toggleCompanion}
                  />
                </Suspense>
              </div>

              <ResizableDivider
                orientation="vertical"
                isLocked={prefs.isLocked}
                onResize={(pct) => setVerticalSplitPct(100 - pct)}
                containerRef={workspaceContainerRef}
              />
            </>
          )}

          {/* The Urdu Poetry Canvas (مسودۂ کلام) */}
          <div
            style={{
              width: showCompanion
                ? isSwapped
                  ? `${prefs.verticalSplitPct}%`
                  : `${prefs.verticalSplitPct}%`
                : '100%',
            }}
            className="h-full overflow-hidden flex-1"
          >
            <PoetryCanvas
              currentDraft={currentDraft}
              textareaRef={textareaRef}
              prefs={prefs}
              stats={stats}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onTitleChange={setTitle}
              onPoetChange={setPoet}
              onFormChange={setForm}
              onContentChange={updateContent}
              onInsertErab={insertErab}
              onInsertCoupletTemplate={insertCoupletTemplate}
              onPaste={handlePaste}
              onSelect={handleSelect}
              onToggleLiveScansion={toggleLiveScansion}
              onSelectMeter={setMeter}
              onOpenVoiceStudio={() => setIsVoiceStudioOpen(true)}
            />
          </div>

          {/* Classic layout puts Literary Companion on the Left */}
          {!isSwapped && showCompanion && (
            <>
              <ResizableDivider
                orientation="vertical"
                isLocked={prefs.isLocked}
                onResize={setVerticalSplitPct}
                containerRef={workspaceContainerRef}
              />

              <div
                style={{ width: `${100 - prefs.verticalSplitPct}%` }}
                className="h-full overflow-hidden flex-shrink-0"
              >
                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center bg-[var(--bg-card)] border-l border-[var(--border-subtle)] text-xs font-nastaliq text-[var(--text-muted)]">
                      ادبی معاون لوڈ ہو رہا ہے...
                    </div>
                  }
                >
                  <LazyLiteraryCompanion
                    currentDraft={currentDraft}
                    selectedWord={selectedWord}
                    onLoadRhymesToTray={handleLoadRhymesToTray}
                    onSelectMeter={(name, rukn) => setMeter(name, rukn)}
                    onSelectDraft={loadDraft}
                    onDeleteDraft={deleteDraft}
                    onPortfolioRestored={handlePortfolioRestored}
                    onOpenBookletModal={() => setIsBookletModalOpen(true)}
                    fontFamily={prefs.fontFamily}
                    onClose={toggleCompanion}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. Interactive Qafiya Tray (when docked to bottom) */}
      {prefs.qafiyaDockPosition === 'bottom' && showQafiyaBar && (
        <QafiyaTray
          chips={chips}
          filteredChips={filteredChips}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          onToggleChip={toggleChipStatus}
          onAddWord={addWord}
          onRemoveWord={removeWord}
          onResync={resyncWithText}
          usedCount={usedCount}
          totalCount={totalCount}
          zoom={prefs.qafiyaZoom}
          onZoomChange={setQafiyaZoom}
          markerStyle={prefs.qafiyaMarkerStyle}
          onMarkerStyleChange={setQafiyaMarkerStyle}
          isOpen={prefs.qafiyaTrayOpen}
          onToggleOpen={toggleQafiyaTray}
          dockPosition="bottom"
          fontFamily={prefs.fontFamily}
        />
      )}

      <CreatorCredit />

      {/* 5. Multi-format Export Modal */}
      {isExportModalOpen && (
        <Suspense fallback={null}>
          <LazyExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            title={currentDraft.title}
            poet={currentDraft.poet}
            content={currentDraft.content}
            onOpenCardModal={() => setIsCardModalOpen(true)}
            onOpenBookletModal={() => setIsBookletModalOpen(true)}
          />
        </Suspense>
      )}

      {/* 5b. Diwan Booklet Multi-Poem Book Exporter */}
      {isBookletModalOpen && (
        <Suspense fallback={null}>
          <LazyDiwanBookletExportModal
            isOpen={isBookletModalOpen}
            onClose={() => setIsBookletModalOpen(false)}
            initialTitle={currentDraft.title ? `دیوانِ ${currentDraft.poet || 'قلم و قافیہ'}` : 'دیوانِ قلم و قافیہ'}
            initialPoetName={currentDraft.poet || ''}
          />
        </Suspense>
      )}

      {/* 5c. Voice Recitation & Tarannum Studio (صوتی ترنم و مشاعرہ اسٹوڈیو) */}
      {isVoiceStudioOpen && (
        <Suspense fallback={null}>
          <LazyVoiceRecitationStudioModal
            isOpen={isVoiceStudioOpen}
            onClose={() => setIsVoiceStudioOpen(false)}
            draft={currentDraft}
            fontFamily={prefs.fontFamily}
            onSaveVoiceRecording={setVoiceRecording}
          />
        </Suspense>
      )}

      {/* 6. Calligraphy Social Card Modal */}
      {isCardModalOpen && (
        <Suspense fallback={null}>
          <LazyCalligraphyCardModal
            isOpen={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            title={currentDraft.title}
            poet={currentDraft.poet}
            content={currentDraft.content}
          />
        </Suspense>
      )}

      {/* 7. Public-Domain Classical Poetry Reading Modal (دیوانِ اساتذہ) */}
      {isDiwanModalOpen && (
        <Suspense fallback={null}>
          <LazyClassicalDiwanReaderModal
            isOpen={isDiwanModalOpen}
            onClose={() => setIsDiwanModalOpen(false)}
            fontFamily={prefs.fontFamily}
          />
        </Suspense>
      )}

      {/* 8. Commercial Pro Upgrade Modal */}
      {isUpgradeModalOpen && (
        <Suspense fallback={null}>
          <LazyProUpgradeModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
            fontFamily={prefs.fontFamily}
            trialDaysRemaining={7}
          />
        </Suspense>
      )}

      {/* 9. Dedicated Print Container for High-Resolution PDF Printing */}
      <div className="hidden print-poetry-container">
        <h1 className="print-poetry-title">{currentDraft.title || 'کلام'}</h1>
        <p className="print-poetry-poet">شاعر: {currentDraft.poet || 'نامعلوم'}</p>
        <div className="print-poetry-body">{currentDraft.content}</div>
      </div>
    </div>
  );
}

export default App;
