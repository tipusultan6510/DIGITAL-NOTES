import { useRef, useState } from 'react'
import { Download, Upload, Trash2, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import TopBar from '../components/TopBar'
import ConfirmDialog from '../components/ConfirmDialog'

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">{title}</h2>
      <div className="rounded-xl border border-line bg-white divide-y divide-line overflow-hidden">
        {children}
      </div>
    </div>
  )
}
function Row({ label, description, action }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default function Settings() {
  const { settings, updateSettings, exportData, importData, clearSampleData, deleteAllData, items } = useData()
  const [appName, setAppName] = useState(settings.appName)
  const [confirmAll, setConfirmAll] = useState(false)
  const [confirmSample, setConfirmSample] = useState(false)
  const fileRef = useRef(null)
  const hasSampleData = items.some((i) => i.isSample)

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agency-knowledge-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const doImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      await importData(text)
      window.alert('Import complete.')
    } catch {
      window.alert('That file could not be imported. Make sure it is a backup exported from this app.')
    }
    e.target.value = ''
  }

  return (
    <div>
      <TopBar title="Settings" />
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <Section title="Application">
          <Row
            label="Application name"
            action={
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                onBlur={() => appName.trim() && updateSettings({ appName: appName.trim() })}
                className="text-sm text-right border border-line rounded-lg px-2 py-1 w-40 outline-none focus:border-accent-400"
              />
            }
          />
          <Row label="Theme" description="Light — navy &amp; soft blue (this version)" action={null} />
        </Section>

        <Section title="Backup">
          <Row
            label="Export all data"
            description="Download everything as a JSON file"
            action={<button onClick={doExport} className="flex items-center gap-1.5 text-sm text-accent-600 font-medium"><Download size={15} /> Export</button>}
          />
          <Row
            label="Import data"
            description="Restore from a previously exported file"
            action={
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm text-accent-600 font-medium">
                <Upload size={15} /> Import
                <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
              </button>
            }
          />
        </Section>

        <Section title="Data">
          {hasSampleData && (
            <Row
              label="Clear sample data"
              description="Remove the example airlines/notes this app started with"
              action={<button onClick={() => setConfirmSample(true)} className="flex items-center gap-1.5 text-sm text-warning font-medium"><Sparkles size={15} /> Clear</button>}
            />
          )}
          <Row
            label="Delete all data"
            description="Permanently erase everything in this app"
            action={<button onClick={() => setConfirmAll(true)} className="flex items-center gap-1.5 text-sm text-danger font-medium"><Trash2 size={15} /> Delete all</button>}
          />
        </Section>

        <Section title="About">
          <Row label="My Agency Knowledge" description="A personal notebook for travel agency work — airlines, GDS/NDC, fares, and everything you learn on the job. Not a booking or ticketing system." />
        </Section>
      </div>

      <ConfirmDialog
        open={confirmSample}
        title="Clear all sample data?"
        description="This removes the example airlines, sections and notes only — your own notes are untouched."
        confirmLabel="Clear sample data"
        onCancel={() => setConfirmSample(false)}
        onConfirm={async () => { await clearSampleData(); setConfirmSample(false) }}
      />
      <ConfirmDialog
        open={confirmAll}
        title="Delete everything?"
        description="This permanently deletes every airline, section and note. This can't be undone."
        confirmLabel="Delete everything"
        onCancel={() => setConfirmAll(false)}
        onConfirm={async () => { await deleteAllData(); setConfirmAll(false) }}
      />
    </div>
  )
}
