"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [apartments, setApartments] = useState([]);
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    let query = supabase.from('apartments').select('*');

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    const { data, error } = await query;

    if (error) console.error('Error fetching apartments:', error);
    else setApartments(data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApartments();
  };

  return (
    <div className="mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Welcome to My Apartment App</h1>
        <div className="flex justify-center space-x-4">
          <Link href="/apartments" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300">
            Add Apartments
          </Link>
        </div>
      </header>
      <main>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border rounded w-full text-black"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 border rounded w-full text-black"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Search
            </button>
          </div>
        </form>
        <ul className="space-y-4">
          {apartments.map(apartment => (
            <li key={apartment.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold text-gray-800">{apartment.name}</h2>
              <p className="text-gray-600">{apartment.location}</p>
              <p className="text-gray-600">{apartment.price}</p>
              <p className="text-gray-600">{apartment.description}</p>
              <Link href={`/apartments/${apartment.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
