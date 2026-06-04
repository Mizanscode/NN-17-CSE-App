import { getDb } from "../api/queries/connection";
import {
  users,
  students,
  notices,
  events,
  galleryAlbums,
  galleryItems,
  resources,
  techNews,
  alumni,
  communityPosts,
  eventRegistrations,
} from "./schema";
import bcrypt from "bcryptjs";

const db = getDb();

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(eventRegistrations);
  await db.delete(communityPosts);
  await db.delete(galleryItems);
  await db.delete(galleryAlbums);
  await db.delete(resources);
  await db.delete(techNews);
  await db.delete(alumni);
  await db.delete(events);
  await db.delete(notices);
  await db.delete(students);
  await db.delete(users);
  console.log("Existing data cleared.");

  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const modPassword = await bcrypt.hash("mod123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  const adminRes = await db.insert(users).values({
    email: "admin@nexul17.jnu.ac.bd",
    name: "Admin User",
    role: "admin",
    passwordHash: adminPassword,
    unionId: "admin_local",
  });
  const adminId = Number((adminRes as any).insertId);

  const modRes = await db.insert(users).values({
    email: "moderator@nexul17.jnu.ac.bd",
    name: "Moderator User",
    role: "moderator",
    passwordHash: modPassword,
    unionId: "mod_local",
  });
  const modId = Number((modRes as any).insertId);

  const studentNames = [
    "Rafiqul Islam", "Farhana Akter", "Nayeem Hossain", "Tasnim Jahan",
    "Shahidul Alam", "Maliha Rahman", "Tanvir Ahmed", "Sabina Yasmin",
    "Imran Hossain", "Nusrat Jahan", "Kamal Uddin", "Rina Akter",
    "Jamil Hasan", "Parveen Sultana", "Sohel Rana",
  ];
  const districts = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Faridpur", "Tangail", "Jamalpur", "Pabna", "Dinajpur", "Noakhali"];
  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
  const skillsArr = [
    '["JavaScript","React","Node.js"]',
    '["Python","Django","Machine Learning"]',
    '["Java","Spring Boot","Android"]',
    '["C++","Data Structures","Algorithms"]',
    '["HTML","CSS","Bootstrap"]',
    '["PHP","Laravel","MySQL"]',
    '["React","TypeScript","Tailwind"]',
    '["Python","TensorFlow","Deep Learning"]',
    '["Go","Docker","Kubernetes"]',
    '["Rust","Systems Programming"]',
    '["Swift","iOS Development"]',
    '["Kotlin","Android","Firebase"]',
    '["JavaScript","Vue.js","Nuxt"]',
    '["C#",".NET","Azure"]',
    '["Ruby","Rails","PostgreSQL"]',
  ];
  const progLangs = [
    '["JavaScript","Python","C++"]',
    '["Java","Kotlin","SQL"]',
    '["Python","R","MATLAB"]',
    '["C","C++","Assembly"]',
    '["HTML","CSS","JavaScript"]',
    '["PHP","JavaScript","SQL"]',
    '["TypeScript","Python","Go"]',
    '["Python","Julia","C++"]',
    '["Go","Rust","C"]',
    '["Rust","C++","Python"]',
    '["Swift","Objective-C"]',
    '["Kotlin","Java","Dart"]',
    '["JavaScript","TypeScript","Python"]',
    '["C#","Python","JavaScript"]',
    '["Ruby","JavaScript","Python"]',
  ];

  const studentUserIds: number[] = [];
  for (let i = 0; i < studentNames.length; i++) {
    const res = await db.insert(users).values({
      email: `student${i + 1}@nexul17.jnu.ac.bd`,
      name: studentNames[i],
      role: "student",
      passwordHash: studentPassword,
      unionId: `student_${i + 1}_local`,
    });
    studentUserIds.push(Number((res as any).insertId));
  }

  for (let i = 0; i < 15; i++) {
    await db.insert(students).values({
      userId: studentUserIds[i],
      studentId: `N17-${String(i + 1).padStart(3, "0")}`,
      rollNumber: `${2001028 + i}`,
      registrationNumber: `${20228430000 + i}`,
      fullName: studentNames[i],
      batch: "Neural Nexul-17",
      session: "2022-23",
      department: "CSE",
      bloodGroup: bloodGroups[i % bloodGroups.length],
      gender: i % 2 === 0 ? "Male" : "Female",
      district: districts[i % districts.length],
      upazila: `${districts[i % districts.length]} Sadar`,
      presentAddress: `House ${i + 1}, Road ${i + 5}, ${districts[i % districts.length]}`,
      permanentAddress: `Village ${i + 1}, Post Office ${districts[i % districts.length]}`,
      email: `student${i + 1}@nexul17.jnu.ac.bd`,
      phoneNumber: `017${10000000 + i * 123456}`,
      facebookUrl: `https://facebook.com/student${i + 1}`,
      linkedinUrl: `https://linkedin.com/in/student${i + 1}`,
      githubUrl: `https://github.com/student${i + 1}`,
      skills: skillsArr[i],
      programmingLanguages: progLangs[i],
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentNames[i].replace(/\s/g, "")}`,
      isPublic: 1,
    });
  }

  const noticeData = [
    { title: "Final Exam Schedule - Spring 2025", content: "The final examination for the Spring 2025 semester will begin on June 15, 2025. All students must collect their admit cards from the departmental office by June 10.", category: "exam" as const, authorId: adminId, isPinned: 1 },
    { title: "Workshop on Machine Learning - Registration Open", content: "A 3-day intensive workshop on Machine Learning and Deep Learning will be held from June 20-22, 2025.", category: "seminar" as const, authorId: modId, isPinned: 1 },
    { title: "Departmental Programming Contest - CodeNexul 2025", content: "The annual programming contest 'CodeNexul 2025' is scheduled for July 5, 2025.", category: "department" as const, authorId: adminId, isPinned: 0 },
    { title: "Class Cancellation - June 8, 2025", content: "All classes for June 8, 2025, are cancelled due to the university's annual sports day.", category: "class" as const, authorId: modId, isPinned: 0 },
    { title: "Assignment Submission - Database Design Project", content: "The Database Design Project assignment is due on June 12, 2025.", category: "assignment" as const, authorId: adminId, isPinned: 0 },
  ];
  for (const n of noticeData) await db.insert(notices).values(n);

  const eventData = [
    { title: "AI & Deep Learning Workshop", description: "A comprehensive 3-day workshop covering the fundamentals and advanced concepts of Artificial Intelligence and Deep Learning.", eventType: "workshop" as const, startDate: "2025-06-20T09:00:00Z", endDate: "2025-06-22T17:00:00Z", location: "CSE Seminar Room, Jagannath University", maxAttendees: 60, createdBy: adminId },
    { title: "Cybersecurity & Ethical Hacking Seminar", description: "Learn about modern cybersecurity threats, penetration testing, and ethical hacking techniques.", eventType: "seminar" as const, startDate: "2025-06-25T14:00:00Z", endDate: "2025-06-25T17:00:00Z", location: "Main Auditorium, Jagannath University", maxAttendees: 150, createdBy: modId },
    { title: "CodeNexul 2025 - Programming Contest", description: "The flagship programming contest of Neural Nexul-17. Compete with the best coders and win exciting prizes.", eventType: "contest" as const, startDate: "2025-07-05T10:00:00Z", endDate: "2025-07-05T16:00:00Z", location: "Computer Lab 3, CSE Building", maxAttendees: 100, createdBy: adminId },
    { title: "Hackathon: Build for Bangladesh", description: "A 24-hour hackathon focused on building solutions for real-world problems in Bangladesh.", eventType: "hackathon" as const, startDate: "2025-07-15T09:00:00Z", endDate: "2025-07-16T09:00:00Z", location: "CSE Building, Jagannath University", maxAttendees: 80, createdBy: adminId },
    { title: "Annual Department Day Celebration", description: "A day-long celebration of the CSE department featuring cultural programs, award ceremonies, and networking sessions.", eventType: "department_program" as const, startDate: "2025-08-01T10:00:00Z", endDate: "2025-08-01T20:00:00Z", location: "University Playground & Auditorium", maxAttendees: 500, createdBy: adminId },
  ];
  for (const e of eventData) await db.insert(events).values(e);

  const albumRes1 = await db.insert(galleryAlbums).values({ title: "Freshers Reception 2022", description: "Welcome event for new students", createdBy: adminId });
  const albumRes2 = await db.insert(galleryAlbums).values({ title: "Study Tour 2023", description: "Educational tour to technology companies", createdBy: modId });
  const albumRes3 = await db.insert(galleryAlbums).values({ title: "CodeNexul 2024", description: "Annual programming contest highlights", createdBy: adminId });
  const albumIds = [Number((albumRes1 as any).insertId), Number((albumRes2 as any).insertId), Number((albumRes3 as any).insertId)];

  const galleryData = [
    { title: "Welcome Speech", category: "batch_events" as const, albumId: albumIds[0], uploadedBy: adminId },
    { title: "Group Photo", category: "batch_events" as const, albumId: albumIds[0], uploadedBy: modId },
    { title: "Cultural Performance", category: "batch_events" as const, albumId: albumIds[0], uploadedBy: adminId },
    { title: "At Google Office", category: "study_tours" as const, albumId: albumIds[1], uploadedBy: modId },
    { title: "Team Discussion", category: "study_tours" as const, albumId: albumIds[1], uploadedBy: adminId },
    { title: "Contest Kickoff", category: "memories" as const, albumId: albumIds[2], uploadedBy: adminId },
    { title: "Award Ceremony", category: "memories" as const, albumId: albumIds[2], uploadedBy: modId },
    { title: "Winners Celebration", category: "memories" as const, albumId: albumIds[2], uploadedBy: adminId },
    { title: "Campus Morning", category: "university_programs" as const, albumId: null, uploadedBy: adminId },
    { title: "Lab Session", category: "workshops" as const, albumId: null, uploadedBy: modId },
  ];
  for (const g of galleryData) {
    await db.insert(galleryItems).values({
      ...g,
      imageUrl: `https://picsum.photos/seed/${g.title.replace(/\s/g, "")}/800/600`,
      description: `Photo from ${g.title}`,
      likes: Math.floor(Math.random() * 50) + 5,
    });
  }

  const resourceData = [
    { title: "Data Structures & Algorithms Notes", description: "Comprehensive notes for DSA course", category: "pdf_notes" as const, fileUrl: "/uploads/resources/dsa_notes.pdf", fileType: "pdf", uploadedBy: adminId },
    { title: "Database Systems Lecture Slides", description: "Complete lecture slides for DB course", category: "lecture_slides" as const, fileUrl: "/uploads/resources/db_slides.ppt", fileType: "ppt", uploadedBy: modId },
    { title: "Spring 2024 Previous Questions", description: "Previous year exam questions", category: "previous_questions" as const, fileUrl: "/uploads/resources/prev_questions.pdf", fileType: "pdf", uploadedBy: adminId },
    { title: "Introduction to Python Programming", description: "Python programming book", category: "programming_books" as const, fileUrl: "/uploads/resources/python_book.pdf", fileType: "pdf", uploadedBy: adminId },
    { title: "Computer Networks Lab Reports", description: "Lab report templates and examples", category: "lab_reports" as const, fileUrl: "/uploads/resources/cn_labs.doc", fileType: "doc", uploadedBy: modId },
    { title: "Software Engineering Course Material", description: "SE course materials", category: "course_materials" as const, fileUrl: "/uploads/resources/se_materials.pdf", fileType: "pdf", uploadedBy: adminId },
    { title: "Operating Systems Assignment Set", description: "OS assignments with solutions", category: "assignments" as const, fileUrl: "/uploads/resources/os_assignments.pdf", fileType: "pdf", uploadedBy: modId },
    { title: "AI Research Paper Collection", description: "Collection of AI research papers", category: "research_papers" as const, fileUrl: "/uploads/resources/ai_papers.pdf", fileType: "pdf", uploadedBy: adminId },
  ];
  for (const r of resourceData) {
    await db.insert(resources).values({ ...r, downloads: Math.floor(Math.random() * 200) + 10 });
  }

  const newsData = [
    { title: "OpenAI Releases GPT-5 with Multimodal Capabilities", summary: "The latest iteration of GPT introduces revolutionary multimodal understanding.", content: "Full article content about GPT-5...", category: "ai" as const, sourceUrl: "https://openai.com/blog", createdBy: adminId },
    { title: "Google's New Quantum Chip Achieves Breakthrough", summary: "Google's latest quantum processor has demonstrated error correction at scale.", content: "Full article content...", category: "programming" as const, sourceUrl: "https://blog.google", createdBy: modId },
    { title: "Bangladesh Tech Startup Ecosystem Hits $1B Valuation", summary: "The local startup ecosystem has crossed a major milestone.", content: "Full article...", category: "startups" as const, sourceUrl: "https://techcrunch.com", createdBy: adminId },
    { title: "New Cybersecurity Threat Targets IoT Devices", summary: "Security researchers have discovered a sophisticated malware strain.", content: "Full article...", category: "cyber_security" as const, sourceUrl: "https://security.googleblog.com", createdBy: modId },
    { title: "Cloud Computing Trends for 2025", summary: "Edge computing, serverless architectures, and AI-powered cloud services.", content: "Full article...", category: "cloud_computing" as const, sourceUrl: "https://aws.amazon.com/blogs", createdBy: adminId },
  ];
  for (const n of newsData) {
    await db.insert(techNews).values({ ...n, views: Math.floor(Math.random() * 1000) + 100 });
  }

  const alumniData = [
    { fullName: "Dr. Abdullah Al Mamun", graduationYear: "2018", currentCompany: "Google", jobPosition: "Senior Software Engineer", industry: "Technology", bio: "Dr. Mamun is a Senior Software Engineer at Google with expertise in distributed systems." },
    { fullName: "Nasrin Sultana", graduationYear: "2019", currentCompany: "Microsoft", jobPosition: "Data Scientist", industry: "Technology", bio: "Nasrin works as a Data Scientist at Microsoft, specializing in NLP and computer vision." },
    { fullName: "Kamal Hossain", graduationYear: "2017", currentCompany: "bKash", jobPosition: "Tech Lead", industry: "Fintech", bio: "Kamal leads the engineering team at bKash, building mobile payment solutions." },
    { fullName: "Rumana Akter", graduationYear: "2020", currentCompany: "Pathao", jobPosition: "Product Manager", industry: "Technology", bio: "Rumana manages product development at Pathao, one of Bangladesh's top ride-sharing apps." },
    { fullName: "Tariqul Islam", graduationYear: "2016", currentCompany: "Grameenphone", jobPosition: "Network Architect", industry: "Telecom", bio: "Tariqul designs network infrastructure at Grameenphone, Bangladesh's largest telecom." },
  ];
  for (const a of alumniData) {
    await db.insert(alumni).values({
      ...a,
      email: `${a.fullName.toLowerCase().replace(/\s/g, ".")}@email.com`,
      linkedinUrl: `https://linkedin.com/in/${a.fullName.toLowerCase().replace(/\s/g, "-")}`,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.fullName.replace(/\s/g, "")}`,
    });
  }

  const postData = [
    { title: "Welcome to Neural Nexul-17 Community!", content: "This is our official community space. Feel free to discuss anything related to academics, career, or just hang out!", category: "general" as const, authorId: adminId },
    { title: "Study Group for Algorithms - Join Now", content: "Starting a study group for Advanced Algorithms. We meet every Tuesday and Thursday at 4 PM.", category: "academic" as const, authorId: studentUserIds[0] },
    { title: "Internship Opportunity at Brain Station 23", content: "Brain Station 23 is hiring software engineering interns. Apply by June 15.", category: "career" as const, authorId: modId },
    { title: "Best Resources for Learning React", content: "I've compiled a list of the best free resources for learning React.", category: "technical" as const, authorId: studentUserIds[1] },
    { title: "Batch Meetup This Friday!", content: "Let's have an informal meetup this Friday at TSC. Pizza and drinks on us!", category: "social" as const, authorId: studentUserIds[2] },
  ];
  for (const p of postData) {
    await db.insert(communityPosts).values({ ...p, likes: Math.floor(Math.random() * 30) + 5, views: Math.floor(Math.random() * 200) + 50 });
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
