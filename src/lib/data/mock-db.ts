// ==============================================================================
// MOCK DATABASE & DATA STORE — PLATAFORMA ANAMNESIS
// ==============================================================================

export interface AuthorProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: 'reader' | 'author' | 'editor';
  timezone: string;
  bio: string;
  specialty?: string;
  location?: string;
  joinedDate?: string;
  circleSlugs: string[];
}

export interface CircleDetail {
  id: string;
  name: string;
  slug: string;
  coverUrl: string;
  editorId: string;
  editorName: string;
  editorAvatar: string;
  editorRole?: string;
  editorBio?: string;
  description: string;
  manifesto: string;
  longDescription?: string;
  memberCount: number;
  membersCount?: number;
  articleCount: number;
  tags?: string[];
}

export interface CircleArticleItem {
  id: string;
  title: string;
  slug: string;
  circleId: string;
  circleSlug: string;
  circleName: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  excerpt: string;
  readingTimeMin: number;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: string;
  coverUrl?: string;
}

export interface CircleMemberItem {
  id: string;
  circleId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'reader' | 'author' | 'editor';
  circleRole: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface CircleInvitationItem {
  id: string;
  circleId: string;
  email: string;
  role: 'admin' | 'moderator' | 'member';
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  expiresAt: string;
}

export interface AvailabilitySlotItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTimezone: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC (exactamente +30 minutos)
  isBooked: boolean;
  createdAt: string;
}

export interface BookingSessionItem {
  id: string;
  slotId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorEmail: string;
  authorTimezone: string;
  readerId: string;
  readerName: string;
  readerEmail: string;
  readerAvatar: string;
  articleId?: string;
  articleTitle?: string;
  articleSlug?: string;
  circleSlug?: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  status: 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  articleSlug: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'reader' | 'author' | 'editor';
  parentId: string | null;
  content: string;
  isHidden: boolean;
  createdAt: string;
  replies?: CommentItem[];
}

export const INITIAL_AUTHORS: Record<string, AuthorProfile> = {
  'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb': {
    id: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    fullName: 'Dr. Julián Sotomayor',
    email: 'autor@anamnesis.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'author',
    timezone: 'America/Bogota',
    specialty: 'Médico Internista & Ensayista',
    bio: 'Especialista en medicina interna hospitalaria con maestría en Bioética por la Universidad de Barcelona. Investiga las narrativas del dolor, el impacto del silencio clínico en el diagnóstico y la fenomenología del cuidado en las unidades de cuidados intensivos.',
    circleSlugs: ['ensayo-medico', 'cronica'],
  },
  'cccccccc-3333-4333-c333-cccccccccccc': {
    id: 'cccccccc-3333-4333-c333-cccccccccccc',
    fullName: 'Elena Rocafuerte',
    email: 'editor@anamnesis.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'editor',
    timezone: 'America/Buenos_Aires',
    specialty: 'Crítica Literaria & Editora General',
    bio: 'Licenciada en Letras Hispánicas y docente universitaria. Fundadora de la mesa editorial de Crónica y Reseña en Anamnesis. Estudia la literatura confesional, los archivos orales y la memoria sensorial en el siglo XX.',
    circleSlugs: ['cronica', 'resena-literaria', 'ensayo-medico'],
  },
  'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa': {
    id: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    fullName: 'Sofía Valenzuela',
    email: 'lector@anamnesis.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'reader',
    timezone: 'America/Mexico_City',
    specialty: 'Investigadora en Humanidades Médicas',
    bio: 'Lectora asidua de medicina narrativa y cronista independiente. Participa activamente en los círculos de discusión y tutorías de Anamnesis.',
    circleSlugs: ['ensayo-medico', 'cronica'],
  },
};

