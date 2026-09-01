export interface AuthorProfile {
  id: string;
  email: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  role: 'reader' | 'author' | 'editor';
  timezone: string;
  specialty: string;
  location: string;
  joinedDate: string;
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
}

export interface CircleMemberItem {
  id: string;
  circleId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'reader' | 'author' | 'editor';
  circleRole: 'member' | 'moderator' | 'admin';
  joinedAt: string;
}

export interface CircleInvitationItem {
  id: string;
  circleId: string;
  email: string;
  role: 'member' | 'moderator' | 'admin';
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface CircleDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  coverUrl: string;
  editorId: string;
  editorName: string;
  editorBio: string;
  editorAvatar: string;
  editorRole: string;
  membersCount: number;
  tags: string[];
}

export const INITIAL_AUTHORS: Record<string, AuthorProfile> = {
  'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb': {
    id: 'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb',
    email: 'autor@anamnesis.com',
    fullName: 'Dr. Julián Sotomayor',
    bio: 'Médico internista en hospital universitario y ensayista. Investiga la intersección entre el diagnóstico clínico, el dolor humano y la memoria sensorial en la práctica médica.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role: 'author',
    timezone: 'America/Bogota (UTC-5)',
    specialty: 'Medicina Interna & Ensayística Clínica',
    location: 'Bogotá, Colombia',
    joinedDate: 'Marzo 2024',
  },
  'cccccccc-3333-4333-c333-cccccccccccc': {
    id: 'cccccccc-3333-4333-c333-cccccccccccc',
    email: 'editor@anamnesis.com',
    fullName: 'Elena Rocafuerte',
    bio: 'Crítica literaria, docente universitaria y editora en jefe de Anamnesis. Curadora de voces emergentes en no-ficción, crónica urbana y ensayo contemporáneo.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    role: 'editor',
    timezone: 'America/Argentina/Buenos_Aires (UTC-3)',
    specialty: 'Crítica Literaria & Narrativas de No-Ficción',
    location: 'Buenos Aires, Argentina',
    joinedDate: 'Enero 2024',
  },
  'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa': {
    id: 'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa',
    email: 'lector@anamnesis.com',
    fullName: 'Sofía Valenzuela',
    bio: 'Estudiante de literatura comparada y asidua lectora de crónicas urbanas, bioética y filosofía del cuidado.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    role: 'reader',
    timezone: 'America/Mexico_City (UTC-6)',
    specialty: 'Literatura Comparada & Bioética',
    location: 'Ciudad de México, México',
    joinedDate: 'Abril 2024',
  },
};

export const INITIAL_CIRCLES: Record<string, CircleDetail> = {
  'ensayo-medico': {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Ensayo Médico',
    slug: 'ensayo-medico',
    description: 'Reflexiones clínicas, fenomenología del cuerpo enfermo, dilemas de bioética y la anamnesis como puente entre ciencia y humanismo.',
    longDescription: 'Este círculo reúne a médicos, filósofos, enfermeros y pacientes en torno a la narrativa de la enfermedad. Aquí la medicina deja de ser exclusivamente un protocolo técnico para restituir el valor insustituible de la palabra, la escucha activa y la experiencia corpórea del sufrimiento y la sanación.',
    coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorBio: 'Editora en jefe de Anamnesis y curadora de ensayos de bioética y narrativa clínica.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    editorRole: 'Editora Principal',
    membersCount: 42,
    tags: ['Medicina Narrativa', 'Bioética', 'Guardias Clínicas', 'Humanismo', 'Epistemología'],
  },
  'cronica': {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Crónica',
    slug: 'cronica',
    description: 'Relatos de no-ficción, periodismo narrativo, cartografías de la memoria urbana y testimonios de la vida cotidiana en América Latina.',
    longDescription: 'El círculo de Crónica documenta los márgenes invisibles de las grandes urbes: los trabajadores nocturnos, los oficios extintos, los desplazamientos silenciosos y la resistencia cotidiana contada desde la inmersión directa en el territorio.',
    coverUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&auto=format&fit=crop&q=80',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorBio: 'Crítica cultural y editora especializada en periodismo narrativo y crónica urbana.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    editorRole: 'Editora Principal',
    membersCount: 68,
    tags: ['Crónica Urbana', 'Memoria', 'Oficios Perdidos', 'Ciudad', 'No-Ficción'],
  },
  'resena-literaria': {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Reseña Literaria',
    slug: 'resena-literaria',
    description: 'Análisis riguroso, crítica de novedades editoriales y relecturas de obras canónicas hispanoamericanas bajo la mirada contemporánea.',
    longDescription: 'Espacio dedicado a la crítica literaria de fondo, la exégesis poética y el rescate de obras olvidadas del canon latinoamericano del siglo XX y XXI.',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
    editorId: 'cccccccc-3333-4333-c333-cccccccccccc',
    editorName: 'Elena Rocafuerte',
    editorBio: 'Docente de literatura comparada y ensayista.',
    editorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    editorRole: 'Editora Principal',
    membersCount: 89,
    tags: ['Crítica Literaria', 'Narrativa', 'Siglo XX', 'Estética', 'Poesía'],
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
    excerpt: 'En la guardia nocturna, el silencio de un paciente suele ser más elocuente que cualquier estudio tomográfico. La escucha como el diagnóstico más riguroso.',
    readingTimeMin: 7,
    status: 'published',
    tags: ['Medicina Narrativa', 'Bioética', 'Guardias Clínicas', 'Humanismo'],
    createdAt: '1 de Septiembre, 2026',
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
    excerpt: 'A las cuatro y cuarto de la madrugada, los rieles de la terminal sur emiten un chirrido metálico que parece venir de otro siglo. Carlos limpia el parabrisas empañado...',
    readingTimeMin: 9,
    status: 'published',
    tags: ['Crónica Urbana', 'Memoria', 'Oficios Perdidos', 'Ciudad'],
    createdAt: '28 de Agosto, 2026',
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

// Helper Functions
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
