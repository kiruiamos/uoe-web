import React, { useState, useEffect } from 'react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  listSpreadsheets,
  getSpreadsheetDetails,
  getSheetValues,
  createSpreadsheet,
  appendSheetValues,
  DriveSpreadsheetFile,
  SpreadsheetDetails,
} from '../services/googleSheets';
import { StudentProfile, LectureItem, FeeItem, MenuItem } from '../types/campus';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  LogOut,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Send,
  Calendar,
  CreditCard,
  Utensils,
  Layers,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface Props {
  student: StudentProfile;
  lectures: LectureItem[];
  fees: FeeItem[];
  menuItems: MenuItem[];
  onNotify: (msg: string) => void;
}

export const GoogleSheetsModule: React.FC<Props> = ({
  student,
  lectures,
  fees,
  menuItems,
  onNotify,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Spreadsheets list state
  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheetFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active viewed sheet state
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedSheetDetails, setSelectedSheetDetails] = useState<SpreadsheetDetails | null>(null);
  const [activeTabName, setActiveTabName] = useState<string>('');
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [loadingSheetData, setLoadingSheetData] = useState(false);

  // New Sheet creation confirmation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState(
    `Highland_Campus_${student.name.replace(/\s+/g, '_')}_2026_Ledger`
  );
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [createdSheetResult, setCreatedSheetResult] = useState<{ id: string; url: string; title: string } | null>(null);

  // Append row confirmation state
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [appendRowData, setAppendRowData] = useState<string[]>(['', '', '', '']);
  const [isAppending, setIsAppending] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthChecked(true);
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthChecked(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch spreadsheets once logged in
  useEffect(() => {
    if (user && token) {
      loadSpreadsheetFiles();
    }
  }, [user, token]);

  const loadSpreadsheetFiles = async () => {
    setLoadingFiles(true);
    setErrorMsg(null);
    try {
      const files = await listSpreadsheets();
      setSpreadsheets(files);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to list spreadsheets from Google Drive');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        onNotify(`Signed in as ${res.user.email}. Google Sheets connected.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSpreadsheets([]);
    setSelectedSheetDetails(null);
    setSheetRows([]);
    onNotify('Disconnected Google account.');
  };

  // Inspect a specific spreadsheet
  const handleSelectSpreadsheet = async (fileId: string) => {
    setSelectedFileId(fileId);
    setLoadingSheetData(true);
    setErrorMsg(null);
    try {
      const details = await getSpreadsheetDetails(fileId);
      setSelectedSheetDetails(details);
      if (details.sheets.length > 0) {
        const firstTab = details.sheets[0].properties.title;
        setActiveTabName(firstTab);
        await loadTabValues(fileId, firstTab);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load spreadsheet details');
    } finally {
      setLoadingSheetData(false);
    }
  };

  const loadTabValues = async (fileId: string, tabName: string) => {
    setLoadingSheetData(true);
    try {
      const values = await getSheetValues(fileId, `${tabName}!A1:Z100`);
      setSheetRows(values);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || `Failed to read values from ${tabName}`);
    } finally {
      setLoadingSheetData(false);
    }
  };

  // Export full campus data into a new spreadsheet
  const handleConfirmCreateAndExport = async () => {
    setIsCreatingSheet(false);
    setShowCreateModal(false);
    setLoadingFiles(true);
    setErrorMsg(null);

    try {
      onNotify('Creating new Google Spreadsheet with campus records...');
      // 1. Create spreadsheet with multiple tabs
      const tabs = ['Academic_Timetable', 'Fee_Ledger', 'Cafeteria_Menu', 'Hostel_Residence'];
      const newSheet = await createSpreadsheet(newSheetTitle, tabs);

      const sheetId = newSheet.spreadsheetId;

      // 2. Populate Academic_Timetable
      const timetableHeaders = ['Course Code', 'Course Title', 'Lecturer', 'Day', 'Time', 'Room / Venue', 'Biometric Attendance'];
      const timetableData = lectures.map(l => [
        l.courseCode,
        l.courseTitle,
        l.lecturer,
        l.day,
        l.time,
        l.room,
        l.attendanceConfirmed ? 'Attended' : 'Scheduled',
      ]);
      await appendSheetValues(sheetId, 'Academic_Timetable!A1', [timetableHeaders, ...timetableData]);

      // 3. Populate Fee_Ledger
      const feeHeaders = ['Invoice Item', 'Reference Code', 'Amount (KES)', 'Status', 'Candidate Name', 'Reg No'];
      const feeData = fees.map(f => [
        f.title,
        `REF-${f.id.toUpperCase()}-2026`,
        f.amountKes,
        f.status,
        student.name,
        student.regNo,
      ]);
      await appendSheetValues(sheetId, 'Fee_Ledger!A1', [feeHeaders, ...feeData]);

      // 4. Populate Cafeteria_Menu
      const messHeaders = ['Category', 'Meal Item', 'Price (KES)', 'Calories', 'Availability', 'Campus Location'];
      const messData = menuItems.map(m => [
        m.category,
        m.name,
        m.priceKes,
        m.calories,
        m.isAvailable ? 'In Stock' : 'Sold Out',
        'Chepkoilel Central Mess',
      ]);
      await appendSheetValues(sheetId, 'Cafeteria_Menu!A1', [messHeaders, ...messData]);

      // 5. Populate Hostel_Residence
      const hostelHeaders = ['Hall Name', 'Assigned Room', 'Bed Number', 'Term Fee (KES)', 'Occupant Name', 'Status'];
      const hostelData = [
        ['Hall 1 (Kilimanjaro Hall)', 'K-204', 'Bed 2', 3500, student.name, 'Occupied & Confirmed'],
      ];
      await appendSheetValues(sheetId, 'Hostel_Residence!A1', [hostelHeaders, ...hostelData]);

      setCreatedSheetResult({
        id: sheetId,
        url: newSheet.spreadsheetUrl,
        title: newSheetTitle,
      });

      onNotify(`Spreadsheet "${newSheetTitle}" generated with 4 tabs and synced to Google Drive!`);
      await loadSpreadsheetFiles();
      await handleSelectSpreadsheet(sheetId);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to export data to Google Sheets');
    } finally {
      setLoadingFiles(false);
    }
  };

  // Append row to active sheet
  const handleConfirmAppendRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileId || !activeTabName) return;

    setIsAppending(true);
    try {
      const filteredRow = appendRowData.filter(c => c.trim() !== '');
      if (filteredRow.length === 0) return;

      await appendSheetValues(selectedFileId, `${activeTabName}!A1`, [filteredRow]);
      setShowAppendModal(false);
      setAppendRowData(['', '', '', '']);
      onNotify(`Added row to "${activeTabName}" successfully.`);
      await loadTabValues(selectedFileId, activeTabName);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to append row to spreadsheet');
    } finally {
      setIsAppending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111C2D]">Google Sheets Campus Integration</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E7E46]">
                OFFICIAL WORKSPACE API
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sync timetable, fee statements, cafeteria records, and browse Google Drive sheets
            </p>
          </div>
        </div>

        {/* User Account / Sign In State */}
        <div className="self-start sm:self-auto">
          {user ? (
            <div className="flex items-center gap-2 bg-[#F4F6F4] p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0B5345] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
                  {user.displayName || user.email}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                title="Disconnect Google Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Official Material Google Sign-In Button */
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-xl border border-slate-300 shadow-xs hover:shadow transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Unauthenticated View */}
      {!user ? (
        <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8F0] text-[#0B5345] mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-[#0F9D58]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Connect Google Sheets to Highland Campus</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sign in with your Google account with permission to automatically sync Amos Kemboi's academic timetable,
              fee statements, cafeteria transactions, and hostel bookings into real-time Google Spreadsheets in your Google Drive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <Calendar className="w-4 h-4 text-[#0B5345]" />
              <p className="font-bold text-slate-800">Timetable Sync</p>
              <p className="text-[11px] text-slate-500">Lectures, rooms, and attendance matrix in Google Sheets.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <CreditCard className="w-4 h-4 text-[#0B5345]" />
              <p className="font-bold text-slate-800">Fee Ledgers</p>
              <p className="text-[11px] text-slate-500">M-Pesa payment receipts & balance breakdown.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <FolderOpen className="w-4 h-4 text-[#0B5345]" />
              <p className="font-bold text-slate-800">Drive Explorer</p>
              <p className="text-[11px] text-slate-500">Live preview & row append directly from your portal.</p>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="px-6 py-2.5 rounded-xl bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-bold transition-transform active:scale-[0.98] inline-flex items-center gap-2 shadow-sm"
          >
            <span>{isLoggingIn ? 'Opening Google Authorization...' : 'Sign in to Connect Google Sheets'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Authenticated Workspace Hub */
        <div className="space-y-6">
          {/* Quick Actions Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8F9FA] p-3.5 rounded-xl border border-slate-200">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900">Synchronize Campus Records to Google Sheets</p>
              <p className="text-[11px] text-slate-500">
                Generate an organized 4-tab spreadsheet in your Google Drive with Amos Kemboi's records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="py-2 px-3.5 rounded-lg bg-[#0F9D58] hover:bg-[#0b8043] text-white text-xs font-bold transition-transform active:scale-[0.98] flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Export to Google Sheets</span>
              </button>

              <button
                onClick={loadSpreadsheetFiles}
                disabled={loadingFiles}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="Refresh Google Drive files"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Success Banner if newly created */}
          {createdSheetResult && (
            <div className="p-4 bg-[#E8F8F0] border border-[#27AE60]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#27AE60] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0B5345]">Google Spreadsheet Created Successfully!</p>
                  <p className="text-xs text-slate-700 font-mono mt-0.5">{createdSheetResult.title}</p>
                </div>
              </div>
              <a
                href={createdSheetResult.url}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <span>Open in Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Dual Panel: Spreadsheets in Drive & Live Sheet Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 4 Cols: Spreadsheets list in user's Drive */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
                <div className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-[#0F9D58]" />
                  <span>Your Google Drive Sheets ({spreadsheets.length})</span>
                </div>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {spreadsheets.map(file => {
                  const isSelected = selectedFileId === file.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleSelectSpreadsheet(file.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E8F8F0] border-[#0F9D58] shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-[#0F9D58] shrink-0" />
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[190px]">
                            {file.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                        <span>Modified: {new Date(file.modifiedTime).toLocaleDateString()}</span>
                        {isSelected && <span className="font-bold text-[#0F9D58]">ACTIVE</span>}
                      </div>
                    </button>
                  );
                })}

                {spreadsheets.length === 0 && !loadingFiles && (
                  <div className="text-center py-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    No spreadsheets found in your Drive yet. Tap "Export to Google Sheets" to generate one.
                  </div>
                )}
              </div>
            </div>

            {/* Right 8 Cols: Interactive Sheet Data Viewer */}
            <div className="lg:col-span-8 space-y-3">
              {selectedSheetDetails ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  {/* Sheet Header */}
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-5 h-5 text-[#0F9D58]" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {selectedSheetDetails.properties.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ID: {selectedSheetDetails.spreadsheetId.slice(0, 16)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAppendModal(true)}
                        className="py-1 px-2.5 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Row</span>
                      </button>

                      <a
                        href={selectedSheetDetails.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Open in Google Sheets"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Tabs Bar */}
                  <div className="flex items-center gap-1 px-3 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
                    {selectedSheetDetails.sheets.map(s => {
                      const title = s.properties.title;
                      const isActive = activeTabName === title;
                      return (
                        <button
                          key={s.properties.sheetId}
                          onClick={() => {
                            setActiveTabName(title);
                            if (selectedFileId) loadTabValues(selectedFileId, title);
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                            isActive
                              ? 'bg-white text-[#0B5345] shadow-2xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>

                  {/* Table Grid */}
                  <div className="max-h-[360px] overflow-auto">
                    {loadingSheetData ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0B5345]" />
                        <span>Loading cell data from Google Sheets...</span>
                      </div>
                    ) : sheetRows.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 sticky top-0">
                            <th className="p-2 border-r border-slate-200 w-10 text-center text-[10px] text-slate-400 font-mono">
                              #
                            </th>
                            {sheetRows[0].map((header, idx) => (
                              <th key={idx} className="p-2.5 font-bold border-r border-slate-200 whitespace-nowrap">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sheetRows.slice(1).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                                {rIdx + 2}
                              </td>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5 border-r border-slate-200 whitespace-nowrap tabular-nums text-slate-800">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No rows found in this sheet tab.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-500 bg-slate-50">
                  Select a spreadsheet from the left column to view its tabs and rows.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Export Full Campus Data to Google Sheets (Mandatory Confirmation) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Create & Sync Google Spreadsheet</h4>
                <p className="text-xs text-slate-500">Google Drive & Google Sheets API</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-slate-800">
                Are you sure you want to create the following spreadsheet in your Google Drive account ({user?.email})?
              </p>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">Spreadsheet Title:</label>
                <input
                  type="text"
                  value={newSheetTitle}
                  onChange={e => setNewSheetTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5345]"
                />
              </div>

              <div className="pt-2 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold">The spreadsheet will contain 4 organized tabs:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                  <li><span className="font-mono text-slate-700">Academic_Timetable</span> ({lectures.length} lecture entries)</li>
                  <li><span className="font-mono text-slate-700">Fee_Ledger</span> ({fees.length} line items for Amos Kemboi)</li>
                  <li><span className="font-mono text-slate-700">Cafeteria_Menu</span> ({menuItems.length} student meal items)</li>
                  <li><span className="font-mono text-slate-700">Hostel_Residence</span> (Hall 1 Kilimanjaro allocation)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isCreatingSheet}
                onClick={handleConfirmCreateAndExport}
                className="flex-1 py-2 rounded-xl bg-[#0F9D58] hover:bg-[#0b8043] text-white text-xs font-bold transition-all shadow-xs"
              >
                {isCreatingSheet ? 'Creating Spreadsheet...' : 'Confirm & Create in Drive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Append Row to Sheet (Mandatory Confirmation) */}
      {showAppendModal && selectedSheetDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAppendModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#93D3C1]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Append Row to Sheet</h4>
                <p className="text-xs text-slate-500">
                  Tab: <span className="font-mono font-bold text-[#0B5345]">{activeTabName}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmAppendRow} className="space-y-3">
              <p className="text-xs text-slate-600">
                Confirm row fields to append to <span className="font-semibold">{selectedSheetDetails.properties.title}</span>:
              </p>

              <div className="space-y-2">
                {appendRowData.map((val, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                      Column {String.fromCharCode(65 + idx)} {sheetRows[0]?.[idx] ? `(${sheetRows[0][idx]})` : ''}:
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => {
                        const newRow = [...appendRowData];
                        newRow[idx] = e.target.value;
                        setAppendRowData(newRow);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5345]"
                      placeholder={`Value for Column ${String.fromCharCode(65 + idx)}`}
                      required={idx === 0}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppendModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAppending}
                  className="flex-1 py-2 rounded-xl bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-bold transition-all"
                >
                  {isAppending ? 'Appending...' : 'Confirm Append Row'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