export const INITIAL_CIRCLES: Record<string, CircleDetail> = {
  'cronica': {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Crónica',
    slug: 'cronica',
    coverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    description: 'Relatos de inmersión, archivo oral y no-ficción sobre la memoria urbana y corporal.',
    manifesto: 'La crónica no es un adorno de los hechos; es el testimonio obstinado de quienes habitan el margen de los registros oficiales. Buscamos textos que conjuguen el rigor etnográfico con una prosa poética y despiadada.',
    memberCount: 28,
    articleCount: 14,
  },
  'ensayo-medico': {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Ensayo Médico',
    slug: 'ensayo-medico',
    coverUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    description: 'Humanidades médicas, bioética y reflexiones sobre la práctica clínica y hospitalaria.',
    manifesto: 'Entre el síntoma biológico y el sufrimiento existencial media la palabra. Este círculo reúne indagaciones sobre el acto de curar, el límite terapéutico y la escucha como herramienta diagnóstica fundamental.',
    memberCount: 42,
    articleCount: 19,
  },
  'resena-literaria': {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Reseña Literaria',
    slug: 'resena-literaria',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    description: 'Lecturas críticas, ensayos bibliográficos y diálogos con clásicos y contemporáneos.',
    manifesto: 'Leer es reescribir con la memoria propia. Defendemos la reseña como un género ensayístico mayor, capaz de interrogar las formas y tensiones del presente a través de la literatura.',
    memberCount: 35,
    articleCount: 22,
  },
};

export const INITIAL_ARTICLES: CircleArticleItem[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    title: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
    slug: 'el-peso-de-la-palabra-no-dicha',
    circleId: '33333333-3333-3333-3333-333333333333',
    circleSlug: 'ensayo-medico',
    circleName: 'Ensayo Médico',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    excerpt: 'En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La medicina moderna nos ha adiestrado para confiar ciegamente en el biomarcador...',
    readingTimeMin: 7,
    status: 'published',
    tags: ['Medicina Narrativa', 'Bioética', 'Guardias Clínicas', 'Humanismo'],
    createdAt: '1 de Septiembre, 2026',
    coverUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    title: 'Madrugadas en el tranvía fantasma: Los últimos maquinistas de la estación sur',
    slug: 'madrugadas-en-el-tranvia-fantasma',
    circleId: '22222222-2222-2222-2222-222222222222',
    circleSlug: 'cronica',
    circleName: 'Crónica',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    excerpt: 'Durante cuarenta años, don Amador condujo la línea 4 en el turno de las 3:30 AM. Entre el chirrido de los rieles congelados y el vapor del termo, vio nacer y desaparecer una ciudad subterránea.',
    readingTimeMin: 9,
    status: 'published',
    tags: ['Crónica Urbana', 'Oficios Perdidos', 'Ciudad', 'Memoria'],
    createdAt: '28 de Agosto, 2026',
    coverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800',
  },
  {
    id: '44444444-4444-4444-4444-444444444443',
    title: 'La sintaxis del duelo en la narrativa de María Luisa Bombal',
    slug: 'la-sintaxis-del-duelo-maria-luisa-bombal',
    circleId: '11111111-1111-1111-1111-111111111111',
    circleSlug: 'resena-literaria',
    circleName: 'Reseña Literaria',
    authorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    authorName: 'Elena Rocafuerte',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    excerpt: 'En La amortajada (1938), María Luisa Bombal instaura una fenomenología sensorial de la muerte donde la difunta observa, escucha y juzga con una lucidez vedada a los vivos.',
    readingTimeMin: 6,
    status: 'published',
    tags: ['Crítica Literaria', 'Narrativa', 'Siglo XX', 'Estética'],
    createdAt: '24 de Agosto, 2026',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Borrador: La anatomía del error médico y el tabú hospitalario',
    slug: 'anatomia-del-error-medico',
    circleId: '33333333-3333-3333-3333-333333333333',
    circleSlug: 'ensayo-medico',
    circleName: 'Ensayo Médico',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    excerpt: 'Todo cirujano lleva dentro de sí un pequeño cementerio al que acude a orar en momentos de duda. Un análisis de la fatiga cognitiva y el silencio clínico.',
    readingTimeMin: 5,
    status: 'draft',
    tags: ['Borrador', 'Bioética', 'Clínica'],
    createdAt: '31 de Agosto, 2026',
  },
];

