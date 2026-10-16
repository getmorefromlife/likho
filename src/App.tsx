import { useState, useRef } from 'react';
import { TopNavBar } from './components/navbar/TopNavBar';
import { QafiyaTray } from './components/qafiya/QafiyaTray';
import { PoetryCanvas } from './components/editor/PoetryCanvas';
import { LiteraryCompanion } from './components/companion/LiteraryCompanion';
import { ResizableDivider } from './components/common/ResizableDivider';
import { ExportModal } from './components/export/ExportModal';
import { CalligraphyCardModal } from './components/export/CalligraphyCardModal';
import { useWorkspacePrefs } from './hooks/useWorkspacePrefs';
import { usePoemEditor } from './hooks/usePoemEditor';
import { useQafiyaTracker } from './hooks/useQafiyaTracker';

export function App() {
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
    updateContent,
    insertErab,
    insertCoupletTemplate,
    handlePaste,
    handleSelect,
    startNewPoem,
    loadDraft,
  } = usePoemEditor();

  const {
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
  } = useQafiyaTracker(currentDraft.qafiyaList, currentDraft.content);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Main container ref for drag splitter calculations
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle loading rhymes from Treasury directly to Tray
  const handleLoadRhymesToTray = (words: string[]) => {
    loadWords(words, false);
  };

  // Determine column arrangement (Classic: 70% Right Canvas / 30% Left Companion; Swapped: 30% Right Companion / 70% Left Canvas)
  const isSwapped = prefs.activePreset === 'swapped';
  const showCompanion = prefs.companionOpen && !prefs.isZenMode;

  return (
    <div
      dir="rtl"
      lang="ur"
      className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] select-none font-nastaliq"
    >
      {/* 1. Minimalist Top Navigation Bar */}
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
      />

      {/* 2. Interactive Qafiya Tray (when docked to top) */}
      {prefs.qafiyaDockPosition === 'top' && !prefs.isZenMode && (
        <QafiyaTray
          chips={currentDraft.qafiyaList.map((w, i) => ({ id: `${i}`, word: w, isUsed: false }))}
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

      {/* 3. Main Workspace Area with Resizable Splitter */}
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
              <LiteraryCompanion
                currentDraft={currentDraft}
                selectedWord={selectedWord}
                onLoadRhymesToTray={handleLoadRhymesToTray}
                onSelectMeter={(name, rukn) => setMeter(name, rukn)}
                onSelectDraft={loadDraft}
                fontFamily={prefs.fontFamily}
                onClose={toggleCompanion}
              />
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
              <LiteraryCompanion
                currentDraft={currentDraft}
                selectedWord={selectedWord}
                onLoadRhymesToTray={handleLoadRhymesToTray}
                onSelectMeter={(name, rukn) => setMeter(name, rukn)}
                onSelectDraft={loadDraft}
                fontFamily={prefs.fontFamily}
                onClose={toggleCompanion}
              />
            </div>
          </>
        )}
      </div>

      {/* 4. Interactive Qafiya Tray (when docked to bottom) */}
      {prefs.qafiyaDockPosition === 'bottom' && !prefs.isZenMode && (
        <QafiyaTray
          chips={currentDraft.qafiyaList.map((w, i) => ({ id: `${i}`, word: w, isUsed: false }))}
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

      {/* 5. Multi-format Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={currentDraft.title}
        poet={currentDraft.poet}
        content={currentDraft.content}
        onOpenCardModal={() => setIsCardModalOpen(true)}
      />

      {/* 6. Calligraphy Social Card Modal */}
      <CalligraphyCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        title={currentDraft.title}
        poet={currentDraft.poet}
        content={currentDraft.content}
      />

      {/* 7. Dedicated Print Container for High-Resolution PDF Printing */}
      <div className="hidden print-poetry-container">
        <h1 className="print-poetry-title">{currentDraft.title || 'کلام'}</h1>
        <p className="print-poetry-poet">شاعر: {currentDraft.poet || 'نامعلوم'}</p>
        <div className="print-poetry-body">{currentDraft.content}</div>
      </div>
    </div>
  );
}

export default App;
