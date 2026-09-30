import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const SEED = [
  {
    groupType: 'airlines',
    item: 'Air Arabia',
    sections: [
      {
        name: 'General Information',
        notes: [
          {
            title: 'Air Arabia overview',
            content: '<p>Low-cost carrier based in Sharjah (SHJ). Operates mainly Airbus A320/A321 fleet across Middle East, North Africa, Asia and Europe.</p>',
            tags: ['airarabia', 'general'],
          },
        ],
      },
      {
        name: 'Baggage',
        notes: [
          {
            title: 'Baggage allowance — Value fare',
            content: '<p>Value fare: cabin bag 10kg only, no checked baggage included. Checked baggage must be purchased separately per sector.</p><p><em>Sample note — replace with your own confirmed rules.</em></p>',
            tags: ['baggage', 'airarabia'],
          },
        ],
      },
      {
        name: 'Reissue',
        notes: [
          {
            title: 'Reissue basics',
            content: '<p>Reissue allowed online or via agent depending on fare type. Fare difference + change fee usually applies.</p>',
            tags: ['reissue', 'airarabia'],
          },
        ],
      },
      { name: 'Cancellation', notes: [] },
      { name: 'Refund', notes: [] },
      { name: 'Important Contacts', notes: [] },
      { name: 'My Experience', notes: [] },
    ],
  },
  {
    groupType: 'airlines',
    item: 'Emirates',
    sections: [
      {
        name: 'General Information',
        notes: [
          {
            title: 'Emirates overview',
            content: '<p>Full-service carrier based in Dubai (DXB). Hub-and-spoke long-haul network on A380 and Boeing 777 fleet.</p>',
            tags: ['emirates', 'general'],
          },
        ],
      },
    ],
  },
  { groupType: 'airlines', item: 'flydubai', sections: [] },
  { groupType: 'airlines', item: 'Jazeera Airways', sections: [] },
  { groupType: 'airlines', item: 'Qatar Airways', sections: [] },
  { groupType: 'airlines', item: 'Etihad Airways', sections: [] },
  { groupType: 'airlines', item: 'Saudia', sections: [] },
  { groupType: 'airlines', item: 'US-Bangla Airlines', sections: [] },
  {
    groupType: 'gds_ndc',
    item: 'Sabre',
    sections: [
      {
        name: 'Commands',
        notes: [
          {
            title: 'Common PNR commands',
            content: '<p><strong>I</strong> — ignore transaction &nbsp; <strong>ER</strong> — end &amp; retrieve &nbsp; <strong>*R</strong> — redisplay PNR</p><p><em>Sample note — add your own command list here.</em></p>',
            tags: ['sabre', 'commands'],
          },
        ],
      },
      { name: 'Pricing', notes: [] },
      { name: 'Ticketing', notes: [] },
      { name: 'Reissue', notes: [] },
    ],
  },
  { groupType: 'gds_ndc', item: 'Amadeus', sections: [] },
  { groupType: 'gds_ndc', item: 'Galileo', sections: [] },
  { groupType: 'gds_ndc', item: 'NDC', sections: [] },
  {
    groupType: 'knowledge',
    item: 'Ticketing',
    sections: [{ name: 'General', notes: [{ title: 'What is a PNR vs a ticket', content: '<p>A PNR is the booking record; a ticket is issued against it once payment is confirmed. One PNR can hold multiple tickets for a group.</p>', tags: ['ticketing'] }] }],
  },
  { groupType: 'knowledge', item: 'Fare Rules', sections: [] },
  { groupType: 'knowledge', item: 'Reissue', sections: [] },
  { groupType: 'knowledge', item: 'Refund', sections: [] },
  { groupType: 'knowledge', item: 'Cancellation', sections: [] },
  { groupType: 'knowledge', item: 'Baggage', sections: [] },
  { groupType: 'knowledge', item: 'Visa', sections: [] },
  { groupType: 'knowledge', item: 'Airport Information', sections: [] },
]

const QUICK_NOTE_SEED = {
  title: '',
  content: '<p>Air Arabia DXB-DAC baggage rule updated.</p>',
  tags: ['baggage', 'airarabia'],
}

export async function seedSampleData(uid) {
  const batch = writeBatch(db)
  const base = collection(db, 'users', uid, 'items')
  let order = 0

  for (const group of SEED) {
    const itemRef = doc(collection(db, 'users', uid, 'items'))
    batch.set(itemRef, {
      groupType: group.groupType,
      name: group.item,
      order: order++,
      isSample: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    let sOrder = 0
    for (const section of group.sections) {
      const sectionRef = doc(collection(db, 'users', uid, 'sections'))
      batch.set(sectionRef, {
        itemId: itemRef.id,
        name: section.name,
        order: sOrder++,
        isSample: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      for (const note of section.notes) {
        const noteRef = doc(collection(db, 'users', uid, 'notes'))
        batch.set(noteRef, {
          sectionId: sectionRef.id,
          itemId: itemRef.id,
          groupType: group.groupType,
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          isFavorite: false,
          isPinned: false,
          isArchived: false,
          isSample: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    }
  }

  const quickRef = doc(collection(db, 'users', uid, 'notes'))
  batch.set(quickRef, {
    sectionId: null,
    itemId: null,
    groupType: null,
    title: QUICK_NOTE_SEED.title,
    content: QUICK_NOTE_SEED.content,
    tags: QUICK_NOTE_SEED.tags,
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isSample: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await batch.commit()
  void base
}