export const INITIAL_MEMBERS: Record<string, CircleMemberItem[]> = {
  'cronica': [
    {
      id: 'cm-1',
      circleId: '22222222-2222-2222-2222-222222222222',
      userId: 'cccccccc-3333-4333-c333-cccccccccccc',
      userName: 'Elena Rocafuerte',
      userEmail: 'editor@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      userRole: 'editor',
      circleRole: 'admin',
      joinedAt: '15 de Enero, 2024',
    },
    {
      id: 'cm-2',
      circleId: '22222222-2222-2222-2222-222222222222',
      userId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
      userName: 'Dr. Julián Sotomayor',
      userEmail: 'autor@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      userRole: 'author',
      circleRole: 'moderator',
      joinedAt: '2 de Febrero, 2024',
    },
    {
      id: 'cm-3',
      circleId: '22222222-2222-2222-2222-222222222222',
      userId: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
      userName: 'Sofía Valenzuela',
      userEmail: 'lector@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      userRole: 'reader',
      circleRole: 'member',
      joinedAt: '10 de Marzo, 2024',
    },
  ],
  'ensayo-medico': [
    {
      id: 'cm-4',
      circleId: '33333333-3333-3333-3333-333333333333',
      userId: 'cccccccc-3333-4333-c333-cccccccccccc',
      userName: 'Elena Rocafuerte',
      userEmail: 'editor@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      userRole: 'editor',
      circleRole: 'admin',
      joinedAt: '10 de Enero, 2024',
    },
    {
      id: 'cm-5',
      circleId: '33333333-3333-3333-3333-333333333333',
      userId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
      userName: 'Dr. Julián Sotomayor',
      userEmail: 'autor@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      userRole: 'author',
      circleRole: 'moderator',
      joinedAt: '18 de Enero, 2024',
    },
  ],
  'resena-literaria': [
    {
      id: 'cm-6',
      circleId: '11111111-1111-1111-1111-111111111111',
      userId: 'cccccccc-3333-4333-c333-cccccccccccc',
      userName: 'Elena Rocafuerte',
      userEmail: 'editor@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      userRole: 'editor',
      circleRole: 'admin',
      joinedAt: '5 de Enero, 2024',
    },
    {
      id: 'cm-7',
      circleId: '11111111-1111-1111-1111-111111111111',
      userId: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
      userName: 'Sofía Valenzuela',
      userEmail: 'lector@anamnesis.com',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      userRole: 'reader',
      circleRole: 'member',
      joinedAt: '12 de Febrero, 2024',
    },
  ],
};

export const INITIAL_INVITATIONS: Record<string, CircleInvitationItem[]> = {
  'cronica': [
    {
      id: 'inv-1',
      circleId: '22222222-2222-2222-2222-222222222222',
      email: 'marian.garcia@cronicasur.org',
      role: 'moderator',
      invitedBy: 'cccccccc-3333-4333-c333-cccccccccccc',
      invitedByName: 'Elena Rocafuerte',
      status: 'pending',
      createdAt: 'Hace 2 días',
      expiresAt: 'En 5 días',
    },
    {
      id: 'inv-2',
      circleId: '22222222-2222-2222-2222-222222222222',
      email: 'rodrigo.palma@letrasvivas.cl',
      role: 'member',
      invitedBy: 'cccccccc-3333-4333-c333-cccccccccccc',
      invitedByName: 'Elena Rocafuerte',
      status: 'pending',
      createdAt: 'Hace 4 días',
      expiresAt: 'En 3 días',
    },
  ],
  'ensayo-medico': [
    {
      id: 'inv-3',
      circleId: '33333333-3333-3333-3333-333333333333',
      email: 'clara.mendoza@bioetica.edu',
      role: 'moderator',
      invitedBy: 'cccccccc-3333-4333-c333-cccccccccccc',
      invitedByName: 'Elena Rocafuerte',
      status: 'pending',
      createdAt: 'Hace 1 día',
      expiresAt: 'En 6 días',
    },
  ],
  'resena-literaria': [],
};

// ==============================================================================
// MOCK DATA: SLOTS DE DISPONIBILIDAD (30 MINUTOS) & RESERVAS
// ==============================================================================

const todayIso = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

