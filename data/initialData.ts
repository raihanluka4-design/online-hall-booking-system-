import { Booking, Hall, ProjectInfo, User } from '../types';

export const INITIAL_PROJECT_INFO: ProjectInfo = {
  name: 'Online Hall Booking System',
  subject: 'PBCST304: Object-Oriented Programming',
  courseCode: 'PBCST304',
  department: 'AI & ML',
  academicYear: '2026–27',
  guide: {
    name: 'Mrs. Shana Musthafa APV',
    designation: 'Assistant Professor',
  },
  teamMembers: [
    { name: 'MISHAL SHAHIL', role: 'Full-Stack Developer & OOP Architecture' },
    { name: 'MUHAMMED ZAEEM P.A', role: 'Backend Services & Database Design' },
    { name: 'NAJWA A', role: 'Frontend UI/UX & Responsive Design' },
    { name: 'SHAMA SHERIFF', role: 'Testing & Validation Engine' },
    { name: 'PRANAB B MURALI', role: 'Analytics & Reporting Module' },
  ],
};

export const INITIAL_USERS: User[] = [
  {
    userId: 'USR-1001',
    name: 'Alex Mercer',
    email: 'student@example.com',
    phone: '+91 98765 43210',
    password: 'student123',
    role: 'USER',
    status: 'ACTIVE',
    department: 'AI & ML',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    userId: 'USR-1002',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@example.com',
    phone: '+91 98765 00001',
    password: 'admin123',
    role: 'ADMIN',
    status: 'ACTIVE',
    department: 'Department Administration',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    userId: 'USR-1003',
    name: 'Najwa A',
    email: 'najwa@college.edu',
    phone: '+91 98451 12345',
    password: 'password123',
    role: 'USER',
    status: 'ACTIVE',
    department: 'AI & ML',
    createdAt: '2026-01-15T10:30:00.000Z',
  },
  {
    userId: 'USR-1004',
    name: 'Mishal Shahil',
    email: 'mishal@college.edu',
    phone: '+91 98452 23456',
    password: 'password123',
    role: 'USER',
    status: 'ACTIVE',
    department: 'AI & ML',
    createdAt: '2026-01-18T11:15:00.000Z',
  },
  {
    userId: 'USR-1005',
    name: 'Muhammed Zaeem P.A',
    email: 'zaeem@college.edu',
    phone: '+91 98453 34567',
    password: 'password123',
    role: 'USER',
    status: 'ACTIVE',
    department: 'AI & ML',
    createdAt: '2026-01-20T14:20:00.000Z',
  },
];

export const INITIAL_HALLS: Hall[] = [
  {
    hallId: 'HALL-01',
    hallName: 'Seminar Hall',
    capacity: 100,
    location: 'Block A, 2nd Floor',
    facilities: ['Projector', 'Air Conditioning', 'Wi-Fi', 'Sound System', 'Seating'],
    description: 'Modern seminar space equipped with ultra-bright dual projection, surround acoustic setup, and ergonomic tier seating ideal for guest lectures, symposiums, and departmental seminars.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    type: 'Seminar Hall',
    rules: [
      'Advance reservation required at least 2 hours prior',
      'Food and open beverages are strictly prohibited inside the hall',
      'Faculty coordinator must supervise AV system operation'
    ],
  },
  {
    hallId: 'HALL-02',
    hallName: 'Main Auditorium',
    capacity: 500,
    location: 'Central Campus Complex, Ground Floor',
    facilities: ['Stage', 'Projector', 'Sound System', 'Air Conditioning', 'Parking', 'Seating'],
    description: 'State-of-the-art grand auditorium with motorized lighting rig, pro-audio line array sound, large theatrical stage, and acoustic baffling for cultural fests, conferences, and convocations.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    type: 'Auditorium',
    rules: [
      'Security clearance required for events with 300+ attendees',
      'Stage lights must be managed by designated campus technicians',
      'Decorations must not damage wooden stage finishes'
    ],
  },
  {
    hallId: 'HALL-03',
    hallName: 'Conference Hall',
    capacity: 60,
    location: 'Administrative Wing, 3rd Floor',
    facilities: ['Projector', 'Wi-Fi', 'Air Conditioning', 'Sound System', 'Seating'],
    description: 'Executive board-style room configured for academic council discussions, faculty development programs, project reviews, and hybrid video-conferencing.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    type: 'Conference Hall',
    rules: [
      'High-speed video conference unit requires login passcode from admin',
      'Maintain boardroom quiet etiquette in surrounding executive corridors'
    ],
  },
  {
    hallId: 'HALL-04',
    hallName: 'Computer Lab',
    capacity: 50,
    location: 'IT & Computing Block, 1st Floor',
    facilities: ['Computers', 'Projector', 'Wi-Fi', 'Air Conditioning'],
    description: 'High-performance AI/ML computing lab equipped with 50 GPU workstations, gigabit ethernet, interactive smartboard, and centralized server access for coding hackathons and lab sessions.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    type: 'Computer Lab',
    rules: [
      'No personal software installation without prior lab admin authorization',
      'Maintain assigned terminal seating during coding contests'
    ],
  },
  {
    hallId: 'HALL-05',
    hallName: 'Mini Hall',
    capacity: 80,
    location: 'Block B, 1st Floor',
    facilities: ['Projector', 'Sound System', 'Seating', 'Air Conditioning'],
    description: 'Cozy and versatile medium-capacity hall ideal for club meetings, debate sessions, group discussions, and student orientation events.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    status: 'AVAILABLE',
    type: 'Mini Hall',
    rules: [
      'Chairs can be rearranged for group activities but must be restored after the event'
    ],
  },
];

