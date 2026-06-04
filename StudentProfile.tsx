import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Facebook,
  Globe,
  Code,
  BookOpen,

  GraduationCap,
  FileText,

} from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading } = trpc.student.getById.useQuery({
    id: Number(id),
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#161930] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#161930] flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">Student not found</p>
          <Link to="/directory" className="text-cyan-400 text-sm mt-2 inline-block hover:underline">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const skills = JSON.parse(student.skills || "[]");
  const progLangs = JSON.parse(student.programmingLanguages || "[]");

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#161930]">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#1e2040] to-[#161930] overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/hero-campus.jpg')] bg-cover bg-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161930] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Back Button */}
        <Link
          to="/directory"
          className="inline-flex items-center gap-1 text-white/50 text-sm hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        {/* Profile Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-glow">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={
                  student.profilePicture ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullName}`
                }
                alt={student.fullName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-cyan-400/20"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {student.fullName}
                  </h1>
                  <p className="text-cyan-400 text-sm font-mono mt-1">
                    {student.studentId} &middot; Roll: {student.rollNumber}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-cyan-400/10 text-cyan-400 text-xs font-medium border border-cyan-400/20 flex-shrink-0">
                  {student.department} &middot; {student.session}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/50">
                {student.email && (
                  <a href={`mailto:${student.email}`} className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {student.email}
                  </a>
                )}
                {student.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {student.phoneNumber}
                  </span>
                )}
                {student.district && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {student.district}
                    {student.upazila && `, ${student.upazila}`}
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-4">
                {student.facebookUrl && (
                  <a href={student.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {student.linkedinUrl && (
                  <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {student.githubUrl && (
                  <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {student.portfolioUrl && (
                  <a href={student.portfolioUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Info */}
            <div className="glass rounded-2xl p-6 border-glow">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Department" value={student.department} />
                <InfoItem label="Batch" value={student.batch} />
                <InfoItem label="Session" value={student.session} />
                <InfoItem label="Roll Number" value={student.rollNumber} />
                <InfoItem label="Registration" value={student.registrationNumber} />
                <InfoItem label="Student ID" value={student.studentId} />
                {student.bloodGroup && (
                  <InfoItem label="Blood Group" value={student.bloodGroup} />
                )}
                {student.gender && (
                  <InfoItem label="Gender" value={student.gender} />
                )}
              </div>
            </div>

            {/* Address */}
            {(student.presentAddress || student.permanentAddress) && (
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Address
                </h3>
                <div className="space-y-3">
                  {student.presentAddress && (
                    <div>
                      <span className="text-white/40 text-xs">Present Address</span>
                      <p className="text-white/80 text-sm">{student.presentAddress}</p>
                    </div>
                  )}
                  {student.permanentAddress && (
                    <div>
                      <span className="text-white/40 text-xs">Permanent Address</span>
                      <p className="text-white/80 text-sm">{student.permanentAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <Code className="w-4 h-4 text-cyan-400" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 text-xs border border-cyan-400/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Programming Languages */}
            {progLangs.length > 0 && (
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-pink-400" />
                  Programming Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {progLangs.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-3 py-1.5 rounded-lg bg-pink-400/10 text-pink-400 text-xs border border-pink-400/20"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 border-glow">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {student.email && (
                  <a
                    href={`mailto:${student.email}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-cyan-400/10 hover:text-cyan-400 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </a>
                )}
                {student.resumeUrl && (
                  <a
                    href={student.resumeUrl}
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-cyan-400/10 hover:text-cyan-400 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-white/40 text-xs">{label}</span>
      <p className="text-white/80 text-sm font-medium">{value}</p>
    </div>
  );
}