export let INITIAL_SLOTS: AvailabilitySlotItem[] = [
  {
    id: 'slot-today-1',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorTimezone: 'America/Bogota',
    startTime: `${todayIso}T15:00:00.000Z`,
    endTime: `${todayIso}T15:30:00.000Z`,
    isBooked: true,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-today-2',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorTimezone: 'America/Bogota',
    startTime: `${todayIso}T16:00:00.000Z`,
    endTime: `${todayIso}T16:30:00.000Z`,
    isBooked: true,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-today-3',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorTimezone: 'America/Bogota',
    startTime: `${todayIso}T17:00:00.000Z`,
    endTime: `${todayIso}T17:30:00.000Z`,
    isBooked: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-tmrw-1',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorTimezone: 'America/Bogota',
    startTime: `${tomorrow}T14:00:00.000Z`,
    endTime: `${tomorrow}T14:30:00.000Z`,
    isBooked: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-tmrw-2',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorTimezone: 'America/Bogota',
    startTime: `${tomorrow}T14:30:00.000Z`,
    endTime: `${tomorrow}T15:00:00.000Z`,
    isBooked: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-elena-1',
    authorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    authorName: 'Elena Rocafuerte',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    authorTimezone: 'America/Buenos_Aires',
    startTime: `${tomorrow}T18:00:00.000Z`,
    endTime: `${tomorrow}T18:30:00.000Z`,
    isBooked: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'slot-elena-2',
    authorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    authorName: 'Elena Rocafuerte',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    authorTimezone: 'America/Buenos_Aires',
    startTime: `${dayAfter}T19:00:00.000Z`,
    endTime: `${dayAfter}T19:30:00.000Z`,
    isBooked: false,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

export let INITIAL_BOOKINGS: BookingSessionItem[] = [
  {
    id: 'book-1',
    slotId: 'slot-today-1',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorEmail: 'autor@anamnesis.com',
    authorTimezone: 'America/Bogota',
    readerId: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    readerName: 'Sofía Valenzuela',
    readerEmail: 'lector@anamnesis.com',
    readerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    articleId: '44444444-4444-4444-4444-444444444441',
    articleTitle: 'El peso de la palabra no dicha: Apuntes sobre la anamnesis en urgencias',
    articleSlug: 'el-peso-de-la-palabra-no-dicha',
    circleSlug: 'ensayo-medico',
    startTime: `${todayIso}T15:00:00.000Z`,
    endTime: `${todayIso}T15:30:00.000Z`,
    status: 'confirmed',
    notes: 'Quisiera profundizar en la tesis del capítulo 2 sobre la relación entre el luto por el oficio y los síntomas somáticos en urgencias.',
    createdAt: '2026-08-30T10:00:00.000Z',
  },
  {
    id: 'book-2',
    slotId: 'slot-today-2',
    authorId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    authorName: 'Dr. Julián Sotomayor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorEmail: 'autor@anamnesis.com',
    authorTimezone: 'America/Bogota',
    readerId: 'reader-rodrigo',
    readerName: 'Rodrigo Palma',
    readerEmail: 'rodrigo.palma@letrasvivas.cl',
    readerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    articleId: '44444444-4444-4444-4444-444444444442',
    articleTitle: 'Madrugadas en el tranvía fantasma: Los últimos maquinistas de la estación sur',
    articleSlug: 'madrugadas-en-el-tranvia-fantasma',
    circleSlug: 'cronica',
    startTime: `${todayIso}T16:00:00.000Z`,
    endTime: `${todayIso}T16:30:00.000Z`,
    status: 'confirmed',
    notes: 'Revisión de técnicas de inmersión etnográfica y archivo oral en crónicas de transporte urbano.',
    createdAt: '2026-08-31T14:30:00.000Z',
  },
];

// ==============================================================================
// MOCK DATA: BOOKMARKS (GUARDAR PARA DESPUÉS)
// ==============================================================================

export let INITIAL_BOOKMARKS: string[] = [
  '44444444-4444-4444-4444-444444444441', // El peso de la palabra no dicha
];

// ==============================================================================
// MOCK DATA: COMENTARIOS ANIDADOS & MODERACIÓN
// ==============================================================================

export let INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'comm-1',
    articleSlug: 'el-peso-de-la-palabra-no-dicha',
    userId: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    userName: 'Sofía Valenzuela',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'reader',
    parentId: null,
    content: 'Este ensayo toca una fibra muy profunda. Me recordó una cita de Rita Charon sobre cómo la medicina narrativa no reemplaza la bioquímica, sino que le devuelve su propósito ontológico y ético.',
    isHidden: false,
    createdAt: 'Hace 2 días',
    replies: [
      {
        id: 'comm-1-1',
        articleSlug: 'el-peso-de-la-palabra-no-dicha',
        userId: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
        userName: 'Dr. Julián Sotomayor',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        userRole: 'author',
        parentId: 'comm-1',
        content: '¡Exactamente, Sofía! Charon dio en el clavo. Sin el relato y la autobiografía del paciente, el diagnóstico se vuelve pura estadística desprovista de sentido existencial.',
        isHidden: false,
        createdAt: 'Hace 1 día',
      },
      {
        id: 'comm-1-2',
        articleSlug: 'el-peso-de-la-palabra-no-dicha',
        userId: 'cccccccc-3333-4333-c333-cccccccccccc',
        userName: 'Elena Rocafuerte',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        userRole: 'editor',
        parentId: 'comm-1',
        content: 'Es precisamente el valor que buscamos en el Círculo de Ensayo Médico: rescatar la voz clínica como un documento estético y ético.',
        isHidden: false,
        createdAt: 'Hace 14 horas',
      },
    ],
  },
  {
    id: 'comm-2',
    articleSlug: 'el-peso-de-la-palabra-no-dicha',
    userId: 'user-troll',
    userName: 'Usuario Anónimo',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    userRole: 'reader',
    parentId: null,
    content: 'La medicina es solo ciencia dura y algoritmos, la literatura no sirve para curar una neumonía.',
    isHidden: true, // Moderado por editor
    createdAt: 'Hace 3 días',
    replies: [],
  },
  {
    id: 'comm-3',
    articleSlug: 'madrugadas-en-el-tranvia-fantasma',
    userId: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    userName: 'Sofía Valenzuela',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userRole: 'reader',
    parentId: null,
    content: 'La atmósfera nocturna está lograda con una maestría sensorial impecable. Se puede oler el óxido y el café recalentado en el termo de don Amador.',
    isHidden: false,
    createdAt: 'Hace 3 días',
    replies: [],
  },
];

