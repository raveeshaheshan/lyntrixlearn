// Lyntrix Learn - Core Data Store & LMS Mock Database

export const SUBJECT_CATEGORIES = [
  { id: "all", name: "All Subjects", icon: "BookOpen" },
  { id: "maths", name: "Combined Maths", icon: "Calculator" },
  { id: "physics", name: "Physics", icon: "Zap" },
  { id: "chemistry", name: "Chemistry", icon: "FlaskConical" },
  { id: "ict", name: "Information Tech (ICT)", icon: "Code2" },
  { id: "biology", name: "Biology", icon: "Dna" }
];

export const GRADE_STREAMS = [
  { id: "all", name: "All Batches" },
  { id: "2025", name: "2025 A/L (Theory / Revision)" },
  { id: "2026", name: "2026 A/L (Theory)" },
  { id: "2027", name: "2027 A/L (New Batch)" }
];

export const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle"
];

export const INITIAL_INSTRUCTORS = [
  {
    id: "ins-kasun-maths",
    name: "Eng. Kasun Ranasinghe",
    title: "B.Sc. Eng (Hons) University of Moratuwa",
    subject: "Combined Mathematics",
    subjectCategory: "maths",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
    themeColor: "indigo",
    badge: "Top Ranked A/L Master",
    rating: 4.98,
    reviewsCount: 1420,
    studentsCount: 3420,
    monthlyFee: 3500,
    activeBatchesCount: 3,
    bankDetails: {
      bank: "Commercial Bank (Nawala)",
      accountName: "K. M. K. Ranasinghe",
      accountNumber: "8009124451",
      branch: "Nawala"
    },
    bio: "Empowering Sri Lankan A/L students with deep conceptual mathematical thinking. Over 10+ years producing Island 1st and Top 10 rankings in Combined Maths.",
    features: ["Dynamic Anti-Piracy Player", "Weekly Model Paper Grading", "Monthly Printed Tute Delivery", "QR Speed Attendance"],
    batches: [
      {
        id: "batch-km-2025-theory",
        code: "KM-2025-TH",
        title: "2025 A/L Combined Maths — Full Theory Masterclass",
        grade: "2025 A/L",
        gradeYear: "2025",
        medium: "Sinhala / English Medium",
        schedule: "Every Sunday 7:30 AM - 1:30 PM",
        status: "Active",
        monthlyFee: 3500,
        enrolledCount: 1840,
        nextLive: "2026-08-16T07:30:00",
        zoomLink: "https://zoom.us/j/98712345678",
        recordingCount: 48,
        description: "Comprehensive coverage of Pure Maths & Applied Maths with step-by-step past paper dissections and monthly printed tutes.",
        modules: [
          {
            id: "mod-1",
            title: "Module 08: Integral Calculus & Advanced Trigonometry (අනුකලනය)",
            lessonCount: 4,
            tuteFileName: "Pure_Maths_Integration_Master_Sheet_2025.pdf",
            lessons: [
              { id: "les-km-01", title: "Lesson 34: Integration by Parts & ILATE Technique", duration: "3h 45m", date: "Aug 10", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
              { id: "les-km-02", title: "Lesson 33: Circular Motion & Centripetal Acceleration", duration: "3h 30m", date: "Aug 03", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
            ]
          },
          {
            id: "mod-2",
            title: "Module 07: Coordinate Geometry & Straight Lines (ඛණ්ඩාංක ජ්‍යාමිතිය)",
            lessonCount: 3,
            tuteFileName: "Coord_Geometry_Theory_Pack.pdf",
            lessons: [
              { id: "les-km-03", title: "Lesson 32: Conic Sections & Parabola Properties", duration: "3h 15m", date: "Jul 27", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
            ]
          }
        ]
      },
      {
        id: "batch-km-2025-revision",
        code: "KM-2025-REV",
        title: "2025 A/L Speed Revision & 100 Day Paper Class",
        grade: "2025 A/L",
        gradeYear: "2025",
        medium: "Sinhala Medium",
        schedule: "Every Wednesday 3:30 PM - 8:00 PM",
        status: "Active",
        monthlyFee: 3800,
        enrolledCount: 1210,
        nextLive: "2026-08-19T15:30:00",
        zoomLink: "https://zoom.us/j/98712345679",
        recordingCount: 24,
        description: "Targeting A grades through timed structured essay papers and speed calculation techniques.",
        modules: []
      },
      {
        id: "batch-km-2026-theory",
        code: "KM-2026-TH",
        title: "2026 A/L Combined Maths — Foundation & Theory",
        grade: "2026 A/L",
        gradeYear: "2026",
        medium: "Sinhala / English Medium",
        schedule: "Every Saturday 7:30 AM - 1:00 PM",
        status: "Active",
        monthlyFee: 3500,
        enrolledCount: 370,
        nextLive: "2026-08-15T07:30:00",
        zoomLink: "https://zoom.us/j/98712345680",
        recordingCount: 12,
        description: "Fundamental algebraic structures, coordinate geometry, and early calculus mastery.",
        modules: []
      }
    ]
  },
  {
    id: "ins-danushka-physics",
    name: "Dr. Danushka Senanayake",
    title: "Ph.D. in Applied Physics (Univ. of Peradeniya)",
    subject: "Physics",
    subjectCategory: "physics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80",
    themeColor: "emerald",
    badge: "Island Top Physics Master",
    rating: 4.95,
    reviewsCount: 1180,
    studentsCount: 2890,
    monthlyFee: 3500,
    activeBatchesCount: 2,
    bankDetails: {
      bank: "Bank of Ceylon (Torrington)",
      accountName: "D. P. Senanayake",
      accountNumber: "00078912440",
      branch: "Torrington Square"
    },
    bio: "Visualizing complex physics concepts with 3D simulations, real laboratory demonstrations, and crystal-clear logic.",
    features: ["Interactive 3D Physics Labs", "Full Theory + Structured Essays", "Printed Tute Delivery"],
    batches: [
      {
        id: "batch-ds-2025-theory",
        code: "PHY-2025-TH",
        title: "2025 A/L Physics — Complete Theory & Mechanics",
        grade: "2025 A/L",
        gradeYear: "2025",
        medium: "Sinhala Medium",
        schedule: "Every Monday 3:00 PM - 8:00 PM",
        status: "Active",
        monthlyFee: 3500,
        enrolledCount: 1540,
        nextLive: "2026-08-17T15:00:00",
        zoomLink: "https://zoom.us/j/98733344411",
        recordingCount: 42,
        description: "Rotational Motion, Waves & Oscillations, Electrostatics with live interactive numerical problem solving.",
        modules: []
      }
    ]
  },
  {
    id: "ins-dilshan-ict",
    name: "Dilshan Weerasinghe",
    title: "Software Architect & Lecturer (B.Sc. IT, MSc CS)",
    subject: "Information & Communication Tech (ICT)",
    subjectCategory: "ict",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    themeColor: "cyan",
    badge: "Tech Pioneer",
    rating: 4.96,
    reviewsCount: 890,
    studentsCount: 1740,
    monthlyFee: 3200,
    activeBatchesCount: 1,
    bankDetails: {
      bank: "Sampath Bank (Colombo Super)",
      accountName: "Dilshan Weerasinghe",
      accountNumber: "101955432190",
      branch: "Colombo"
    },
    bio: "Learn A/L ICT from an industry software architect. Hands-on Python programming, Database Design (SQL), Networking, and Web Development.",
    features: ["Live Cloud Coding Sandboxes", "Automated Python MCQ Quizzes", "HD Screen Recorded Replays"],
    batches: [
      {
        id: "batch-dw-2025-ict",
        code: "ICT-2025-TH",
        title: "2025 A/L ICT — Theory, Python & Database Architecture",
        grade: "2025 A/L",
        gradeYear: "2025",
        medium: "English / Sinhala Mixed",
        schedule: "Every Tuesday 5:00 PM - 8:30 PM",
        status: "Active",
        monthlyFee: 3200,
        enrolledCount: 1740,
        nextLive: "2026-08-18T17:00:00",
        zoomLink: "https://zoom.us/j/98755566677",
        recordingCount: 38,
        description: "Master Python programming logic, ER diagrams, SQL queries, and networking OSI layers.",
        modules: []
      }
    ]
  },
  {
    id: "ins-amila-chemistry",
    name: "Amila Prasad",
    title: "B.Sc. (Special Chemistry) Univ. of Sri Jayewardenepura",
    subject: "Chemistry",
    subjectCategory: "chemistry",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=1200&auto=format&fit=crop&q=80",
    themeColor: "rose",
    badge: "Organic & Physical Specialist",
    rating: 4.92,
    reviewsCount: 950,
    studentsCount: 2150,
    monthlyFee: 3500,
    activeBatchesCount: 1,
    bankDetails: {
      bank: "Hatton National Bank",
      accountName: "Amila Prasad",
      accountNumber: "039010045672",
      branch: "Nugegoda"
    },
    bio: "Unraveling Organic Reaction mechanisms and Physical Chemistry calculations with visual memory tricks and comprehensive notes.",
    features: ["Color Printed Tute Home Delivery", "Organic Roadmaps", "Real Exam Simulated MCQs"],
    batches: [
      {
        id: "batch-ap-2025-chem",
        code: "CHE-2025-TH",
        title: "2025 A/L Chemistry — Organic Synthesis & Equilibrium",
        grade: "2025 A/L",
        gradeYear: "2025",
        medium: "Sinhala Medium",
        schedule: "Every Thursday 4:00 PM - 8:30 PM",
        status: "Active",
        monthlyFee: 3500,
        enrolledCount: 2150,
        nextLive: "2026-08-20T16:00:00",
        zoomLink: "https://zoom.us/j/98777788899",
        recordingCount: 44,
        description: "Mastering reaction pathways, aromatic compounds, buffer solutions, and electrochemistry.",
        modules: []
      }
    ]
  }
];

export const INITIAL_LESSONS = [
  {
    id: "les-km-01",
    batchId: "batch-km-2025-theory",
    instructorId: "ins-kasun-maths",
    title: "Lesson 34: Integration by Parts & Trigonometric Substitutions (අනුකලනය)",
    unit: "Pure Mathematics",
    duration: "3h 45m",
    date: "August 10, 2026",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    viewsCount: 1620,
    hasQuiz: true,
    quizId: "quiz-km-integration",
    notesPdf: "Pure_Maths_Integration_Master_Sheet_2025.pdf",
    description: "Deep dive into complex trigonometric substitutions, reduction formulas, and definite integral boundaries with 10 past paper essay questions.",
    chapters: [
      { time: 0, title: "01. Introduction & Standard Integrals Revision" },
      { time: 640, title: "02. Integration by Parts Formula & ILATE Rule" },
      { time: 1850, title: "03. Solving Complex Cyclic Integrals" },
      { time: 3600, title: "04. Special Trigonometric Substitutions (tan x/2)" },
      { time: 5400, title: "05. Past Paper 2023 Essay Dissection & Homework" }
    ]
  },
  {
    id: "les-km-02",
    batchId: "batch-km-2025-theory",
    instructorId: "ins-kasun-maths",
    title: "Lesson 33: Circular Motion & Relative Velocity (වෘත්ත චලිතය)",
    unit: "Applied Mathematics",
    duration: "3h 30m",
    date: "August 03, 2026",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    viewsCount: 1780,
    hasQuiz: true,
    quizId: "quiz-km-circular",
    notesPdf: "Applied_Maths_Circular_Motion_Class_Tute.pdf",
    description: "Centripetal acceleration, banking of roads, vertical circular motion tension calculations, and equilibrium conditions.",
    chapters: [
      { time: 0, title: "01. Centripetal Force Vector Concept" },
      { time: 900, title: "02. Road Banking without Friction vs with Friction" },
      { time: 2400, title: "03. Energy Conservation in Vertical Loops" }
    ]
  },
  {
    id: "les-ds-01",
    batchId: "batch-ds-2025-theory",
    instructorId: "ins-danushka-physics",
    title: "Lesson 28: Magnetic Fields & Faraday's Law of Induction (චුම්භක ක්ෂේත්‍ර)",
    unit: "Electromagnetism",
    duration: "3h 15m",
    date: "August 08, 2026",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80",
    viewsCount: 1490,
    hasQuiz: true,
    quizId: "quiz-ds-em",
    notesPdf: "Physics_Electromagnetism_Theory_Note.pdf",
    description: "Biot-Savart Law, Ampere's Circuital Law, Magnetic Force on moving charges, and Lenz's Law practical experiments.",
    chapters: [
      { time: 0, title: "01. Magnetic Flux Density & Right Hand Grip Rule" },
      { time: 1100, title: "02. Force between Parallel Current Carrying Conductors" }
    ]
  },
  {
    id: "les-dw-01",
    batchId: "batch-dw-2025-ict",
    instructorId: "ins-dilshan-ict",
    title: "Lesson 22: Python Object-Oriented Programming & SQL Database Integration",
    unit: "Software Development",
    duration: "2h 50m",
    date: "August 09, 2026",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    viewsCount: 1530,
    hasQuiz: true,
    quizId: "quiz-dw-python",
    notesPdf: "Python_OOP_SQL_A_Level_Guide.pdf",
    description: "Classes, Objects, Inheritance, Polymorphism, and connecting Python applications to MySQL database with CRUD operations.",
    chapters: [
      { time: 0, title: "01. OOP Paradigms in Python vs Procedural" },
      { time: 800, title: "02. Constructing Classes & __init__ Methods" }
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "std-8821",
    indexNumber: "LYN-25-8821",
    name: "Nimesh Fernando",
    email: "nimesh.f@gmail.com",
    phone: "+94 77 123 4567",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    batch: "2025 A/L Physical Science",
    nic: "200412890123",
    district: "Colombo",
    address: "No. 42/B, Highlevel Road, Nugegoda",
    qrToken: "QR-LYN-STD-8821-SECURE-KEY",
    activeMonth: "August 2026",
    enrollments: [
      {
        batchId: "batch-km-2025-theory",
        instructorId: "ins-kasun-maths",
        paymentStatus: "Paid",
        paidDate: "2026-08-01",
        accessExpires: "2026-08-31",
        progress: 88,
        attendanceRate: 95,
        tuteDelivery: {
          status: "Delivered",
          trackingNumber: "PRX-998241",
          courier: "PromptX Express",
          packTitle: "August Theory Tute Pack + Paper #08",
          deliveredDate: "Aug 06, 2026"
        }
      },
      {
        batchId: "batch-ds-2025-theory",
        instructorId: "ins-danushka-physics",
        paymentStatus: "Paid",
        paidDate: "2026-08-02",
        accessExpires: "2026-08-31",
        progress: 74,
        attendanceRate: 90,
        tuteDelivery: {
          status: "Dispatched",
          trackingNumber: "SP-441209",
          courier: "Sri Lanka Post SpeedPost",
          packTitle: "Electromagnetism Color Tute",
          deliveredDate: null
        }
      },
      {
        batchId: "batch-dw-2025-ict",
        instructorId: "ins-dilshan-ict",
        paymentStatus: "Pending",
        paidDate: null,
        accessExpires: null,
        progress: 45,
        attendanceRate: 80,
        tuteDelivery: null
      }
    ]
  },
  {
    id: "std-8822",
    indexNumber: "LYN-25-8822",
    name: "Kavindi Bandara",
    email: "kavindi.b@yahoo.com",
    phone: "+94 71 889 9123",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    batch: "2025 A/L Physical Science",
    nic: "200456789012",
    district: "Kandy",
    address: "Peradeniya Road, Kandy",
    qrToken: "QR-LYN-STD-8822-SECURE-KEY",
    activeMonth: "August 2026",
    enrollments: [
      {
        batchId: "batch-km-2025-theory",
        instructorId: "ins-kasun-maths",
        paymentStatus: "Paid",
        paidDate: "2026-08-03",
        accessExpires: "2026-08-31",
        progress: 92,
        attendanceRate: 100,
        tuteDelivery: {
          status: "Delivered",
          trackingNumber: "PRX-882194",
          courier: "PromptX Express",
          packTitle: "August Theory Tute Pack",
          deliveredDate: "Aug 07, 2026"
        }
      },
      {
        batchId: "batch-ap-2025-chem",
        instructorId: "ins-amila-chemistry",
        paymentStatus: "Pending",
        paidDate: null,
        accessExpires: null,
        progress: 60,
        attendanceRate: 85,
        tuteDelivery: null
      }
    ]
  },
  {
    id: "std-8823",
    indexNumber: "LYN-26-8823",
    name: "Sachintha Perera",
    email: "sachintha.p@gmail.com",
    phone: "+94 76 554 4321",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    batch: "2026 A/L Combined Maths",
    nic: "200533219876",
    district: "Gampaha",
    address: "Colombo Road, Gampaha",
    qrToken: "QR-LYN-STD-8823-SECURE-KEY",
    activeMonth: "August 2026",
    enrollments: [
      {
        batchId: "batch-km-2026-theory",
        instructorId: "ins-kasun-maths",
        paymentStatus: "Overdue",
        paidDate: null,
        accessExpires: null,
        progress: 30,
        attendanceRate: 65,
        tuteDelivery: null
      }
    ]
  },
  {
    id: "std-8824",
    indexNumber: "LYN-25-8824",
    name: "Thisara Gunasekara",
    email: "thisara.g@outlook.com",
    phone: "+94 70 998 8776",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    batch: "2025 A/L ICT & Maths",
    nic: "200422119988",
    district: "Kurunegala",
    address: "Kandy Road, Kurunegala",
    qrToken: "QR-LYN-STD-8824-SECURE-KEY",
    activeMonth: "August 2026",
    enrollments: [
      {
        batchId: "batch-km-2025-theory",
        instructorId: "ins-kasun-maths",
        paymentStatus: "Paid",
        paidDate: "2026-08-01",
        accessExpires: "2026-08-31",
        progress: 96,
        attendanceRate: 98,
        tuteDelivery: {
          status: "Delivered",
          trackingNumber: "PRX-901124",
          courier: "PromptX Express",
          packTitle: "August Tute Pack + Past Paper Pack",
          deliveredDate: "Aug 05, 2026"
        }
      }
    ]
  }
];

export const INITIAL_BANK_SLIPS = [
  {
    id: "slip-901",
    studentId: "std-8821",
    studentName: "Nimesh Fernando",
    studentIndex: "LYN-25-8821",
    studentPhone: "+94 77 123 4567",
    instructorId: "ins-dilshan-ict",
    batchId: "batch-dw-2025-ict",
    batchTitle: "2025 A/L ICT — Theory & Database",
    amount: 3200,
    depositDate: "2026-08-11",
    uploadedAt: "2026-08-11 14:32",
    bank: "Sampath Bank - Super Branch",
    referenceNo: "SAM-8890214",
    slipImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    remarks: "August Month ICT Class Fee Slip Uploaded via Mobile App."
  },
  {
    id: "slip-902",
    studentId: "std-8822",
    studentName: "Kavindi Bandara",
    studentIndex: "LYN-25-8822",
    studentPhone: "+94 71 889 9123",
    instructorId: "ins-amila-chemistry",
    batchId: "batch-ap-2025-chem",
    batchTitle: "2025 A/L Chemistry — Organic Synthesis",
    amount: 3500,
    depositDate: "2026-08-11",
    uploadedAt: "2026-08-11 16:15",
    bank: "Hatton National Bank - Kandy",
    referenceNo: "HNB-4402199",
    slipImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    remarks: "Transfer receipt attached from HNB Online Banking."
  },
  {
    id: "slip-903",
    studentId: "std-8823",
    studentName: "Sachintha Perera",
    studentIndex: "LYN-26-8823",
    studentPhone: "+94 76 554 4321",
    instructorId: "ins-kasun-maths",
    batchId: "batch-km-2026-theory",
    amount: 3500,
    depositDate: "2026-08-10",
    uploadedAt: "2026-08-10 19:40",
    bank: "Commercial Bank - Gampaha",
    referenceNo: "COMB-1100234",
    slipImage: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    remarks: "Deposit slip deposited at CDM Cash Machine."
  }
];

export const INITIAL_ATTENDANCE_LOGS = [
  {
    id: "att-001",
    studentId: "std-8821",
    studentName: "Nimesh Fernando",
    studentIndex: "LYN-25-8821",
    batchId: "batch-km-2025-theory",
    batchCode: "KM-2025-TH",
    timestamp: "2026-08-10 07:22:15",
    type: "Hall Scanner",
    status: "Present - On Time",
    feeStatus: "Paid"
  },
  {
    id: "att-002",
    studentId: "std-8824",
    studentName: "Thisara Gunasekara",
    studentIndex: "LYN-25-8824",
    batchId: "batch-km-2025-theory",
    batchCode: "KM-2025-TH",
    timestamp: "2026-08-10 07:28:40",
    type: "Hall Scanner",
    status: "Present - On Time",
    feeStatus: "Paid"
  },
  {
    id: "att-003",
    studentId: "std-8822",
    studentName: "Kavindi Bandara",
    studentIndex: "LYN-25-8822",
    batchId: "batch-km-2025-theory",
    batchCode: "KM-2025-TH",
    timestamp: "2026-08-10 07:45:10",
    type: "Online Stream",
    status: "Present - Late (15m)",
    feeStatus: "Paid"
  }
];

export const INITIAL_QUIZZES = [
  {
    id: "quiz-km-integration",
    title: "Integration Speed Challenge & ILATE Technique (අනුකලනය)",
    subject: "Combined Mathematics",
    instructorId: "9e1c0212-6aa5-444e-aa37-f295e79f6e98",
    batchId: "batch-kasunmaths-2026-theory",
    durationMinutes: 15,
    totalMarks: 50,
    hasRequiredSubmitTime: true,
    submitRequiredTime: 5,
    questions: [
      {
        id: "q1",
        question: "∫ x · e^(2x) dx අනුකලනයේ ප්‍රතිඵලය කුමක්ද?",
        options: [
          "(1/2) x e^(2x) - (1/4) e^(2x) + C",
          "(1/4) x e^(2x) - (1/2) e^(2x) + C",
          "2x e^(2x) - 4 e^(2x) + C",
          "x^2 e^(2x) + C"
        ],
        correctIndex: 0,
        explanation: "කොටස් වශයෙන් අනුකලනය (Integration by parts) භාවිතයෙන්: ∫ u v' = u v - ∫ u' v. මෙහි u = x සහ v' = e^(2x) විට v = (1/2)e^(2x). එවිට (1/2)xe^(2x) - ∫(1/2)e^(2x)dx = (1/2)xe^(2x) - (1/4)e^(2x) + C."
      },
      {
        id: "q2",
        question: "∫ [1 / (1 + x²)] dx හි සීමිත අනුකලනය 0 සිට 1 දක්වා අගය කොපමණද?",
        options: [
          "π / 2",
          "π / 4",
          "1",
          "π"
        ],
        correctIndex: 1,
        explanation: "∫ 1/(1+x²) dx = tan⁻¹(x). සීමා ආදේශ කළ විට: tan⁻¹(1) - tan⁻¹(0) = π/4 - 0 = π/4."
      },
      {
        id: "q3",
        question: "∫ sin³(x) cos(x) dx හි අනුකලන අගය වන්නේ:",
        options: [
          "(1/4) sin⁴(x) + C",
          "(1/3) cos³(x) + C",
          "- (1/4) cos⁴(x) + C",
          "(1/2) sin²(x) + C"
        ],
        correctIndex: 0,
        explanation: "ආදේශය u = sin(x) නම් du = cos(x)dx වේ. එවිට ∫ u³ du = (1/4)u⁴ + C = (1/4)sin⁴(x) + C."
      }
    ]
  },
  {
    id: "quiz-dw-python",
    title: "Python OOP & Data Structures Quiz",
    subject: "A/L ICT",
    batchId: "batch-dw-2025-ict",
    durationMinutes: 10,
    totalMarks: 30,
    questions: [
      {
        id: "pq1",
        question: "In Python, which keyword is used inside a class method to reference the current instance?",
        options: ["this", "self", "instance", "cls"],
        correctIndex: 1,
        explanation: "'self' is the standard Python convention used as the first parameter of instance methods to reference the current object."
      },
      {
        id: "pq2",
        question: "What is the time complexity of searching for a key in a Python dictionary on average?",
        options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
        correctIndex: 2,
        explanation: "Python dictionaries are implemented using Hash Tables, offering average O(1) constant time lookup."
      }
    ]
  }
];

export const SAAS_PRICING_PLANS = [
  {
    id: "plan-starter",
    name: "Starter Master",
    badge: "For Individual Tutors",
    priceLKR: "4,500",
    billingCycle: "/ month",
    popular: false,
    color: "slate",
    features: [
      "Up to 250 Active Students",
      "Unlimited Live Classes (Zoom integration)",
      "Automated Bank Slip Approval Queue",
      "Dynamic Digital ID Card with QR",
      "100 GB Cloud Video Storage",
      "Automated SMS & WhatsApp Alerts",
      "Standard Web Audio Scanner"
    ]
  },
  {
    id: "plan-pro",
    name: "Pro Master Suite",
    badge: "Most Popular for Top Sirs",
    priceLKR: "9,800",
    billingCycle: "/ month",
    popular: true,
    color: "indigo",
    features: [
      "Up to 1,500 Active Students",
      "Anti-Piracy Moving Watermark Player (Anti-Screen Record)",
      "High-Speed Laser QR Attendance Terminal",
      "Online Card Payment Gateway + Instant Slip Approvals",
      "500 GB Encrypted Video CDN Storage",
      "Batch MCQ Quiz & Timed Leaderboard",
      "Custom Subdomain (e.g. kasunmaths.lyntrix.learn)",
      "Priority 24/7 Dedicated Server Support"
    ]
  },
  {
    id: "plan-academy",
    name: "Elite Academy & Institute",
    badge: "For Multi-Teacher Institutes",
    priceLKR: "19,500",
    billingCycle: "/ month",
    popular: false,
    color: "emerald",
    features: [
      "Unlimited Students & Multi-Teacher Staff",
      "Complete White-Label Custom Domain (e.g. rotaryhall.lk)",
      "Multi-Hall Barcode & RFID Gate Integration",
      "2 TB High-Speed Video Streaming CDN",
      "Multi-Branch & Cash Counter POS System",
      "Dedicated Database & SLA 99.99% Uptime",
      "Full API & Mobile App Access"
    ]
  }
];

export const PLATFORM_METRICS = {
  totalRevenueLKR: "4,820,500",
  monthlyRecurringRevenueLKR: "860,000",
  activeTeachers: 84,
  totalStudents: 42800,
  storageUsedTB: "14.2 TB",
  serverUptime: "99.98%",
  activeLiveStreams: 18,
  pendingSlipApprovalsTotal: 142
};
