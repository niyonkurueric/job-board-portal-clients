import { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { MapPin, Check, ChevronDown } from 'lucide-react';

const locations = [
  { value: '', label: 'All Locations' },
  { value: 'remote', label: 'Remote' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'london', label: 'London' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'toronto', label: 'Toronto' },
  { value: 'sydney', label: 'Sydney' }
];

export default function LocationDropdown() {
  const [selected, setSelected] = useState(locations[0]);

  return (
<div className="relative w-64 z-[999]">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <span className="block truncate">{selected.label}</span>
            <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none text-lg">
              {locations.map((location) => (
                <Listbox.Option
                  key={location.value}
                  value={location}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-12 pr-4 ${
                      active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {location.label}
                      </span>
                      {selected ? (
                        <Check className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" />
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
