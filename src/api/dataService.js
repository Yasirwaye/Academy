import { supabase } from './supabaseClient';

// ─── Logging helper ───────────────────────────────────────────────────────────
const logError = (context, error) => {
  console.error(`[DataService:${context}]`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    timestamp: new Date().toISOString(),
  });
};

// ─── Sanitize: strip keys with undefined/null values before DB writes ─────────
const sanitize = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

// ─── Generic helpers ──────────────────────────────────────────────────────────

const fetchAll = async (table, order = 'created_at', ascending = false) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(order, { ascending });
  if (error) throw error;
  return data;
};

const fetchFiltered = async (table, filters = {}, order = 'created_at', ascending = false) => {
  let query = supabase.from(table).select('*');
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }
  const { data, error } = await query.order(order, { ascending });
  if (error) throw error;
  return data;
};

const insertOne = async (table, record) => {
  const { data, error } = await supabase.from(table).insert([record]).select().single();
  if (error) throw error;
  return data;
};

const updateOne = async (table, id, updates) => {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

const deleteOne = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};

// ─── File Upload ──────────────────────────────────────────────────────────────

/**
 * TODO: Create a storage bucket named "media" in your Supabase project (set to Public)
 */
export const uploadFile = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
  return { file_url: publicUrl };
};

// ─── Squads ───────────────────────────────────────────────────────────────────
export const db = {
  Squad: {
    list: (order) => fetchAll('squads', order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    filter: (filters, order) => fetchFiltered('squads', filters, order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    create: (data) => insertOne('squads', data),
    update: (id, data) => updateOne('squads', id, data),
    delete: (id) => deleteOne('squads', id),
  },

  // ─── Players ────────────────────────────────────────────────────────────────
  Player: {
    list: (order) => fetchAll('players', order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    filter: (filters, order) => fetchFiltered('players', filters, order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    create: (data) => insertOne('players', data),
    update: (id, data) => updateOne('players', id, data),
    delete: (id) => deleteOne('players', id),
  },

  // ─── Spotlights ─────────────────────────────────────────────────────────────
  Spotlight: {
    list: (order) => fetchAll('spotlights', order?.replace('-', '') || 'order', !order?.startsWith('-')),
    create: (data) => insertOne('spotlights', data),
    delete: (id) => deleteOne('spotlights', id),
  },

  // ─── Highlights ─────────────────────────────────────────────────────────────
  Highlight: {
    list: (order) => fetchAll('highlights', order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    create: (data) => insertOne('highlights', data),
    update: (id, data) => updateOne('highlights', id, data),
    delete: (id) => deleteOne('highlights', id),
  },

  // ─── Applications ────────────────────────────────────────────────────────────
  Application: {
    list: (order) => fetchAll('applications', order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    create: (data) => insertOne('applications', data),
    update: (id, data) => updateOne('applications', id, data),
    delete: (id) => deleteOne('applications', id),
  },

  // ─── Announcements ───────────────────────────────────────────────────────────
  Announcement: {
    list: (order) => fetchAll('announcements', order?.replace('-', '') || 'created_at', !order?.startsWith('-')),
    create: (data) => insertOne('announcements', data),
    update: (id, data) => updateOne('announcements', id, data),
    delete: (id) => deleteOne('announcements', id),
  },
};