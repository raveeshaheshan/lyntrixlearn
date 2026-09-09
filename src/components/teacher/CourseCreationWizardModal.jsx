import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileText, 
  Video, 
  HelpCircle, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  GripVertical
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { R2FileUploader } from '../common/R2FileUploader';

export const CourseCreationWizardModal = ({ isOpen, onClose }) => {
  const { currentTeacher, setInstructors, showToast } = useApp();

  const [step, setStep] = useState(1); // 1: Basic Info, 2: Curriculum Builder, 3: Pricing & Access

  // Step 1 Form
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    category: currentTeacher?.subject || 'Combined Mathematics',
    gradeYear: '2026 A/L',
    medium: 'Sinhala Medium',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
  });

  // Step 2 Modules & Lessons Form
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Module 01: Core Fundamentals & Theory',
      lessons: [
        { id: 'les-1', title: 'Lesson 01: Introduction & Formulas', duration: '2h 30m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', notesPdf: 'Module_01_Notes.pdf' }
      ]
    }
  ]);

  // Step 3 Pricing Form
  const [pricing, setPricing] = useState({
    pricingType: 'paid', // 'paid' | 'free'
    monthlyFee: currentTeacher?.monthlyFee || 3500,
    allowTrial: true
  });

  if (!isOpen) return null;

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      {
        id: `mod-${prev.length + 1}`,
        title: `Module 0${prev.length + 1}: Advanced Practice & Papers`,
        lessons: [
          { id: `les-${Date.now()}`, title: 'Lesson 01: Unit Problems', duration: '2h 00m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', notesPdf: 'Unit_Practice.pdf' }
        ]
      }
    ]);
    sound.playClick();
  };

  const handleAddLesson = (moduleIndex) => {
    setModules(prev => {
      const updated = [...prev];
      const mod = updated[moduleIndex];
      mod.lessons.push({
        id: `les-${Date.now()}`,
        title: `Lesson 0${mod.lessons.length + 1}: Past Paper Essay Analysis`,
        duration: '2h 15m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        notesPdf: 'Essay_Dissection.pdf'
      });
      return [...updated];
    });
    sound.playClick();
  };

  const handleRemoveModule = (moduleIndex) => {
    setModules(prev => prev.filter((_, idx) => idx !== moduleIndex));
  };

  const handleFinishWizard = (e) => {
    e.preventDefault();
    if (!basicInfo.title) {
      showToast('Please enter a course title in Step 1.', 'error');
      setStep(1);
      return;
    }

    const newBatch = {
      id: `batch-${currentTeacher.id}-${Date.now()}`,
      code: `${basicInfo.category.slice(0, 3).toUpperCase()}-2026-TH`,
      title: basicInfo.title,
      grade: basicInfo.gradeYear,
      gradeYear: basicInfo.gradeYear.replace(/[^0-9]/g, '') || '2026',
      medium: basicInfo.medium,
      schedule: 'Every Sunday 8:00 AM - 1:30 PM',
      status: 'Active',
      monthlyFee: pricing.pricingType === 'free' ? 0 : Number(pricing.monthlyFee),
      enrolledCount: 0,
      recordingCount: modules.reduce((acc, m) => acc + m.lessons.length, 0),
      description: basicInfo.description,
      modules
    };

    setInstructors(prev => prev.map(ins => {
      if (ins.id === currentTeacher.id) {
        return {
          ...ins,
          batches: [newBatch, ...ins.batches]
        };
      }
      return ins;
    }));

    sound.playChimeApproved();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    showToast(`New Course Batch "${basicInfo.title}" Published Successfully!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto relative">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Course Creation Wizard</h3>
              <p className="text-xs text-slate-500">Design & Publish New Curriculum Batch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setStep(1)}
            className={`py-2 rounded-xl font-bold transition ${step === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            1. Basic Information
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 rounded-xl font-bold transition ${step === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            2. Curriculum Builder
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 rounded-xl font-bold transition ${step === 3 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
          >
            3. Pricing & Access
          </button>
        </div>

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="wizard-course-title" className="block text-xs font-bold text-slate-700 mb-1">Course Batch Title:</label>
              <input
                id="wizard-course-title"
                name="courseTitle"
                type="text"
                required
                placeholder="e.g. 2026 A/L Combined Maths — Integral Calculus & Revision"
                value={basicInfo.title}
                onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="wizard-subject-category" className="block text-xs font-bold text-slate-700 mb-1">Subject Category:</label>
                <input
                  id="wizard-subject-category"
                  name="subjectCategory"
                  type="text"
                  value={basicInfo.category}
                  onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="wizard-target-batch" className="block text-xs font-bold text-slate-700 mb-1">Target Batch Year:</label>
                <select
                  id="wizard-target-batch"
                  name="targetBatchYear"
                  value={basicInfo.gradeYear}
                  onChange={(e) => setBasicInfo({ ...basicInfo, gradeYear: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="2025 A/L">2025 A/L (Theory / Revision)</option>
                  <option value="2026 A/L">2026 A/L (Theory)</option>
                  <option value="2027 A/L">2027 A/L (New Batch)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="wizard-course-description" className="block text-xs font-bold text-slate-700 mb-1">Course Overview & Description:</label>
              <textarea
                id="wizard-course-description"
                name="courseDescription"
                rows={3}
                placeholder="Comprehensive unit coverage, past paper dissections, and monthly tutes..."
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <R2FileUploader
                folder="thumbnails"
                accept="image/*"
                label="Course Thumbnail Cover (Cloudflare R2)"
                helperText="Upload custom course banner or cover image"
                isImage={true}
                currentUrl={basicInfo.thumbnail}
                onUploadSuccess={(res) => {
                  if (res.url) {
                    setBasicInfo((prev) => ({ ...prev, thumbnail: res.url }));
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Continue to Curriculum Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CURRICULUM BUILDER */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">Modules & Video Lesson Slots ({modules.length}):</h4>
              <button
                onClick={handleAddModule}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => {
                          const updated = [...modules];
                          updated[mIdx].title = e.target.value;
                          setModules(updated);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold flex-1"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveModule(mIdx)}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs transition"
                      title="Remove Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lessons list under this module */}
                  <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                    {mod.lessons.map((les, lIdx) => (
                      <div key={les.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Video className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-medium text-slate-900 truncate">{les.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{les.duration}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {les.notesPdf}
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddLesson(mIdx)}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Video Lecture to this Module</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Continue to Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING & ACCESS */}
        {step === 3 && (
          <form onSubmit={handleFinishWizard} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Access & Pricing Tier:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPricing({ ...pricing, pricingType: 'paid' })}
                  className={`p-4 rounded-2xl border text-left transition ${
                    pricing.pricingType === 'paid'
                      ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">Paid Monthly Tuition</div>
                  <div className="text-xs text-slate-500 mt-1">Requires monthly bank slip or instant card payment.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPricing({ ...pricing, pricingType: 'free' })}
                  className={`p-4 rounded-2xl border text-left transition ${
                    pricing.pricingType === 'free'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">Free Open Batch</div>
                  <div className="text-xs text-slate-500 mt-1">Accessible by all registered students instantly.</div>
                </button>
              </div>
            </div>

            {pricing.pricingType === 'paid' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Tuition Fee (LKR):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={pricing.monthlyFee}
                    onChange={(e) => setPricing({ ...pricing, monthlyFee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                    required
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Batch to Portal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
