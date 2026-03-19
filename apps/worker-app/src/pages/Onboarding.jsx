import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    platform: '',
    city: '',
    vehicleType: '',
    licenseNumber: ''
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      alert('Please fill all fields');
      return;
    }
    if (step === 2 && (!formData.platform || !formData.city)) {
      alert('Please fill all fields');
      return;
    }
    if (step === 3 && (!formData.vehicleType || !formData.licenseNumber)) {
      alert('Please fill all fields');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      navigate('/otp');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-white text-center text-sm">Step {step} of 3</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && 'Welcome to QuickClaim'}
            {step === 2 && 'Work Details'}
            {step === 3 && 'Vehicle Information'}
          </h1>
          <p className="text-gray-300 mb-8">
            {step === 1 && 'Let\'s get you started'}
            {step === 2 && 'Tell us about your work'}
            {step === 3 && 'Almost done!'}
          </p>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  maxLength={10}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          )}

          {/* Step 2: Work Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" className="bg-gray-800">Select Platform</option>
                  <option value="swiggy" className="bg-gray-800">Swiggy</option>
                  <option value="zomato" className="bg-gray-800">Zomato</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your city"
                />
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleChange('vehicleType', e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" className="bg-gray-800">Select Vehicle</option>
                  <option value="bike" className="bg-gray-800">Bike</option>
                  <option value="scooter" className="bg-gray-800">Scooter</option>
                  <option value="cycle" className="bg-gray-800">Cycle</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Driving License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter license number"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 p-4 rounded-xl bg-white/10 text-white font-semibold border border-white/30"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 p-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              {step === 3 ? 'Continue' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
