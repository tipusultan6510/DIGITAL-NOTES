function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ')
}

const GROUP_LABEL = { airlines: 'Airlines', gds_ndc: 'GDS / NDC', knowledge: 'Knowledge' }

export function searchNotes({ notes, items, sections, query }) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const itemById = Object.fromEntries(items.map((i) => [i.id, i]))
  const sectionById = Object.fromEntries(sections.map((s) => [s.id, s]))

  return notes
    .filter((n) => !n.isArchived)
    .map((n) => {
      const item = n.itemId ? itemById[n.itemId] : null
      const section = n.sectionId ? sectionById[n.sectionId] : null
      const haystack = [
        n.title,
        stripHtml(n.content),
        ...(n.tags || []),
        item?.name,
        section?.name,
        n.groupType ? GROUP_LABEL[n.groupType] : '',
      ].join(' ').toLowerCase()
      return { note: n, item, section, match: haystack.includes(q) }
    })
    .filter((r) => r.match)
    .slice(0, 50)
}

export { GROUP_LABEL }
