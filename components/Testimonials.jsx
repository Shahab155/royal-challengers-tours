'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Sample Data (Replace with real reviews later)
const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "London, UK",
    image: "",
    destinationImage: "/images/gallery/2.jpg", // Taj Mahal/Pakistan vibe
    rating: 5,
    quote: "The tour to Hunza Valley was absolutely magical. The guides were incredibly knowledgeable and the logistics were flawless. I felt safe and welcomed every step of the way.",
    trip: "Northern Pakistan Expedition"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    image: "",
    destinationImage: "/images/gallery/2.jpg", // Desert vibe
    rating: 5,
    quote: "I've traveled to 30+ countries, but the hospitality in Pakistan is unmatched. This agency curated the perfect mix of adventure and luxury. The glamping experience was a highlight!",
    trip: "Luxury Desert Safari"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Madrid, Spain",
    image: "",
    destinationImage: "/images/gallery/2.jpg", // Mountains
    rating: 5,
    quote: "Booking was easy, and the team handled my visa questions instantly. The itinerary was flexible enough to let us explore on our own too. Highly recommended!",
    trip: "Cultural Heritage Tour"
  },
  {
    id: 4,
    name: "James & Sophie",
    location: "Sydney, Australia",
    image: "",
    destinationImage: "/images/gallery/2.jpg", // City/Lahore
    rating: 4,
    quote: "A wonderful family trip. The guides were great with our kids, and the food tours in Lahore were delicious. Just wish we had booked a longer stay!",
    trip: "Taste of Lahore"
  },
];

// Horizontal Loop Helper Function (adapted from GSAP docs)
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let onChange = config.onChange,
    lastIndex = 0,
    tl = gsap.timeline({repeat: config.repeat, onUpdate: onChange && function() {
      let i = tl.closestIndex()
      if (lastIndex !== i) {
        lastIndex = i;
        onChange(items[i], i);
      }
    }, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    spaceBefore = [],
    xPercents = [],
    curIndex = 0,
    center = config.center,
    clone = obj => {
      let result = {}, p;
      for (p in obj) {
        result[p] = obj[p];
      }
      return result;
    },
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
    timeOffset = 0, 
    container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
    totalWidth,
    getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + spaceBefore[0] + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
    populateWidths = () => {
      let b1 = container.getBoundingClientRect(), b2;
      items.forEach((el, i) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
        xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
        b2 = el.getBoundingClientRect();
        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
        b1 = b2;
      });
      gsap.set(items, {xPercent: i => xPercents[i]});
      totalWidth = getTotalWidth();
    },
    timeWrap,
    populateOffsets = () => {
      timeOffset = center ? tl.duration() * (container.offsetHeight / 2) / totalWidth : 0;
      center && times.forEach((t, i) => {
        times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
      });
    },
    getClosest = (values, value, wrap) => {
      let i = values.length,
        closest = 1e10,
        index = 0, d;
      while (i--) {
        d = Math.abs(values[i] - value);
        if (d > wrap / 2) {
          d = wrap - d;
        }
        if (d < closest) {
          closest = d;
          index = i;
        }
      }
      return index;
    },
    populateTimeline = () => {
      let i, item, curX, distanceToStart, distanceToLoop;
      tl.clear();
      for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
          .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
          .add("label" + i, distanceToStart / pixelsPerSecond);    
        times[i] = distanceToStart / pixelsPerSecond;
      }
      timeWrap = gsap.utils.wrap(0, tl.duration());
    }, 
    refresh = (deep) => {
       let progress = tl.progress();
       tl.progress(0, true);
       populateWidths();
       deep && populateTimeline();
       populateOffsets();
       deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
    },
    proxy;
  gsap.set(items, {x: 0});
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", () => refresh(true));
  function toIndex(index, vars) {
    vars = clone(vars);
    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (vars.revolutions) {
      time += tl.duration() * Math.round(vars.revolutions);
      delete vars.revolutions;
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = {time: timeWrap};
    }
    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(proxy);
    return tl.tweenTo(time, vars);
  }
  tl.elements = items;
  tl.next = vars => toIndex(curIndex+1, vars);
  tl.previous = vars => toIndex(curIndex-1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.closestIndex = setCurrent => {
    let index = getClosest(times, tl.time(), tl.duration());
    setCurrent && (curIndex = index);
    return index;
  };
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  tl.closestIndex(true);
  onChange && onChange(items[curIndex], curIndex);
  return tl;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const loopRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        if (loopRef.current) {
          loopRef.current.next({duration: 0.8, ease: "power3.inOut"});
        }
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying]);

  useGSAP(() => {
    const items = gsap.utils.toArray(sliderRef.current.children);
    loopRef.current = horizontalLoop(items, {
      paused: true,
      repeat: -1,
      onChange: (element, index) => setCurrentIndex(index)
    });
  }, {scope: containerRef});

  const handleNext = () => {
    clearInterval(intervalRef.current); // Reset auto-play timer on manual navigation
    loopRef.current.next({duration: 0.8, ease: "power3.inOut"});
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        loopRef.current.next({duration: 0.8, ease: "power3.inOut"});
      }, 5000);
    }
  };

  const handlePrev = () => {
    clearInterval(intervalRef.current);
    loopRef.current.previous({duration: 0.8, ease: "power3.inOut"});
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        loopRef.current.next({duration: 0.8, ease: "power3.inOut"});
      }, 5000);
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="py-20 lg:py-28 bg-[var(--color-bg)] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          
          <h3 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Stories from Our Travelers
          </h3>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Real experiences from adventurers who have explored the beauty of Pakistan with us.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          
          {/* Main Slider Track */}
          <div className="overflow-hidden">
            <div 
              ref={sliderRef}
              className="flex"
            >
              {testimonials.map((item) => (
                <div 
                  key={item.id} 
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                >
                  {/* Testimonial Card */}
                  <div className="h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    
                    {/* Card Header Image (Destination) */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={item.destinationImage} 
                        alt={item.trip}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-xs font-semibold uppercase tracking-wider bg-accent-500 px-2 py-1 rounded-md text-white mb-1 inline-block">
                          Verified Trip
                        </span>
                        <p className="font-heading text-lg">{item.trip}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 flex-1 flex flex-col">
                      {/* Stars */}
                      <div className="flex space-x-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-5 h-5 ${i < item.rating ? 'text-accent-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="flex-1 mb-6">
                        <p className="text-[var(--color-text-secondary)] italic leading-relaxed">
                          "{item.quote}"
                        </p>
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center pt-6 border-t border-[var(--color-border)]">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white dark:border-gray-700 shadow-sm">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--color-text)] text-sm">{item.name}</h4>
                          <p className="text-xs text-[var(--color-text-secondary)]">{item.location}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12 px-4">
             {/* Progress Dots */}
             <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => loopRef.current.toIndex(index, {duration: 0.8, ease: "power3.inOut"})}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary-500 w-8' 
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-primary-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
             </div>

             {/* Arrow Buttons */}
             <div className="flex space-x-3">
               <button 
                 onClick={handlePrev}
                 className="p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-95"
                 aria-label="Previous testimonial"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                 </svg>
               </button>
               <button 
                 onClick={handleNext}
                 className="p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-95"
                 aria-label="Next testimonial"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                 </svg>
               </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}