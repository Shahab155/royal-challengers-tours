'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import {
  MdCalendarToday,
  MdPersonAdd,
  MdPersonRemove,
  MdPeople,
} from 'react-icons/md';
import 'react-day-picker/dist/style.css'; // Important: import the styles

export default function BookingSidebar({ tour, availability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get date range from database (availability)
  const minDate = availability?.range?.start_date
    ? new Date(availability.range.start_date)
    : new Date();

  const maxDate = availability?.range?.end_date
    ? new Date(availability.range.end_date)
    : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  // Calculate total price (assuming child price is 70% of adult, adjust if needed)
  const childPrice = tour.child_price || Math.round(tour.price * 0.7);
  const totalPrice = tour.price * adults + childPrice * children;

  const handleBookNow = () => {
    if (!selectedDate) {
      alert('Please select a date first!');
      return;
    }

    const params = new URLSearchParams({
      type: 'tour',
      slug: tour.slug,
      date: format(selectedDate, 'yyyy-MM-dd'),
      adults: adults.toString(),
      children: children.toString(),
    });

    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <aside className="lg:col-span-1">
      <div className="glass-card p-6 lg:p-8 sticky top-8 space-y-7 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Price Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="text-4xl font-bold text-white">
            AED {tour.price?.toLocaleString()}
          </div>
          <p className="text-sm text-gray-300 mt-1">per adult</p>
          <p className="text-xs text-gray-400 mt-2">Best Price Guarantee</p>
        </div>

        {/* Date Picker */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <MdCalendarToday className="w-5 h-5" />
            Select Tour Date
          </label>

          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-left flex items-center justify-between hover:bg-white/15 transition-all"
            >
              <span className={selectedDate ? 'text-white' : 'text-gray-400'}>
                {selectedDate
                  ? format(selectedDate, 'dd MMM yyyy')
                  : 'Choose a date'}
              </span>
              <MdCalendarToday className="w-5 h-5 text-gray-400" />
            </button>

            {showCalendar && (
              <div className="absolute z-50 mt-3 left-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }}
                  disabled={[
                    { before: minDate },
                    { after: maxDate },
                  ]}
                  captionLayout="dropdown"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 2}
                  className="text-white"
                  classNames={{
                    day_selected: 'bg-emerald-600 text-white hover:bg-emerald-500',
                    day_today: 'bg-white/10 font-bold',
                    caption_label: 'text-white font-medium',
                    nav_button: 'text-gray-300 hover:bg-white/10',
                    dropdown: 'bg-gray-800 text-white border-gray-600',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Guests Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <MdPeople className="w-5 h-5" />
            Guests
          </label>

          {/* Adults Counter */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl px-5 py-4 border border-white/15">
            <div>
              <div className="font-medium text-white">Adults</div>
              <div className="text-xs text-gray-400">Age 12+</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                disabled={adults <= 1}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                <MdPersonRemove className="w-5 h-5" />
              </button>
              <span className="w-10 text-center text-lg font-semibold">
                {adults}
              </span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <MdPersonAdd className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Children Counter */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl px-5 py-4 border border-white/15">
            <div>
              <div className="font-medium text-white">Children</div>
              <div className="text-xs text-gray-400">Age 2–11</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                disabled={children <= 0}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                <MdPersonRemove className="w-5 h-5" />
              </button>
              <span className="w-10 text-center text-lg font-semibold">
                {children}
              </span>
              <button
                onClick={() => setChildren(children + 1)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <MdPersonAdd className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Total Price & Book Button */}
        <div className="pt-6 border-t border-white/10 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-200">Total Price</span>
            <span className="text-2xl font-bold text-emerald-400">
              AED {totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleBookNow}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/50 transform hover:-translate-y-1 transition-all duration-200"
          >
            Check Availability & Book
          </button>

          <p className="text-center text-xs text-gray-400">
            Secure booking • Free cancellation available
          </p>
        </div>
      </div>
    </aside>
  );
}