// Helper to compute dynamic relative dates for realistic demo freshness
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    bookingId: 'HB-84912',
    userId: 'USR-1001', // Alex Mercer (demo student)
    hallId: 'HALL-01', // Seminar Hall
    date: getRelativeDate(2),
    timeSlot: '09:00 AM – 11:00 AM',
    status: 'CONFIRMED',
    purpose: 'AI & ML Technical Paper Presentation & Workshop',
    attendees: 75,
    remarks: 'Approved by Dept Head',
    createdAt: '2026-02-20T10:15:00.000Z',
  },
  {
    bookingId: 'HB-84915',
    userId: 'USR-1001', // Alex Mercer (demo student)
    hallId: 'HALL-04', // Computer Lab
    date: getRelativeDate(5),
    timeSlot: '02:00 PM – 04:00 PM',
    status: 'CONFIRMED',
    purpose: 'Neural Network Model Training & Coding Hackathon',
    attendees: 45,
    remarks: 'Requires GPU cluster access',
    createdAt: '2026-02-21T14:30:00.000Z',
  },
  {
    bookingId: 'HB-83100',
    userId: 'USR-1001', // Alex Mercer
    hallId: 'HALL-03', // Conference Hall
    date: getRelativeDate(-3),
    timeSlot: '11:00 AM – 01:00 PM',
    status: 'COMPLETED',
    purpose: 'Object-Oriented Programming Project Review Phase 1',
    attendees: 20,
    remarks: 'Reviewed successfully',
    createdAt: '2026-02-10T11:00:00.000Z',
  },
  {
    bookingId: 'HB-82990',
    userId: 'USR-1001', // Alex Mercer
    hallId: 'HALL-05', // Mini Hall
    date: getRelativeDate(-7),
    timeSlot: '04:00 PM – 06:00 PM',
    status: 'CANCELLED',
    purpose: 'Robotics Club Preliminary Brainstorming',
    attendees: 30,
    remarks: 'Cancelled due to faculty schedule clash',
    createdAt: '2026-02-05T09:45:00.000Z',
  },
  {
    bookingId: 'HB-85001',
    userId: 'USR-1003', // Najwa
    hallId: 'HALL-02', // Main Auditorium
    date: getRelativeDate(1),
    timeSlot: '02:00 PM – 04:00 PM',
    status: 'CONFIRMED',
    purpose: 'Annual National AI Symposium Inauguration',
    attendees: 420,
    remarks: 'VIP dignitaries attending',
    createdAt: '2026-02-18T16:00:00.000Z',
  },
  {
    bookingId: 'HB-85002',
    userId: 'USR-1004', // Mishal
    hallId: 'HALL-01', // Seminar Hall
    date: getRelativeDate(3),
    timeSlot: '11:00 AM – 01:00 PM',
    status: 'CONFIRMED',
    purpose: 'Deep Learning in Healthcare Guest Lecture',
    attendees: 90,
    remarks: 'Speaker from AI Institute',
    createdAt: '2026-02-19T08:30:00.000Z',
  },
  {
    bookingId: 'HB-85003',
    userId: 'USR-1005', // Muhammed Zaeem
    hallId: 'HALL-03', // Conference Hall
    date: getRelativeDate(4),
    timeSlot: '09:00 AM – 11:00 AM',
    status: 'CONFIRMED',
    purpose: 'Academic Committee Curriculum Review 2026',
    attendees: 35,
    remarks: 'Official departmental meeting',
    createdAt: '2026-02-22T10:00:00.000Z',
  },
];
