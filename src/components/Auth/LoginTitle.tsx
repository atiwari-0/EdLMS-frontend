import { School } from 'lucide-react';
export default function LoginTitle() {
  return (
    <div className="flex items-center justify-center mb-6 space-x-3">
      <School className=" w-10 h-10 flex items-center justify-center font-bold text-lg">
        E
      </School>

      <p className="text-xl font-semibold text-gray-800">
        <span className="text-blue-600">EdLMS</span> — Learning Platform for Students
      </p>
    </div>
  );
}