// ==============================================================================
// HELPERS Y FUNCIONES DE ACCESO A DATOS
// ==============================================================================

export function getCircleBySlug(slug: string): CircleDetail | null {
  return INITIAL_CIRCLES[slug] || null;
}

export function getArticlesByCircleSlug(slug: string): CircleArticleItem[] {
  return INITIAL_ARTICLES.filter((a) => a.circleSlug === slug && a.status === 'published');
}

export function getAuthorById(id: string): AuthorProfile | null {
  return INITIAL_AUTHORS[id] || Object.values(INITIAL_AUTHORS).find((a) => a.id === id || a.email.includes(id)) || null;
}

export function getArticlesByAuthorId(authorId: string): CircleArticleItem[] {
  return INITIAL_ARTICLES.filter((a) => a.authorId === authorId && a.status === 'published');
}

export function getCircleMembers(slug: string): CircleMemberItem[] {
  return INITIAL_MEMBERS[slug] || [];
}

export function getCircleInvitations(slug: string): CircleInvitationItem[] {
  return INITIAL_INVITATIONS[slug] || [];
}

export function getAvailabilitySlots(authorId?: string, onlyAvailable = false): AvailabilitySlotItem[] {
  let slots = [...INITIAL_SLOTS];
  if (authorId) {
    slots = slots.filter((s) => s.authorId === authorId);
  }
  if (onlyAvailable) {
    slots = slots.filter((s) => !s.isBooked);
  }
  return slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export function getBookingsByAuthor(authorId: string): BookingSessionItem[] {
  return INITIAL_BOOKINGS.filter((b) => b.authorId === authorId).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export function getBookingsByReader(readerId: string): BookingSessionItem[] {
  return INITIAL_BOOKINGS.filter((b) => b.readerId === readerId).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

// ------------------------------------------------------------------------------
// BOOKMARKS HELPERS
// ------------------------------------------------------------------------------

export function isArticleBookmarked(articleId: string): boolean {
  return INITIAL_BOOKMARKS.includes(articleId);
}

export async function toggleBookmarkMock(articleId: string): Promise<{ isBookmarked: boolean }> {
  const index = INITIAL_BOOKMARKS.indexOf(articleId);
  if (index > -1) {
    INITIAL_BOOKMARKS.splice(index, 1);
    return { isBookmarked: false };
  } else {
    INITIAL_BOOKMARKS.push(articleId);
    return { isBookmarked: true };
  }
}

export function getBookmarkedArticles(): CircleArticleItem[] {
  return INITIAL_ARTICLES.filter((a) => INITIAL_BOOKMARKS.includes(a.id));
}

// ------------------------------------------------------------------------------
// COMMENTS & MODERATION HELPERS
// ------------------------------------------------------------------------------

export function getCommentsByArticleSlug(slug: string): CommentItem[] {
  return INITIAL_COMMENTS.filter((c) => c.articleSlug === slug && c.parentId === null);
}

export async function addCommentMock(
  articleSlug: string,
  content: string,
  parentId: string | null = null,
  user?: { id: string; name: string; avatar: string; role: 'reader' | 'author' | 'editor' }
): Promise<CommentItem> {
  const authorInfo = user || {
    id: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    name: 'Sofía Valenzuela',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'reader' as const,
  };

  const newComment: CommentItem = {
    id: `comm-${Date.now()}`,
    articleSlug,
    userId: authorInfo.id,
    userName: authorInfo.name,
    userAvatar: authorInfo.avatar,
    userRole: authorInfo.role,
    parentId: parentId || null,
    content,
    isHidden: false,
    createdAt: 'Hace un instante',
    replies: [],
  };

  if (parentId) {
    const parentComment = INITIAL_COMMENTS.find((c) => c.id === parentId);
    if (parentComment) {
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(newComment);
    }
  } else {
    INITIAL_COMMENTS.push(newComment);
  }

  return newComment;
}

export async function toggleModerateCommentMock(
  commentId: string,
  shouldHide: boolean
): Promise<{ success: boolean; isHidden: boolean }> {
  // Buscar en comentarios principales
  for (const c of INITIAL_COMMENTS) {
    if (c.id === commentId) {
      c.isHidden = shouldHide;
      return { success: true, isHidden: shouldHide };
    }
    if (c.replies) {
      for (const r of c.replies) {
        if (r.id === commentId) {
          r.isHidden = shouldHide;
          return { success: true, isHidden: shouldHide };
        }
      }
    }
  }
  return { success: false, isHidden: false };
}

// ------------------------------------------------------------------------------
// RPCs ATÓMICAS (AGENDAMIENTO)
// ------------------------------------------------------------------------------

export async function bookSlotAtomicMock(
  slotId: string,
  readerId: string,
  articleId?: string,
  notes?: string,
  simulateRaceCondition = false
): Promise<{ success: boolean; bookingId?: string; message: string; errorCode?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const slotIndex = INITIAL_SLOTS.findIndex((s) => s.id === slotId);
  if (slotIndex === -1) {
    return {
      success: false,
      errorCode: 'SLOT_NOT_FOUND',
      message: 'El bloque de disponibilidad no existe o fue eliminado.',
    };
  }

  const slot = INITIAL_SLOTS[slotIndex];

  if (slot.isBooked || simulateRaceCondition) {
    return {
      success: false,
      errorCode: 'ALREADY_BOOKED',
      message: 'Este espacio acaba de ser reservado por otro lector. Por favor, selecciona otro horario disponible.',
    };
  }

  INITIAL_SLOTS[slotIndex] = { ...slot, isBooked: true };

  const reader = INITIAL_AUTHORS[readerId] || {
    id: readerId,
    fullName: 'Sofía Valenzuela',
    email: 'lector@anamnesis.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  };

  const article = INITIAL_ARTICLES.find((a) => a.id === articleId);

  const newBookingId = `book-${Date.now()}`;
  const newBooking: BookingSessionItem = {
    id: newBookingId,
    slotId: slot.id,
    authorId: slot.authorId,
    authorName: slot.authorName,
    authorAvatar: slot.authorAvatar,
    authorEmail: 'autor@anamnesis.com',
    authorTimezone: slot.authorTimezone,
    readerId: reader.id,
    readerName: reader.fullName,
    readerEmail: reader.email,
    readerAvatar: reader.avatarUrl,
    articleId: article?.id,
    articleTitle: article?.title,
    articleSlug: article?.slug,
    circleSlug: article?.circleSlug,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: 'confirmed',
    notes: notes || 'Mentoría y análisis clínico.',
    createdAt: new Date().toISOString(),
  };

  INITIAL_BOOKINGS.unshift(newBooking);

  return {
    success: true,
    bookingId: newBookingId,
    message: '¡Sesión de 30 minutos confirmada exitosamente!',
  };
}

export async function cancelBookingAtomicMock(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; message: string; errorCode?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const bookingIndex = INITIAL_BOOKINGS.findIndex((b) => b.id === bookingId);
  if (bookingIndex === -1) {
    return {
      success: false,
      errorCode: 'BOOKING_NOT_FOUND',
      message: 'La reserva solicitada no existe.',
    };
  }

  const booking = INITIAL_BOOKINGS[bookingIndex];

  const startMillis = new Date(booking.startTime).getTime();
  const diffHours = (startMillis - Date.now()) / (1000 * 60 * 60);

  if (diffHours < 2) {
    return {
      success: false,
      errorCode: 'CANCELLATION_DEADLINE_PASSED',
      message: 'Las cancelaciones solo se permiten con un mínimo de 2 horas de anticipación al inicio de la sesión.',
    };
  }

  INITIAL_BOOKINGS[bookingIndex] = { ...booking, status: 'cancelled' };

  const slotIndex = INITIAL_SLOTS.findIndex((s) => s.id === booking.slotId);
  if (slotIndex !== -1) {
    INITIAL_SLOTS[slotIndex] = { ...INITIAL_SLOTS[slotIndex], isBooked: false };
  }

  return {
    success: true,
    message: 'La sesión ha sido cancelada exitosamente y el horario se ha liberado.',
  };
}

export async function createSlotMock(
  authorId: string,
  startTimeIso: string,
  endTimeIso: string
): Promise<AvailabilitySlotItem> {
  const author = INITIAL_AUTHORS[authorId] || INITIAL_AUTHORS['bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'];
  const newSlot: AvailabilitySlotItem = {
    id: `slot-${Date.now()}`,
    authorId: author.id,
    authorName: author.fullName,
    authorAvatar: author.avatarUrl,
    authorTimezone: author.timezone,
    startTime: startTimeIso,
    endTime: endTimeIso,
    isBooked: false,
    createdAt: new Date().toISOString(),
  };

  INITIAL_SLOTS.push(newSlot);
  return newSlot;
}

export async function deleteSlotMock(slotId: string): Promise<boolean> {
  const initialLength = INITIAL_SLOTS.length;
  INITIAL_SLOTS = INITIAL_SLOTS.filter((s) => s.id !== slotId);
  return INITIAL_SLOTS.length < initialLength;
}

// ------------------------------------------------------------------------------
// ARTICLE UPSERT & UNIQUE SLUG GENERATOR
// ------------------------------------------------------------------------------

export function generateUniqueSlug(title: string, currentArticleId?: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'manuscrito';

  const collision = INITIAL_ARTICLES.find(
    (a) => a.slug === baseSlug && a.id !== currentArticleId
  );

  if (!collision) {
    return baseSlug;
  }

  // Generar sufijo único de 4 caracteres para evitar colisión de URLs
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${uniqueSuffix}`;
}

export async function upsertArticleMock(article: Partial<CircleArticleItem> & { title: string; circleSlug: string }): Promise<CircleArticleItem> {
  const existingIndex = INITIAL_ARTICLES.findIndex(
    (a) => a.id === article.id || (article.slug && a.slug === article.slug)
  );

  const author = article.authorId
    ? INITIAL_AUTHORS[article.authorId]
    : INITIAL_AUTHORS['bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'];

  const circle = INITIAL_CIRCLES[article.circleSlug] || INITIAL_CIRCLES['ensayo-medico'];

  const finalSlug = article.slug || generateUniqueSlug(article.title, article.id);

  if (existingIndex > -1) {
    const updated: CircleArticleItem = {
      ...INITIAL_ARTICLES[existingIndex],
      ...article,
      slug: finalSlug,
      circleId: circle.id,
      circleName: circle.name,
      circleSlug: circle.slug,
      status: article.status || INITIAL_ARTICLES[existingIndex].status,
    };
    INITIAL_ARTICLES[existingIndex] = updated;
    return updated;
  } else {
    const newArticle: CircleArticleItem = {
      id: article.id || `art-${Date.now()}`,
      title: article.title,
      slug: finalSlug,
      circleId: circle.id,
      circleSlug: circle.slug,
      circleName: circle.name,
      authorId: author?.id || 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
      authorName: author?.fullName || 'Dr. Julián Sotomayor',
      authorAvatar: author?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      excerpt: article.excerpt || '',
      readingTimeMin: article.readingTimeMin || 5,
      status: article.status || 'draft',
      tags: article.tags || ['Ensayo'],
      createdAt: '1 de Septiembre, 2026',
      coverUrl: article.coverUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
    };
    INITIAL_ARTICLES.unshift(newArticle);
    return newArticle;
  }
}

